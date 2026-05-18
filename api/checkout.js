import { MercadoPagoConfig, Preference } from 'mercadopago';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      throw new Error("Missing MP_ACCESS_TOKEN environment variable");
    }

    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const { nombre, apellido, email } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({ error: "Faltan datos obligatorios del usuario" });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const response = await preference.create({
      body: {
        items: [
          {
            id: 'ebook-bonos-v1',
            title: 'Ebook Cocina Liviana + 5 Bonos',
            quantity: 1,
            unit_price: 15999,
            currency_id: 'ARS'
          }
        ],
        payer: {
          name: nombre,
          surname: apellido,
          email: email
        },
        back_urls: {
          success: `${origin}/`,
          failure: `${origin}/`,
          pending: `${origin}/`
        },
        auto_return: 'approved',
      }
    });

    res.status(200).json({ init_point: response.init_point });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
}
