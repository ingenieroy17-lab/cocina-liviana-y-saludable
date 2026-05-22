---
name: creador-contenido-meta
description: "Crea contenido publicitario, posts, stories y portadas para Instagram y Facebook, generando tanto el texto como las imágenes reales de soporte. Triggers: 'crear post instagram', 'generar contenido redes', 'crear story instagram', 'post para facebook', 'creador de contenido meta', 'redactar publicacion'."
---

# Creador de Contenido para Redes (Meta)

Esta skill permite generar de forma interactiva y optimizada copys, estructuras de stories y prompts de diseño para Instagram y Facebook.

**Regla fundamental: Siempre solicita el tema primero. Si faltan datos opcionales (público u tono), indícalo amigablemente pero genera la propuesta de igual forma.**

---

## Paso 1 — Recoger Información y Selección del Tipo de Post

1. Pregunta de forma conversacional los siguientes datos:
   - **Tema principal** (Requerido)
   - **Público objetivo** (Opcional - si no se define, se asumirá público general interesado en bienestar y recetas saludables)
   - **Tono de comunicación** (Opcional - por ejemplo: persuasivo, informativo, cercano, divertido. Por defecto: cercano y profesional)

2. Pregunta interactivamente qué tipo de post desea generar (indicando sus dimensiones recomendadas):
   - **Story de Instagram**: 1080 x 1920 px (Relación de aspecto 9:16).
   - **Post en el Feed**:
     - *Vertical (Recomendado)*: 1080 x 1350 px (Relación 4:5).
     - *Cuadrado*: 1080 x 1080 px (Relación 1:1).
     - *Reel / Video*: 1080 x 1920 px (Relación 9:16).
   - **Foto de Perfil (Instagram/Facebook)**: 320 x 320 px (Relación 1:1, recortado en círculo).
   - **Portada para Facebook**:
     - *Página*: 820 x 312 px (ordenador) y 640 x 360 px (móvil) - *Recomendado*: 820 x 360 px con zonas seguras.
     - *Grupo*: 1640 x 856 px (Relación 1.91:1).

3. Si falta el público objetivo o tono, avisa amigablemente qué datos no se ingresaron y cómo se han completado por defecto, procediendo con la generación sin bloquear el flujo.

---

## Paso 2 — Redacción y Diseño Visual

Genera el contenido según el tipo de publicación seleccionado, especificando claramente al inicio del output las dimensiones recomendadas:

### A. Para Story de Instagram
- **Dimensiones oficiales**: 1080 x 1920 px (9:16).
- **Estructura visual**: Distribución de elementos en pantalla (zona de texto, sticker de interacción, etc.).
- **Texto en pantalla**: Copys ultra cortos y ganchos.
- **Sticker recomendado**: Encuestas, preguntas o barra de deslizamiento para fomentar engagement.
- **Prompt de imagen**: Prompt optimizado para DALL-E / Midjourney si requiere fondo o imagen de soporte, indicando las dimensiones 1080x1920 (aspect ratio `--ar 9:16`).

### B. Para Post de Instagram/Facebook
- **Dimensiones oficiales**:
  - Feed Vertical: 1080 x 1350 px (4:5) [Recomendado para feed].
  - Feed Cuadrado: 1080 x 1080 px (1:1).
  - Reel: 1080 x 1920 px (9:16).
- **Gancho (Hook)**: Primera línea llamativa.
- **Cuerpo del post**: Texto estructurado con emojis y saltos de línea para lectura fluida.
- **Llamado a la Acción (CTA)**: Qué debe hacer el usuario.
- **Hashtags sugeridos**: Grupo de 5 a 10 hashtags relevantes.
- **Prompt/Idea de diseño**: Idea para el carrusel o imagen única y su prompt de generación (especificando `--ar 4:5`, `--ar 1:1` o `--ar 9:16`).

### C. Para Foto de Perfil o Portada
- **Dimensiones oficiales**:
  - Perfil: 320 x 320 px (diseñar centrado en círculo).
  - Portada Página: 820 x 360 px.
  - Portada Grupo: 1640 x 856 px.
- **Concepto de marca**: Explicación de los colores y elementos recomendados.
- **Prompt de generación de imagen**: Un prompt detallado en inglés optimizado para DALL-E/Midjourney, indicando la relación de aspecto adecuada (`--ar 1:1`, `--ar 820:360` o `--ar 1640:856`).

---

## Paso 3 — Generación de Activos (Imágenes/Videos) y Guardado del Resultado

1. **Generación del Recurso Visual/Multimedia:**
   - **Para Imágenes Estáticas (Posts, Stories estáticas, Portadas):** Utiliza la herramienta `generate_image` para crear el diseño visual basado en el prompt definido en el Paso 2. Guarda la imagen en `assets/images/posts/post-[tipo]-[fecha].png` (creando carpetas si no existen).
   - **Para Reels / Clips de Video:**
     1. Genera los frames o imágenes clave de soporte en resolución 1080x1920 px (relación de aspecto 9:16) con la herramienta `generate_image`.
     2. Escribe y ejecuta un script en Python (utilizando librerías como `opencv-python`, `moviepy` o interactuando con la herramienta CLI `ffmpeg`) para animar las imágenes generadas. Aplica movimientos de cámara sutiles (como zoom o paneo Ken Burns), transiciones suaves o superposición de texto durante un intervalo de 5 a 15 segundos.
     3. Guarda el video de salida en formato MP4 en la ruta `assets/videos/posts/reel-[fecha].mp4` (creando las carpetas si no existen).
2. **Guardar el Post:** Crea un archivo markdown dentro de la carpeta del proyecto con el formato `contenido-redes/post-[tipo]-[fecha].md`.
   - En este archivo, incluye el copy, los hashtags y el enlace al recurso multimedia generado: `![Diseño Visual](/absolute/path/to/imagen.png)` o bien `[Video Reel](file:///absolute/path/to/video.mp4)`.
3. **Mostrar el Resultado:** Muestra un resumen del contenido generado y los recursos embebidos o enlazados en el chat, detallando las rutas absolutas de los archivos creados.
4. **Iteración:** Pregunta si desea realizar algún ajuste en el tono, cambiar el formato, o generar una nueva versión del video/imagen si es necesario.

