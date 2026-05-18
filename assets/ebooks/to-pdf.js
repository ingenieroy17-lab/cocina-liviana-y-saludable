const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const files = [
  'ebook-principal.html',
  'bono1-planificador.html',
  'bono2-jugos-detox.html',
  'bono3-sin-tacc.html',
  'bono4-sin-harinas.html',
  'bono5-postres-snacks.html'
];

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  for (const file of files) {
    const htmlPath = path.join(__dirname, file);
    const pdfName = file.replace('.html', '.pdf');
    const pdfPath = path.join(__dirname, pdfName);
    console.log(`Convirtiendo ${file}...`);
    const page = await browser.newPage();
    const content = fs.readFileSync(htmlPath, 'utf8');
    await page.setContent(content, {waitUntil: 'networkidle0', timeout: 60000});
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {top: '2cm', bottom: '2cm', left: '2.5cm', right: '2.5cm'}
    });
    await page.close();
    console.log(`  ✅ ${pdfName} generado`);
  }
  await browser.close();
  console.log('\n🎉 Todos los PDFs generados!');
})();
