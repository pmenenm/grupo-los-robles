# Referentes de diseño — investigación (CLAUDE.md §16.1)

> Análisis técnico (HTML/CSS/JS en producción) de dos referentes pedidos por el Ingeniero Líder,
> con la aplicación concreta de cada hallazgo a Grupo Los Robles.

## 1. alsea.net/home.html — transiciones y motion

**Stack detectado:** Webflow (export) + GSAP + ScrollTrigger + AOS (cargada pero no usada en home) +
jQuery/Bootstrap. Réplica de efectos recomendada, no de stack — nosotros ya tenemos Astro + GSAP +
Lenis, no hace falta sumar AOS/jQuery/Bootstrap.

| Patrón | Cómo funciona | Aplicación en Los Robles |
|---|---|---|
| Hero "ventana" | Marco tipo ventana que se abre para revelar un video en loop; el logo aparece adentro | El hero se abre con el trazo del isotipo (el monte) como máscara — literaliza la "vitrina que se abre" |
| Segmentos pinneados (scrollytelling) | Bloque `sticky`, revela uno por uno ícono + logos de marca + contador count-up ("1,929 Units") mientras se scrollea | Fusionar "Nuestro Alcance" + "Divisiones": pinnear y revelar cada una de las 5 con ícono, marcas y cifra en count-up |
| Card scale-in con pin+scrub | `gsap.from(..., {scale:.95, scrollTrigger:{pin:true, scrub:2}})` | Usar en la tarjeta de Manifiesto o en cada división al entrar en viewport |
| Fotografía en viñetas circulares ("cámara") | Círculos superpuestos con momentos reales + ícono + frase corta, en vez de fotos rectangulares en grilla | Para "Nosotros": viñetas circulares por división en vez de stock rectangular |
| Footer con micro-interacción de peso | Links cambian de peso (200→600) al hover sobre fondo oscuro, subrayado animado (`scaleX`) | Footer oscuro con subrayado animado + cambio de peso, coherente con el "momento invertido" |
| Cierre ilustrado emocional | Gráfico de línea grande + frase tipo manifiesto | Cerrar la home con ilustración de línea del isotipo a gran escala + frase de manifiesto |

## 2. heladerialarrs.cl — buen gusto, grilla, tipografía

**Stack detectado:** Shopify, sin librería de animación. Usa la misma pareja tipográfica ya elegida
para el proyecto: **Playfair Display + Nunito**. La sofisticación acá es 100% editorial/CSS.

| Patrón | Evidencia en el CSS | Aplicación en Los Robles |
|---|---|---|
| Paleta casi monocromática real | `#000`/`#fff` dominan (162/103 usos); grises cálidos (`#625b50`, `#8e8e8e`), nunca fríos | Cero color de acento salvo negro/blanco/arena en la Home |
| Grillas asimétricas, nunca 50/50 | `.6fr/1.4fr` · `.7fr/1.3fr` · `.8fr/1.2fr` · `.732fr/.268fr` — proporción distinta por sección | Nunca repetir la misma proporción de columna en dos secciones seguidas (ya es regla, CLAUDE.md §15.5) |
| Divisor tipográfico con línea flotante | `.home-title` con línea fina detrás; texto centrado "flota" sobre fondo blanco | Separador entre secciones de división: línea absoluta + `span` con `bg-cream px-8 relative z-10` |
| Mayúsculas solo en etiquetas | `uppercase` + `letter-spacing:1-2px` en labels/nav; `text-transform:none` en títulos serif reales | Confirma el patrón ya usado: eyebrows trackeados + headline serif en mixta |
| Grilla propia en octavos | Clases `one-eight`, `seven-eight`, `one-quarter` en vez de 12 columnas | Usar fracciones custom en Tailwind (`grid-cols-[.7fr_1.3fr]`) en vez de solo `grid-cols-12` |

## 3. lingers.it/en — header, hero-vitrina, panel lateral

**Stack detectado:** TYPO3 CMS + waypoints.js (scroll-reveal) + swiper (carruseles) + lightgallery
(lightbox) + flatpickr (datepicker, no aplica) + quicklink (prefetch). Sin framework pesado — la
elegancia es 100% de diseño, igual que Larrs. Es el referente más cercano en espíritu al "lujo
silencioso".

| Elemento | Cómo funciona | Aplicación en Los Robles |
|---|---|---|
| Header transparente → sólido | Barra fija transparente sobre el hero, logo blanco invertido (`filter:brightness(0) invert(1)`). Al hacer scroll: `rgba(247,247,247,.7)` + `backdrop-filter:blur(6px)`, logo se achica (25em→21em) y pierde el filtro blanco, aparece un "signet" (solo el símbolo) en el centro | Sumar el detalle del signet central al condensarse (solo el isotipo, sin wordmark) + logo invertido a blanco sobre el hero |
| Burger → menú full-screen con foto difuminada | Overlay se desliza desde arriba (`translateY(-100%→0)`) mostrando una foto de fondo al 90% blanco + `blur(2px)` detrás de los links. Links nivel 0: Cinzel serif, uppercase, 5em | Más sofisticado que un SideNav plano: "vidrio esmerilado sobre fotografía real" detrás de los links de división, en el serif del proyecto y a gran escala |
| Quicklinks con stagger | Botón "+" rota 45° al abrir; íconos revelan con `transition-delay` escalonado (0.1/0.15/0.2s) | Aplicable con GSAP stagger en accesos rápidos del header |
| Selector de idioma tipo píldora | Idioma inactivo con `font-size:0`, se expande suave al hover | Útil si el sitio es bilingüe ES/EN (hay operación en Perú) |
| Hero = vitrina y galería a la vez | Slider de fotografía editorial real (viñedo, terraza, montañas) con `<picture>` y crops distintos por breakpoint | El hero puede ciclar 3-4 fotos curadas (una por división insinuada) en vez de una imagen estática, con el mismo rigor de art-direction responsive |
| Panel flotante de reserva ("ventana lateral") | Panel fijo abajo-izquierda, fade in/out con transición de 2s, números de fecha enormes (3.6em), separador vertical, dos CTA con hover a color translúcido; oculto en mobile | El elemento más trasladable: un panel flotante y discreto (no un CTA gigante) — para Los Robles, algo como "Explorar divisiones" flotando sutil sobre el hero |
| Copy síntesis | *"For us, luxury lies in simplicity."* | Vale una frase equivalente en el Manifiesto |
| Paleta | `#777162` (taupe) · `#c4bfb6` (gris cálido) · `#e0ddd7`/`#eae9e5` (líneas) — cero color saturado | Tercera confirmación (junto con Larrs): negro/blanco/arena + un taupe cálido como único "color" |

## Síntesis para el blueprint

- **De Alsea:** pin + scrub para divisiones/alcance, viñetas circulares de fotografía, footer con
  micro-interacción de peso tipográfico.
- **De Larrs:** monocromía real (no "casi"), una proporción de grilla distinta por sección, divisor
  de línea+texto flotante como recurso recurrente.
- **De Lingers:** menú full-screen con foto difuminada + signet al condensar el header, hero como
  galería viva (no imagen fija), panel flotante discreto en vez de CTA gigante.
- Todo se logra con GSAP+ScrollTrigger (ya autorizado) y CSS/Tailwind puro — ninguna librería nueva.
