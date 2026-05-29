const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const files = [
  { html: 'ebook-principal.html', pdf: 'Ebook - Cocina Liviana y Saludable.pdf' },
  { html: 'bono1-planificador.html', pdf: 'Bono1 - Planificador.pdf' },
  { html: 'bono2-jugos-detox.html', pdf: 'Bono2 - Jugos Detox.pdf' },
  { html: 'bono3-sin-tacc.html', pdf: 'Bono3 - Sin TACC.pdf' },
  { html: 'bono4-sin-harinas.html', pdf: 'Bono4 - Sin Harinas.pdf' },
  { html: 'bono5-postres-snacks.html', pdf: 'Bono5 - Postres Snacks.pdf' }
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  for (const item of files) {
    const htmlPath = path.resolve(__dirname, item.html);
    const pdfPath = path.resolve(__dirname, '..', 'pdf', item.pdf);
    console.log(`Convirtiendo ${item.html}...`);
    const page = await browser.newPage();
    
    // Usar page.goto con la URL file:// en vez de page.setContent evita enviar strings gigantescos por WebSocket
    const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
    await page.goto(fileUrl, {waitUntil: 'load', timeout: 120000});
    
    const pdfDir = path.dirname(pdfPath);
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true
    });
    await page.close();
    console.log(`  ✅ ${item.pdf} generado`);
  }
  await browser.close();
  console.log('\n🎉 Todos los PDFs generados!');
})();
