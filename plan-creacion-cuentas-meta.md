# Plan de Creación de Cuentas: Meta, Facebook e Instagram
**Proyecto:** Cocina Liviana y Saludable (Ebook)

Este plan detalla los pasos para registrar, configurar y vincular los activos digitales necesarios para lanzar campañas de publicidad (Meta Ads).

---

## Paso 1: Preparación del Perfil Personal de Facebook
*   Identificar el perfil personal de Facebook de quien administrará los activos (debe estar verificado con identidad real por seguridad/bloqueos).
*   Activar la **Autenticación en Dos Pasos (2FA)** en el perfil personal.

## Paso 2: Creación de la Página de Facebook (Fanpage)
1.  Desde el perfil de Facebook, ir a **Páginas** > **Crear nueva página**.
2.  **Nombre:** Cocina Liviana y Saludable
3.  **Categoría:** Salud y bienestar / Cocina / Sitio web
4.  **Presentación:** Ebook con 100 recetas saludables y deliciosas de almuerzos y cenas. Antiinflamatorias, detox y aptas para celíacos.
5.  **Fotos:** 
    *   *Perfil:* Logotipo oficial del proyecto.
    *   *Portada:* Imagen representativa del ebook con platos saludables.

## Paso 3: Registro y Optimización de la Cuenta de Instagram Profesional
1.  **Registro:** Descargar la app de Instagram o ir a [instagram.com](https://instagram.com) y registrar una cuenta nueva.
    *   *Nombre de usuario sugerido:* `@cocina.liviana.saludable` o `@cocinalivianaysaludable`.
    *   *Nombre:* Cocina Liviana y Saludable | Recetas Ebook
2.  **Cambio a Profesional:** Ir a **Configuración** > **Tipo de cuenta y herramientas** > **Cambiar a cuenta profesional** (elegir *Creador* o *Empresa*). Vincular la categoría "Salud/Belleza" o "Cocina".
3.  **Optimización del Perfil (Bio enfocada en Ventas):**
    *   *Foto de Perfil:* Usar el logotipo oficial en alta resolución ([logo.png](file:///r:/ROY/FACULTAD%20Y%20TRABAJOS/EMPRENDIMIENTOS/IA/Antigravity%20Projects/RECETARIO%20SALUDABLE/assets/images/logo.png)).
    *   *Texto de la Biografía (150 caracteres máx.):*
        > 🍳 +100 recetas deliciosas y fáciles de almuerzos y cenas.
        > ✨ Antiinflamatorias, detox, veganas y sin TACC.
        > 👇 ¡Comenzá a comer sano hoy mismo con nuestro Ebook!
    *   *Enlace de redirección:* Añadir en el campo "Sitio web" la URL oficial de la landing page: `https://cocina-liviana-y-saludable.vercel.app/`.
4.  **Configuración de Historias Destacadas (Highlights):**
    *   **📖 Ebook:** Vista previa por dentro (tabla de contenidos y capturas del planificador/recetas).
    *   **💬 Opiniones:** Capturas de pantalla de comentarios y testimonios de compradores.
    *   **🛒 Cómo Comprar:** Tutorial rápido mostrando que al hacer clic en el enlace de la bio van a la landing, eligen su opción y pagan de manera segura.
5.  **Publicaciones Clave (Fijadas en el Perfil):**
    *   *Post 1:* Lanzamiento oficial del Ebook y el Pack de Bonos.
    *   *Post 2:* Video corto mostrando cómo es el planificador semanal digital.
    *   *Post 3:* El beneficio principal (ej. por qué comer comida antiinflamatoria ayuda al cuerpo).


## Paso 4: Creación del Administrador Comercial en Meta Business Suite
1.  Ingresar a [business.facebook.com](https://business.facebook.com/).
2.  Hacer clic en **Crear cuenta** para registrar el Portafolio Comercial de la marca.
3.  Completar los datos: Nombre del negocio, Nombre del administrador y Correo electrónico comercial.
4.  Confirmar el correo electrónico recibido de Meta.

## Paso 5: Vinculación de Activos en Meta Business Suite
1.  Ir a la **Configuración del negocio**.
2.  **Páginas:** Hacer clic en "Añadir" > "Añadir una página" e ingresar el nombre de la página de Facebook creada en el Paso 2.
3.  **Cuentas de Instagram:** Hacer clic en "Añadir" > "Conectar tu cuenta de Instagram" e iniciar sesión con las credenciales creadas en el Paso 3.

## Paso 6: Configuración de la Cuenta Publicitaria (Meta Ads)
1.  En la Configuración del negocio, ir a **Cuentas publicitarias**.
2.  Hacer clic en "Añadir" > "Crear una cuenta publicitaria".
3.  **Nombre de la cuenta:** Cocina Liviana y Saludable - Ads
4.  **Zona horaria y Divisa:** Configurar la local de facturación (ej: Argentina/ARS o USD).
5.  **Método de pago:** Añadir una tarjeta de crédito o débito activa para abonar los anuncios.

## Paso 7: Configuración del Pixel de Meta (Dataset) e Integración
1.  En la configuración comercial, ir a **Orígenes de datos** > **Conjuntos de datos** (anteriormente Píxeles) y crear uno nuevo.
2.  Copiar el código de identificación del Pixel.
3.  Insertar el código de seguimiento básico en el `<head>` del archivo [index.html](file:///r:/ROY/FACULTAD%20Y%20TRABAJOS/EMPRENDIMIENTOS/IA/Antigravity%20Projects/RECETARIO%20SALUDABLE/index.html) para trackear visitas.
4.  Configurar los eventos personalizados (clic en el botón de compra, inicio de pago, compra finalizada).
