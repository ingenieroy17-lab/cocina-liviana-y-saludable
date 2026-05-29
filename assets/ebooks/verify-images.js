const fs = require('fs');
const path = require('path');

// 1. Cargar .env si existe
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  });
}

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('\n❌ Error: La variable de entorno GEMINI_API_KEY no está configurada.');
  process.exit(1);
}

// 2. Importar datos de recetas
const {ch1, ch2} = require('./data-ch1-2');
const {ch3, ch4, ch5} = require('./data-ch3-5');
const {ch6, ch7, ch8, ch9} = require('./data-ch6-9');
const {jugos, sinTacc} = require('./data-bonos2-3');
const {sinHarinas} = require('./data-bono4');
const {postresFrios, postresHorno, energyBalls} = require('./data-bono5a');
const {snacksSalados, snacksRapidos} = require('./data-bono5b');

// 3. Mapear recetas de Ebook Principal
const mainImagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'Ebook - Cocina Liviana y Saludable - fotos');
const mainImageFiles = fs.existsSync(mainImagesDir) ? fs.readdirSync(mainImagesDir) : [];

let globalRecipeIdx = 1;
const mainRecipes = [];
[ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9].forEach(ch => {
  ch.recipes.forEach(r => {
    const idx = globalRecipeIdx++;
    const imgFile = mainImageFiles.find(file => file.startsWith(`receta_${idx}_`));
    mainRecipes.push({
      book: 'Ebook Principal',
      num: idx,
      name: r.n,
      tip: r.tip,
      imgPath: imgFile ? path.join(mainImagesDir, imgFile) : null
    });
  });
});

// 3b. Mapear recetas de Bono 2
const bono2ImagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'Bono2 - Jugos Detox - fotos');
const bono2ImageFiles = fs.existsSync(bono2ImagesDir) ? fs.readdirSync(bono2ImagesDir) : [];

let bono2RecipeIdx = 1;
const bono2Recipes = [];
jugos.forEach(section => {
  section.recipes.forEach(r => {
    const idx = bono2RecipeIdx++;
    const imgFile = bono2ImageFiles.find(file => file.startsWith(`bono2_receta_${idx}_`));
    bono2Recipes.push({
      book: 'Bono 2 - Jugos Detox',
      num: idx,
      name: r.n,
      tip: r.tip,
      imgPath: imgFile ? path.join(bono2ImagesDir, imgFile) : null
    });
  });
});

// 3c. Mapear recetas de Bono 3
const bono3ImagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'Bono3 - Recetas sin TACC - fotos');
const bono3ImageFiles = fs.existsSync(bono3ImagesDir) ? fs.readdirSync(bono3ImagesDir) : [];

let bono3RecipeIdx = 1;
const bono3Recipes = [];
sinTacc.forEach(section => {
  section.recipes.forEach(r => {
    const idx = bono3RecipeIdx++;
    const imgFile = bono3ImageFiles.find(file => file.startsWith(`bono3_receta_${idx}_`));
    bono3Recipes.push({
      book: 'Bono 3 - Sin TACC',
      num: idx,
      name: r.n,
      tip: r.tip,
      imgPath: imgFile ? path.join(bono3ImagesDir, imgFile) : null
    });
  });
});

// 4. Mapear recetas de Bono 4
const bono4ImagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'bono4 - Recetas sin Harinas - fotos');
const bono4ImageFiles = fs.existsSync(bono4ImagesDir) ? fs.readdirSync(bono4ImagesDir) : [];

let bono4RecipeIdx = 1;
const bono4Recipes = [];
sinHarinas.forEach(section => {
  section.recipes.forEach(r => {
    const idx = bono4RecipeIdx++;
    const imgFile = bono4ImageFiles.find(file => file.startsWith(`bono4_receta_${idx}_`));
    bono4Recipes.push({
      book: 'Bono 4 - Sin Harinas',
      num: idx,
      name: r.n,
      tip: r.tip,
      imgPath: imgFile ? path.join(bono4ImagesDir, imgFile) : null
    });
  });
});

// 5. Mapear recetas de Bono 5
const bono5ImagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'bono5 - Postres y Snacks - fotos');
const bono5ImageFiles = fs.existsSync(bono5ImagesDir) ? fs.readdirSync(bono5ImagesDir) : [];

let bono5RecipeIdx = 1;
const bono5Recipes = [];
[postresFrios, postresHorno, energyBalls, snacksSalados, snacksRapidos].forEach(section => {
  section.recipes.forEach(r => {
    const idx = bono5RecipeIdx++;
    const imgFile = bono5ImageFiles.find(file => file.startsWith(`bono5_receta_${idx}_`));
    bono5Recipes.push({
      book: 'Bono 5 - Postres y Snacks',
      num: idx,
      name: r.n,
      tip: r.tip,
      imgPath: imgFile ? path.join(bono5ImagesDir, imgFile) : null
    });
  });
});

const allRecipes = [...mainRecipes, ...bono2Recipes, ...bono3Recipes, ...bono4Recipes, ...bono5Recipes];
const recipesToVerify = allRecipes.filter(r => r.imgPath !== null);

// Lista de modelos multimodal con soporte gratuito
const MODELS = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-flash"];
let currentModelIdx = 0;

async function verifyBatchWithGemini(batch) {
  const modelName = MODELS[currentModelIdx];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

  const recipesText = batch.map((r, i) => {
    const key = `${r.book} - Receta ${r.num}`;
    return `Receta ${i + 1} (Clave: "${key}"): "${r.name}" - Detalle: "${r.tip || ''}"`;
  }).join('\n');

  const parts = [
    {
      text: `Analiza si cada una de las imágenes adjuntas corresponde visualmente a la receta asignada. Las imágenes están en el mismo orden que las recetas listadas abajo (la primera imagen corresponde a la Receta 1, la segunda a la Receta 2, etc.).
      
${recipesText}

Responde ESTRICTAMENTE en formato JSON con la siguiente estructura de array:
[
  {
    "key": "Clave de la receta analizada",
    "correcto": true/false,
    "motivo": "Explicación breve de por qué no coincide o por qué está bien"
  }
]`
    }
  ];

  // Adjuntar imágenes en orden
  batch.forEach(r => {
    const imgBuffer = fs.readFileSync(r.imgPath);
    const base64Img = imgBuffer.toString('base64');
    const mimeType = r.imgPath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Img
      }
    });
  });

  const payload = {
    contents: [{ parts }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  let retries = 3;
  while (retries > 0) {
    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (fetchErr) {
      console.log(`  ⚠️ Error de red con modelo ${modelName}: ${fetchErr.message}. Reintentando en 5 segundos...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      retries--;
      continue;
    }

    if (response.status === 429) {
      const errText = await response.text();
      console.log(`  ⚠️ Cuota alcanzada (429) en modelo ${modelName}.`);

      if (errText.includes("GenerateRequestsPerDay") || errText.includes("limit: 20") || errText.includes("GenerateRequestsPerDayPerProjectPerModel")) {
        console.log(`  🚨 Límite DIARIO alcanzado para ${modelName}. Cambiando de modelo...`);
        currentModelIdx++;
        if (currentModelIdx >= MODELS.length) {
          throw new Error("Se han agotado los límites de TODOS los modelos disponibles.");
        }
        return verifyBatchWithGemini(batch); // Reintentar con el nuevo modelo
      }

      console.log(`  ⏳ Límite de solicitudes por minuto (RPM) alcanzado. Esperando 45 segundos para reintentar...`);
      await new Promise(resolve => setTimeout(resolve, 45000));
      retries--;
      continue;
    }

    if (response.status === 503 || response.status === 500 || response.status === 504) {
      const errText = await response.text();
      console.log(`  ⚠️ Modelo ${modelName} temporalmente no disponible (Status ${response.status}): ${errText.substring(0, 100)}. Reintentando en 10 segundos...`);
      await new Promise(resolve => setTimeout(resolve, 10000));
      retries--;
      continue;
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API error (${response.status}): ${errText}`);
    }

    try {
      const resJson = await response.json();
      if (!resJson.candidates || !resJson.candidates[0] || !resJson.candidates[0].content) {
        throw new Error("Respuesta incompleta de la API");
      }
      let textResponse = resJson.candidates[0].content.parts[0].text;
      if (textResponse.includes('```')) {
        textResponse = textResponse.replace(/```json|```/g, '').trim();
      }
      return JSON.parse(textResponse);
    } catch (parseErr) {
      console.log(`  ⚠️ Error al procesar respuesta JSON de ${modelName}. Reintentando en 5 segundos...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      retries--;
      continue;
    }
  }

  // Si se agotaron los reintentos para este modelo, cambiamos de modelo
  console.log(`  🚨 Agotados los reintentos para el modelo ${modelName}. Cambiando de modelo...`);
  currentModelIdx++;
  if (currentModelIdx >= MODELS.length) {
    throw new Error("Se agotaron todos los modelos y reintentos para este lote.");
  }
  return verifyBatchWithGemini(batch);
}

(async () => {
  console.log(`\n🔍 Iniciando verificación de imágenes POR LOTES con Gemini API...`);
  console.log(`Total de recetas cargadas: ${allRecipes.length}`);
  console.log(`Recetas con imágenes para verificar: ${recipesToVerify.length}\n`);

  const reportFile = path.join(__dirname, 'reporte_verificacion_gemini.txt');
  fs.writeFileSync(reportFile, `REPORTE DE VERIFICACIÓN DE IMÁGENES POR IA (POR LOTES)\nGenerado: ${new Date().toISOString()}\n\n`);

  const batchSize = 10;
  let correctCount = 0;
  let errorCount = 0;

  for (let i = 0; i < recipesToVerify.length; i += batchSize) {
    const batch = recipesToVerify.slice(i, i + batchSize);
    console.log(`📦 Procesando lote [${Math.floor(i / batchSize) + 1}/${Math.ceil(recipesToVerify.length / batchSize)}] (Recetas ${i + 1} - ${Math.min(i + batchSize, recipesToVerify.length)})...`);

    try {
      // Delay de 12 segundos para estar totalmente a salvo de RPM
      await new Promise(resolve => setTimeout(resolve, 12000));

      const results = await verifyBatchWithGemini(batch);
      
      results.forEach(result => {
        if (result.correcto) {
          correctCount++;
          console.log(`  ✅ OK - ${result.key}`);
          fs.appendFileSync(reportFile, `[OK] ${result.key} - ${result.motivo}\n`);
        } else {
          errorCount++;
          console.log(`  ❌ ERROR - ${result.key} - ${result.motivo}`);
          fs.appendFileSync(reportFile, `[ERROR] ${result.key} - ${result.motivo}\n`);
        }
      });

    } catch (error) {
      console.error(`  ⚠️ Falló el lote que iniciaba en receta ${i + 1}:`, error.message);
      batch.forEach(r => {
        const key = `${r.book} - Receta ${r.num}`;
        fs.appendFileSync(reportFile, `[FALLO] ${key} - Error: ${error.message}\n`);
      });
    }
  }

  console.log(`\n🎉 Verificación por lotes finalizada.`);
  console.log(`Total de imágenes con recetas: ${recipesToVerify.length}`);
  console.log(`✅ Correctas: ${correctCount}`);
  console.log(`❌ Con discrepancias: ${errorCount}`);
  console.log(`\nReporte detallado guardado en: ${reportFile}`);
})();
