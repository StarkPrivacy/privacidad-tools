# Privacidad Tools

Utilidades de privacidad **client-side / offline-first**.

Misma paleta que privacidad.me (`void`, `panel`, `neon`, `steel`, `mist`). Diseño diferenciado: sin sidebar, herramientas a ancho completo, descripciones educativas y prioridad al procesamiento local.

## Herramientas

- Generador de nombres (varios estilos distintos, un resultado + Re-generar)
- Generador de contraseñas (entropía estimada, consejos de gestores)
- Centro de filtraciones de correo (hub informativo + contexto de acción)
- Limpiador de metadatos (barra de progreso + descarga)
- Identificadores cortos offline (sin CORS ni servicios externos)
- Compresor de imágenes (progreso + descarga bajo demanda)
- Convertidor (imágenes offline; base para más tipos)
- Calculadora de hashes (SHA-256 / SHA-1)
- Frases de paso (passphrases memorables)

## Por qué el acortador público fallaba

Los acortadores externos reciben la URL en sus servidores. Además, muchas APIs no permiten peticiones cross-origin desde el navegador (CORS). Por eso se sustituyó por identificadores generados y, si se desea, guardados solo en `localStorage` del usuario.

## Uso

Activa GitHub Pages (branch `main`, root). URL típica: `https://starkprivacy.github.io/privacidad-tools/`.

Una vez cargada la página, la mayoría de herramientas funcionan sin conexión.
