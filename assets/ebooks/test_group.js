const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY || "";

// We will use 3 real images from the project to test
const mainImagesDir = path.join(__dirname, '..', 'images', 'imagenes dentro de libros', 'Ebook - Cocina Liviana y Saludable - fotos');
if (!fs.existsSync(mainImagesDir)) {
  console.error("Directory not found:", mainImagesDir);
  process.exit(1);
}
const imgFiles = fs.readdirSync(mainImagesDir).slice(0, 3);

async function testBatch() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`;
  
  const parts = [
    {
      text: `Analiza si cada una de las imágenes adjuntas corresponde visualmente a la receta asignada. Las imágenes están en el mismo orden que las recetas listadas abajo.
      
Receta 1: "Ensalada César Liviana" - Tip: "Usa yogur natural en el aderezo para mantener la cremosidad con menos calorías."
Receta 2: "Ensalada Mediterránea con Garbanzos" - Tip: "Los garbanzos aportan proteína y fibra, haciéndola muy saciante."
Receta 3: "Ensalada Tibia de Pollo y Batata" - Tip: "La batata asada aporta carbohidratos complejos y un toque dulce delicioso."

Responde ESTRICTAMENTE en formato JSON con la siguiente estructura de array:
[
  {
    "index": 1,
    "correcto": true/false,
    "motivo": "Explicación"
  },
  {
    "index": 2,
    "correcto": true/false,
    "motivo": "Explicación"
  },
  {
    "index": 3,
    "correcto": true/false,
    "motivo": "Explicación"
  }
]`
    }
  ];

  imgFiles.forEach((file, idx) => {
    const imgPath = path.join(mainImagesDir, file);
    const data = fs.readFileSync(imgPath).toString('base64');
    const mimeType = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
    parts.push({
      inlineData: {
        mimeType,
        data
      }
    });
  });

  const payload = {
    contents: [{ parts }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log(`Status: ${response.status}`);
    const resJson = await response.json();
    if (response.ok) {
      console.log(resJson.candidates[0].content.parts[0].text);
    } else {
      console.log(JSON.stringify(resJson));
    }
  } catch (e) {
    console.error(e);
  }
}

testBatch();
