# Changelog

Registro de trabajo de la sesión del 2026-09-08 sobre el sitio de Grupo Los Robles.

## Contenido y texto

- Eliminados todos los guiones largos ("—") del texto visible del sitio (eyebrows, copy, títulos, mensajes de formulario), en ES y EN. Regla permanente del proyecto: nunca reintroducir "—" en texto renderizado.

## Animación

- **Manifiesto** (`ManifestoSection.astro`): reveal de texto ligado al scroll — cada letra pasa de un color tenue (`--text-secondary-inverse`) a contraste total (`--text-primary-inverse`) a medida que la sección atraviesa el viewport (GSAP + ScrollTrigger, `scrub`). Split letra por letra vía `SplitText` con agrupación por palabra (`type: 'words, chars'`) para no partir palabras entre líneas.
- **Preloader** (`Preloader.astro`, nuevo): logo de Grupo Los Robles vectorizado (trazado automático desde el PNG/WebP oficial) que se "pinta" de abajo hacia arriba con `clip-path`, pausa, y el fondo verde de marca se desliza hacia arriba revelando la página. Bloquea el scroll (nativo + Lenis) mientras está activo; se salta por completo con `prefers-reduced-motion`.
- **VideoHero** (`VideoHero.astro`, reescrito): video de fondo fijo (sticky) con panel glassmorphism (`backdrop-filter`) que sube y lo cubre al hacer scroll, con CTA hacia Mil Sabores. Integrado como última sección antes del Footer.

## Diseño / sistema

- **Escala tipográfica fija** en `theme.css`: `--text-display` (H1, 88px), `--text-h2` (60px), `--text-h3` (44px) — valores fijos en píxeles, sin `clamp()`/`vw`, aplicados de forma consistente a todos los títulos del sitio (antes había inconsistencias, incluyendo un H3 que renderizaba más grande que su H2 padre). Se agregó `--text-quote` (44px) para párrafos editoriales largos (el Manifiesto), separado de los tokens de heading.
- **Excepción documentada**: el wordmark del Footer ("GRUPO LOS ROBLES") sigue usando `vw` a propósito — necesita caber en una sola línea a cualquier ancho de pantalla.
- **Footer rediseñado**: fondo verde de marca (`--brand-green`), texto café/tostado (`--text-secondary-inverse`), y wordmark gigante "GRUPO LOS ROBLES" con máscara de imagen (`background-clip: text`) usando la misma composición de 5 fotos de "Nuestras Divisiones".
- **Favicon**: reemplazado el placeholder genérico por el isotipo real de Grupo Los Robles (vectorizado, degradado verde muestreado del logo original).

## Performance

- Video comprimido 84.7MB → 9.4MB (89% menos, H.264 CRF 30, sin audio) sin pérdida visible.
- `og:image` comprimido 650KB → 82KB (87% menos).
- 3 imágenes del Hero reescaladas a 1920px máx. (regla del proyecto) y recomprimidas (~25-28% menos cada una).
- Originales sin comprimir respaldados en `_archive-media-original/` (fuera del repo, ver `.gitignore`).

## Corrección de comportamiento

- El sitio ya no se queda en medio/abajo de la página al recargar (F5) — se fuerza scroll al top salvo que la URL traiga un ancla (`#contacto`, etc.), que se sigue respetando.
- Hero centrado verticalmente (antes el CTA quedaba pegado muy abajo).

## Notas técnicas

- Todo verificado en navegador real (Playwright headless) en cada cambio: build verde, sin overflow horizontal en 375px, sin errores de consola, capturas de pantalla comparando antes/después.
- Sin dependencias nuevas agregadas al proyecto (herramientas de compresión/trazado de imágenes se usaron desde directorios temporales fuera del repo).
