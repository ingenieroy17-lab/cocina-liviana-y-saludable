import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Asegúrate de agregar esta variable de entorno en Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let paymentId;
    
    // Obtener ID del pago desde el body o la query string (depende de la versión de MP IPN)
    if (req.body && req.body.data && req.body.data.id) {
        paymentId = req.body.data.id;
    } else if (req.query && req.query['data.id']) {
        paymentId = req.query['data.id'];
    } else if (req.query && req.query.id) {
        paymentId = req.query.id;
    } else {
        return res.status(200).send('OK');
    }

    // Ignorar si no es una notificación de pago
    if ((req.body && req.body.type !== 'payment') && (req.query && req.query.topic !== 'payment' && req.query.type !== 'payment')) {
        return res.status(200).send('OK');
    }

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) throw new Error("Missing MP_ACCESS_TOKEN");
    
    const client = new MercadoPagoConfig({ accessToken: token });
    const paymentApi = new Payment(client);

    // Consultar el estado real del pago a Mercado Pago
    const payment = await paymentApi.get({ id: paymentId });

    // Si el pago fue aprobado, enviamos los emails
    if (payment.status === 'approved') {
        const metadata = payment.metadata || {};
        const customerEmail = metadata.email || payment.payer?.email;
        const customerName = metadata.nombre || payment.payer?.first_name || 'Cliente';

        // 1. Cargar PDFs desde la carpeta assets/pdf
        let attachments = [];
        try {
            const pdfDir = path.join(process.cwd(), 'assets', 'pdf');
            if (fs.existsSync(pdfDir)) {
                const files = fs.readdirSync(pdfDir);
                for (const file of files) {
                    if (file.endsWith('.pdf')) {
                        const filePath = path.join(pdfDir, file);
                        const fileContent = fs.readFileSync(filePath);
                        attachments.push({
                            filename: file,
                            content: fileContent
                        });
                    }
                }
            }
        } catch(err) {
            console.error("Error leyendo PDFs:", err);
            // Continúa aunque falle la lectura de adjuntos
        }

        // 2. Enviar Email al Cliente
        // IMPORTANTE: En producción el 'from' debe ser un dominio verificado en Resend
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Cambia esto por tu dominio verificado: hola@tudominio.com
            to: customerEmail,
            subject: '¡Tu Ebook Cocina Liviana y Saludable + Bonos! 🥗',
            html: `
                <h1>¡Hola ${customerName}!</h1>
                <p>Muchas gracias por tu compra. Tu pago fue procesado correctamente.</p>
                <p>Adjunto a este correo encontrarás tu Ebook "Cocina Liviana y Saludable" junto con todos los bonos exclusivos.</p>
                <p>¡Esperamos que disfrutes las recetas!</p>
                <br>
                <p>Un saludo,<br>El equipo de Cocina Liviana y Saludable.</p>
            `,
            attachments: attachments
        });

        // 3. Enviar Notificación al Administrador (A ti)
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Cambia esto por tu dominio verificado
            to: process.env.ADMIN_EMAIL || 'tu_email@gmail.com', // Cambia esto por tu email donde quieres recibir el aviso
            subject: `NUEVA VENTA 💰: ${customerName}`,
            html: `
                <h2>¡Nueva Venta Realizada! 🎉</h2>
                <p><strong>Cliente:</strong> ${customerName} ${metadata.apellido || ''}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                <p><strong>Pago ID:</strong> ${paymentId}</p>
                <p><strong>Monto:</strong> $${payment.transaction_amount} ARS</p>
            `
        });
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error("Error en Webhook:", error);
    // Para MP siempre devolver 200, sino reintentará infinitamente.
    // Solo en caso de error crítico damos 500 para debug interno.
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
