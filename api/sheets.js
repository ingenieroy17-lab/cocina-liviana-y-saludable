import { google } from 'googleapis';

/**
 * Registra una fila de venta en Google Sheets.
 * Requiere variables de entorno:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY
 *   GOOGLE_SHEET_ID
 */
export async function appendSale({ nombre, apellido, email, paymentId, monto }) {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  // Fecha en zona horaria de Argentina
  const fecha = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Ventas!A:F',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[nombre, apellido, email, fecha, paymentId, `$${monto} ARS`]]
    }
  });
}
