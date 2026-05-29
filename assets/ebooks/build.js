const fs = require('fs');
const path = require('path');
const {buildBook, buildPlanner, buildSimpleBook} = require('./generator');

function getBase64Image(filename) {
  const filePath = path.join(__dirname, '..', 'images', filename);
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${fileBuffer.toString('base64')}`;
  }
  console.log(`⚠️ Imagen no encontrada: ${filename}`);
  return '';
}

const mainCover = getBase64Image(path.join('portadas ebooks', 'ebook.png'));
const bono1Cover = getBase64Image(path.join('portadas ebooks', 'bono 1.png'));
const bono2Cover = getBase64Image(path.join('portadas ebooks', 'bono 2.png'));
const bono3Cover = getBase64Image(path.join('portadas ebooks', 'bono 3.png'));
const bono4Cover = getBase64Image(path.join('portadas ebooks', 'bono 4.png'));
const bono5Cover = getBase64Image(path.join('portadas ebooks', 'bono 5.png'));
const {ch1, ch2} = require('./data-ch1-2');
const {ch3, ch4, ch5} = require('./data-ch3-5');
const {ch6, ch7, ch8, ch9} = require('./data-ch6-9');
const {jugos, sinTacc} = require('./data-bonos2-3');
const {sinHarinas} = require('./data-bono4');
const {postresFrios, postresHorno, energyBalls} = require('./data-bono5a');
const {snacksSalados, snacksRapidos, plannerWeeks} = require('./data-bono5b');

const OUT = __dirname;

// 1. Ebook Principal
const mainIntro = `<h2>Bienvenida</h2>
<p>¡Felicitaciones por dar el primer paso hacia una alimentación más consciente! Este ebook reúne 100 recetas pensadas para almuerzos y cenas saludables, prácticas y deliciosas.</p>
<p>Cada receta incluye información nutricional aproximada, etiquetas de salud y un tip profesional para que cocinar sano sea fácil y placentero.</p>
<h3>Guía de etiquetas</h3>
<ul>
<li>🔵 <strong>Antiinflamatoria</strong> — Ingredientes que reducen la inflamación</li>
<li>🟢 <strong>Detox</strong> — Propiedades depurativas y desintoxicantes</li>
<li>🌿 <strong>Vegana</strong> — 100% de origen vegetal</li>
<li>🟣 <strong>Vegetariana</strong> — Sin carnes, puede contener lácteos o huevo</li>
<li>🟡 <strong>Celíaca (sin TACC)</strong> — Apta para personas con celiaquía</li>
</ul>
<h3>Tabla de equivalencias</h3>
<ul>
<li>1 taza = 250ml</li>
<li>1 cucharada (cda) = 15ml</li>
<li>1 cucharadita (cdita) = 5ml</li>
<li>Temperaturas de horno: moderado 170-180°C / fuerte 200-220°C</li>
</ul>
<p><em>⚠️ Disclaimer: Las calorías y valores nutricionales son aproximados. Consultá siempre a tu médico o nutricionista antes de realizar cambios significativos en tu alimentación. Si tenés alguna duda sobre tu plan de alimentación o considerás necesario un ajuste más personalizado, te recomendamos consultar con un profesional de la salud.</em></p>`;

const imagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'Ebook - Cocina Liviana y Saludable - fotos');
const imageFiles = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];

let globalRecipeIdx = 1;
// Preprocesar capítulos para cargar imágenes de recetas en base64
const chaptersWithImages = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9].map(chapter => {
  return {
    ...chapter,
    recipes: chapter.recipes.map(recipe => {
      const idx = globalRecipeIdx++;
      const imgFile = imageFiles.find(file => file.startsWith(`receta_${idx}_`));
      if (imgFile) {
        const imgRelPath = path.join('imagenes dentro de libros', 'Ebook - Cocina Liviana y Saludable - fotos', imgFile);
        return {
          ...recipe,
          imgBase64: getBase64Image(imgRelPath)
        };
      } else if (recipe.img) {
        return {
          ...recipe,
          imgBase64: getBase64Image(recipe.img)
        };
      }
      return recipe;
    })
  };
});

const mainBook = buildBook({
  title: 'Cocina Liviana y Saludable',
  subtitle: '100 Recetas para Almuerzos y Cenas que Nutren tu Cuerpo',
  author: '',
  brand: 'Cocina Liviana y Saludable',
  intro: mainIntro,
  coverImage: mainCover,
  chapters: chaptersWithImages
});
fs.writeFileSync(path.join(OUT, 'ebook-principal.html'), mainBook);
console.log('✅ Ebook Principal generado (100 recetas)');

// 2. Planificador Semanal
const planner = buildPlanner(plannerWeeks, bono1Cover);
fs.writeFileSync(path.join(OUT, 'bono1-planificador.html'), planner);
console.log('✅ Bono 1: Planificador Semanal generado');

// 3. Jugos Detox
const bono2ImagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'Bono2 - Jugos Detox - fotos');
const bono2ImageFiles = fs.existsSync(bono2ImagesDir) ? fs.readdirSync(bono2ImagesDir) : [];
let bono2RecipeIdx = 1;
const jugosWithImages = jugos.map(section => {
  return {
    ...section,
    recipes: section.recipes.map(recipe => {
      const idx = bono2RecipeIdx++;
      const imgFile = bono2ImageFiles.find(file => file.startsWith(`bono2_receta_${idx}_`));
      if (imgFile) {
        const imgRelPath = path.join('imagenes dentro de libros', 'Bono2 - Jugos Detox - fotos', imgFile);
        return {
          ...recipe,
          imgBase64: getBase64Image(imgRelPath)
        };
      }
      return recipe;
    })
  };
});

const jugosIntro = `<h2>¿Qué son los jugos detox?</h2>
<p>Los jugos detox son bebidas naturales a base de frutas y verduras que, integrados en una alimentación equilibrada, aportan vitaminas, minerales y antioxidantes de forma práctica.</p>
<p><strong>Importante:</strong> No sustituyen comidas ni tienen propiedades milagrosas. Tu cuerpo tiene sus propios sistemas de desintoxicación (hígado y riñones). Estos jugos son un complemento para nutrirte mejor.</p>
<h3>Tips generales</h3>
<ul>
<li>Usá licuadora (sin colar) para conservar la fibra</li>
<li>Priorizá más verduras que frutas para evitar picos de azúcar</li>
<li>Tomá inmediatamente para aprovechar los nutrientes</li>
<li>No reemplazan la hidratación con agua pura</li>
</ul>`;
const jugosBook = buildSimpleBook({
  title: 'Jugos Detox', subtitle: 'Recuperá tu Energía Natural',
  intro: jugosIntro, sections: jugosWithImages,
  coverImage: bono2Cover
});
fs.writeFileSync(path.join(OUT, 'bono2-jugos-detox.html'), jugosBook);
console.log('✅ Bono 2: Jugos Detox generado (22 recetas)');

// 4. Sin TACC
const bono3ImagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'Bono3 - Recetas sin TACC - fotos');
const bono3ImageFiles = fs.existsSync(bono3ImagesDir) ? fs.readdirSync(bono3ImagesDir) : [];
let bono3RecipeIdx = 1;
const sinTaccWithImages = sinTacc.map(section => {
  return {
    ...section,
    recipes: section.recipes.map(recipe => {
      const idx = bono3RecipeIdx++;
      const imgFile = bono3ImageFiles.find(file => file.startsWith(`bono3_receta_${idx}_`));
      if (imgFile) {
        const imgRelPath = path.join('imagenes dentro de libros', 'Bono3 - Recetas sin TACC - fotos', imgFile);
        return {
          ...recipe,
          imgBase64: getBase64Image(imgRelPath)
        };
      }
      return recipe;
    })
  };
});

const taccIntro = `<h2>Cocinar sin TACC</h2>
<p>TACC significa Trigo, Avena, Cebada y Centeno — los cereales que contienen gluten. Si sos celíaco o querés reducir el gluten, estas 20 recetas están 100% libres de estos ingredientes.</p>
<h3>Consejos importantes</h3>
<ul>
<li>Verificá que todos los productos tengan el logo "Sin TACC" o estén certificados</li>
<li>Cuidado con la contaminación cruzada en la cocina</li>
<li>La salsa de soja común contiene trigo; usá tamari o versión sin TACC</li>
<li>Los condimentos procesados pueden contener gluten oculto</li>
<li>En caso de duda, priorizá alimentos frescos y naturales</li>
</ul>`;
const taccBook = buildSimpleBook({
  title: '20 Recetas sin TACC', subtitle: 'Aptas Celíacos · Fáciles y Deliciosas',
  intro: taccIntro, sections: sinTaccWithImages,
  coverImage: bono3Cover
});
fs.writeFileSync(path.join(OUT, 'bono3-sin-tacc.html'), taccBook);
console.log('✅ Bono 3: 20 Recetas sin TACC generado');

// 5. Sin Harinas
const bono4ImagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'bono4 - Recetas sin Harinas - fotos');
const bono4ImageFiles = fs.existsSync(bono4ImagesDir) ? fs.readdirSync(bono4ImagesDir) : [];
let bono4RecipeIdx = 1;
const sinHarinasWithImages = sinHarinas.map(section => {
  return {
    ...section,
    recipes: section.recipes.map(recipe => {
      const idx = bono4RecipeIdx++;
      const imgFile = bono4ImageFiles.find(file => file.startsWith(`bono4_receta_${idx}_`));
      if (imgFile) {
        const imgRelPath = path.join('imagenes dentro de libros', 'bono4 - Recetas sin Harinas - fotos', imgFile);
        return {
          ...recipe,
          imgBase64: getBase64Image(imgRelPath)
        };
      }
      return recipe;
    })
  };
});

const harinasIntro = `<h2>¿Por qué reducir las harinas?</h2>
<p>Reducir el consumo de harinas refinadas puede ayudar a desinflamar el cuerpo, mejorar la digestión y mantener niveles de energía más estables durante el día.</p>
<p>Estas 30 recetas demuestran que se puede comer rico, variado y saciante sin ningún tipo de harina.</p>
<h3>Sustitutos inteligentes</h3>
<ul>
<li><strong>Base de pizza:</strong> Coliflor procesada + huevo</li>
<li><strong>Fideos:</strong> Zapallito espiralizado (zoodles)</li>
<li><strong>Pan rallado:</strong> Harina de almendras o avena procesada</li>
<li><strong>Wraps:</strong> Hojas de lechuga, láminas de huevo o alga nori</li>
<li><strong>Puré de papa:</strong> Puré de coliflor o calabaza</li>
</ul>`;
const harinasBook = buildSimpleBook({
  title: '30 Recetas sin Harinas', subtitle: 'Comé Liviano sin Resignar Sabor',
  intro: harinasIntro, sections: sinHarinasWithImages,
  coverImage: bono4Cover
});
fs.writeFileSync(path.join(OUT, 'bono4-sin-harinas.html'), harinasBook);
console.log('✅ Bono 4: 30 Recetas sin Harinas generado');

// 6. Postres y Snacks
const bono5ImagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'bono5 - Postres y Snacks - fotos');
const bono5ImageFiles = fs.existsSync(bono5ImagesDir) ? fs.readdirSync(bono5ImagesDir) : [];
let bono5RecipeIdx = 1;
const bono5Sections = [postresFrios, postresHorno, energyBalls, snacksSalados, snacksRapidos];
const bono5SectionsWithImages = bono5Sections.map(section => {
  return {
    ...section,
    recipes: section.recipes.map(recipe => {
      const idx = bono5RecipeIdx++;
      const imgFile = bono5ImageFiles.find(file => file.startsWith(`bono5_receta_${idx}_`));
      if (imgFile) {
        const imgRelPath = path.join('imagenes dentro de libros', 'bono5 - Postres y Snacks - fotos', imgFile);
        return {
          ...recipe,
          imgBase64: getBase64Image(imgRelPath)
        };
      }
      return recipe;
    })
  };
});

const postresIntro = `<h2>Dulce sin culpa</h2>
<p>Estas 50 recetas demuestran que comer sano y disfrutar del dulce no son cosas opuestas. Usamos endulzantes naturales, frutas y técnicas simples para crear postres y snacks que nutren sin sacrificar sabor.</p>
<h3>Endulzar sin azúcar refinada</h3>
<ul>
<li><strong>Banana madura:</strong> Endulza y aporta textura cremosa</li>
<li><strong>Dátiles:</strong> El endulzante natural más nutritivo (remojá para suavizar)</li>
<li><strong>Miel:</strong> En moderación, aporta antioxidantes (no apta veganos)</li>
<li><strong>Canela y vainilla:</strong> Realzan dulzor percibido sin calorías extra</li>
<li><strong>Cacao amargo:</strong> Sabor chocolate intenso, rico en antioxidantes</li>
</ul>`;
const postresBook = buildSimpleBook({
  title: '50 Postres y Snacks Saludables', subtitle: 'Dulce sin Culpa · Opciones Naturales',
  intro: postresIntro, sections: bono5SectionsWithImages,
  coverImage: bono5Cover
});
fs.writeFileSync(path.join(OUT, 'bono5-postres-snacks.html'), postresBook);
console.log('✅ Bono 5: 50 Postres y Snacks generado');

console.log('\n🎉 Todos los ebooks generados exitosamente!');
