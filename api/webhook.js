import { MercadoPagoConfig, Payment } from 'mercadopago';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Configurar el transportador de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // ej: ingenieroy17@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // Contraseña de aplicación de Google
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let paymentId;
    
    if (req.body && req.body.data && req.body.data.id) {
        paymentId = req.body.data.id;
    } else if (req.query && req.query['data.id']) {
        paymentId = req.query['data.id'];
    } else if (req.query && req.query.id) {
        paymentId = req.query.id;
    } else {
        return res.status(200).send('OK');
    }

    if ((req.body && req.body.type !== 'payment') && (req.query && req.query.topic !== 'payment' && req.query.type !== 'payment')) {
        return res.status(200).send('OK');
    }

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) throw new Error("Missing MP_ACCESS_TOKEN");
    
    const client = new MercadoPagoConfig({ accessToken: token });
    const paymentApi = new Payment(client);

    const payment = await paymentApi.get({ id: paymentId });

    if (payment.status === 'approved') {
        const metadata = payment.metadata || {};
        const customerEmail = metadata.email || payment.payer?.email;
        const customerName = metadata.nombre || payment.payer?.first_name || 'Cliente';

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
        }

        // Enviar Email al Cliente
        await transporter.sendMail({
            from: `"Cocina Liviana y Saludable" <${process.env.GMAIL_USER}>`,
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

        // Enviar Notificación al Administrador
        await transporter.sendMail({
            from: `"Ventas Bot" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
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
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
