# Arquitectura de la información — Grupo Los Robles

> Propuesta de IA + roadmap para la nueva dirección de diseño. Parte del diagnóstico en
> `diagnostico-sitio-actual.md`. Sirve de insumo directo para el blueprint obligatorio de
> CLAUDE.md §16 antes de codear cualquier sección.

## Principio

**Ancha, no profunda — el sitio funciona como vitrina.** La home muestra el escaparate completo
de un vistazo (galería de las 5 divisiones); cada división es su propio local con la puerta
abierta. Todo queda a un clic desde cualquier parte. 8 páginas en total, sin niveles de menú
anidados.

Decisiones de navegación:
- Header mínimo (logo + toggle) — la navegación real vive en `SideNav.astro` (overlay a pantalla
  completa, tipográfico, ya construido en el scaffold).
- Sin carruseles automáticos: la galería de divisiones es *scroll-driven* (el usuario controla el
  ritmo), no un Swiper autoplay.
- Un momento invertido/oscuro (Manifiesto) para dar contraste editorial — usa
  `--bg-primary-inverse` ya definido en `theme.css`.
- Fotografía con el mismo grading/temperatura entre las 5 divisiones, aunque el punto de partida
  sea stock curado (vía Magnific) mientras no haya fotografía propia.
- Tipografía peso máximo 600 (regla dura ya existente en CLAUDE.md §15.3) — jerarquía por tamaño y
  espacio, no por grosor.

## Mapa del sitio

```
/                    Inicio — la vitrina
├── /nosotros        Historia, cifras reales, manifiesto
├── /gastronomia      ┐
├── /vestuario         │  Mismo template,
├── /agricola          │  misma profundidad,
├── /tecnologia         │  las 5 al mismo nivel
├── /inmobiliaria      ┘
└── /contacto         Formulario + datos reales
```

## Página por página

### 1. Inicio (`/`)
| Bloque | Qué hace | Formato |
|---|---|---|
| Header | Logo + toggle de menú | Sticky, transparente sobre el hero |
| Hero | Propuesta de valor del holding en una frase | Tipografía protagonista, `clamp()` |
| Nuestro Alcance | Cifras reales (hoy en "0" en el sitio actual — resolver antes de construir) | Count-up al entrar en viewport |
| Galería de Divisiones | Las 5, foto curada + una línea + link a su página | Galería horizontal scroll-driven |
| Manifiesto (teaser) | Quiénes son, 2-3 líneas, link a `/nosotros` | Sección invertida (fondo oscuro) |
| Cierre / CTA | Invitación a contacto | Un solo CTA |

### 2. Nosotros (`/nosotros`)
Página que hoy no existe en ningún lado del sitio actual. Historia real de los 20 años, hitos si
los hay (fundación, incorporación de cada división), cifras de impacto, timeline opcional si el
cliente confirma fechas.

### 3. Plantilla de división (×5 — `/gastronomia`, `/vestuario`, `/agricola`, `/tecnologia`, `/inmobiliaria`)
Misma estructura para las cinco — corrige la profundidad desigual detectada en el diagnóstico.

| Bloque | Contenido |
|---|---|
| Hero de división | Nombre + tagline propio + imagen curada |
| Qué hacen | Un párrafo directo |
| Marcas / proyectos / ubicaciones reales | Gastronomía → marcas de Grupo Mil Sabores · Vestuario → BOSS/HUGO/GEOX y tiendas · Agrícola → Valbifrut, cifra de exportación · Tecnológica → productos de Dot Solutions · Inmobiliaria → proyectos vigentes (sin fechas vencidas) |
| Galería | Fotos reales de la operación si existen |
| CTA de salida | Si la división tiene sitio propio (Dot Solutions → dotsolutions.io · Valbifrut → valbifrut.cl · Gastronomía → grupomilsabores.cl) el CTA lleva ahí. Vestuario e Inmobiliaria (sin sitio propio) cierran con el formulario de contacto. |

### 4. Contacto (`/contacto`)
Formulario + datos reales. Hoy `contracts/site.json` tiene `email`, `phone` y `address` vacíos —
es el primer dato a completar.

## Contenido pendiente del cliente (bloqueante — no se inventa, CLAUDE.md §7.2)

- Cifras reales de "Nuestro Alcance" (sucursales, sectores, empleados, marcas activas)
- Email / teléfono / dirección de contacto
- Marcas exactas que opera Gastronomía (Grupo Mil Sabores)
- Proyectos vigentes de Inmobiliaria (los actuales datan de 2020)
- Fotografía propia de cada división, si existe (si no, curar stock consistente vía Magnific)

## Roadmap — 4 semanas

| Semana | Foco | Entregable |
|---|---|---|
| 1 | Referentes + dirección de diseño + IA aprobada | Blueprint sección-por-sección (CLAUDE.md §16), `theme.css` definitivo, `site.json` con datos reales |
| 2 | Home (vitrina) + Nosotros | Header/SideNav nuevos, Hero, Alcance, Galería de Divisiones scroll-driven, Manifiesto, página Nosotros |
| 3 | Las 5 páginas de división + Contacto | Template de división construido y poblado ×5, formulario funcional |
| 4 | Responsive (375/768/1024/1440), motion mobile, SEO, performance, QA de contenido | Deploy |
