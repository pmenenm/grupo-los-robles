# Diagnóstico — sitio actual de Grupo Los Robles

> Auditoría de marca, tipografía, color, fotografía, UI y arquitectura de información de
> **grupolosrobles.com**, capturada en septiembre de 2026. Sirve de punto de partida (referente
> negativo + oportunidades) para el blueprint de la nueva dirección de diseño — ver CLAUDE.md §16.
> Versión visual (misma información, formato reporte): `_diagnostico-sitio-actual.html` en esta
> misma carpeta.

**Sitio auditado:** https://grupolosrobles.com/
**Stack detectado:** WordPress + Elementor 3.35.4 (tema Hello Elementor) + Elementor Pro (pro-elements) + plugin King Addons.

---

## 0. Resumen — cuatro problemas antes que cualquier decisión de estilo

1. **La identidad no está unificada.** El isotipo es un monte/hoja en degradé verde, pero el sitio se apoya visualmente en violeta eléctrico y rojo — colores sin relación aparente con la marca ni entre secciones.
2. **Fotografía de stock genérica.** Cada división usa una imagen de banco de imágenes distinta en iluminación, color y tratamiento — no hay dirección de arte fotográfica propia del grupo.
3. **Arquitectura desigual entre divisiones.** Solo 2 de 5 negocios (Vestuario, Inmobiliaria) tienen página propia. Gastronomía, Agrícola y Tecnológica — negocios con marca propia (Valbifrut, Dot Solutions) — no tienen dónde profundizar.
4. **Contenido desactualizado en producción.** Texto de relleno ("Lorem Ipsum") visible en la página de Inmobiliaria, contadores de KPI mostrando "0", y un proyecto con fecha de entrega "primer semestre 2020".

---

## 1. Marca

Logotipo: símbolo abstracto de monte/hoja en degradé (verde claro → verde bosque) sobre el
wordmark **"GRUPO LOS ROBLES"** en versalitas verde bosque sólido. Es el único elemento del sitio
con una paleta orgánica coherente con el nombre de la empresa. Fuera del logo, el verde no vuelve
a aparecer como color estructural en ninguna sección — ni botones, ni fondos, ni navegación.

Ver `assets/sitio-actual/logo-actual.png`.

---

## 2. Color

Colores reales extraídos de las hojas de estilo que Elementor genera para la home
(`wp-content/uploads/elementor/css/post-20.css`), ordenados por frecuencia de uso:

| Hex | Uso observado | Frecuencia |
|---|---|---|
| `#5B03FF` | Acento primario (violeta eléctrico) | 10 |
| `#CB3030` | Acento secundario (rojo) | 7 |
| `#30CBCB` | Acento terciario (teal) | 1 |
| `#274022` (con alfa `BF`) | Overlay sobre foto de la sección Agrícola | 2 |
| `#FFFFFF` | Fondo base | 28 |
| `#CFCFCF` | Gris texto secundario | 13 |
| `#7A7A7A` | Gris cuerpo | 10 |
| `#1A1A1A` | Casi-negro (header) | — |
| `#F2F2F2` / `#E8E8E8` / `#E0E0E0` / `#F3F3F3` | Fondos de sección | 1–2 c/u |
| `#FFBC7D` / `#61CE70` / `#5CAB30` | Íconos de contador KPI | 1 c/u |

**El violeta `#5B03FF` es, por lejos, el acento dominante del sitio** — y no aparece en ningún otro
activo de marca (logo, papelería, redes). Ninguno de estos colores está documentado como "marca"
en ninguna parte del sitio: se acumularon sección por sección dentro del editor visual de
Elementor, sin una paleta central que los gobierne.

---

## 3. Tipografía

Todo el sitio usa **Open Sans** (las 9 variantes de peso, de 100 a 900, cargadas desde Google
Fonts) — no hay una tipografía de display distinta del cuerpo de texto. La jerarquía se logra solo
con tamaño y peso; los saltos entre tamaños son irregulares en vez de seguir una escala modular:

`90px · 85px · 70px · 66px · 55px · 51px · 50px · 45px · 39px · 35px · 32px · 26px · 22px · 19px · 15px · 14px · 13px · 12px`

Los pesos `800` y `700` concentran casi toda la carga tipográfica (24 de 40 declaraciones de peso
en la hoja de estilos de la home) — el sitio "grita" en negrita casi todo el tiempo, lo que aplana
la jerarquía en vez de crearla.

---

## 4. Fotografía

Las cinco tarjetas de "Industrias" usan fotografía de stock evidente — cada una con temperatura de
color, iluminación y composición distintas. Todas llevan un número en outline blanco superpuesto
(01–05), pero el orden no representa una jerarquía real entre negocios: es decoración heredada de
una plantilla, no información.

- **Agrícola** (`assets/sitio-actual/foto-agricola.jpg`): cálida, alto contraste, muy de "banco de imágenes de comida".
- **Vestuario** (`assets/sitio-actual/foto-vestuario.jpg`): tonos neutros/beige, luz plana, sin relación cromática con las demás.
- **Tecnológica** (`assets/sitio-actual/foto-tecnologica.jpg`): fría, azul/verde, clásico stock de "hacker genérico" con código en pantalla.

---

## 5. UI

El sitio corre sobre WordPress + Elementor Pro, con el plugin de terceros King Addons para
componentes extra (texto colapsable, formularios).

- **Radios casi nulos:** solo dos valores de `border-radius` en toda la home (1px y 2px) — todo se lee como cajas rectas.
- **Cero sombras:** ninguna declaración de `box-shadow` — no hay sistema de elevación entre tarjetas, botones y fondo.
- **Carrusel por defecto:** Swiper v8 sin personalizar para el slider de "Industrias"; header con scroll pegajoso vía jQuery Sticky, patrón estándar del tema Hello Elementor.

---

## 6. Arquitectura de información

El menú principal lista directamente los cinco negocios (sin un "Nosotros" o "Empresa" propio). Al
verificar qué hay detrás de cada enlace, la mitad son páginas reales con contenido de negocio y la
otra mitad son solo el ancla de la sección en la portada:

| División | ¿Página propia? | Estado observado |
|---|---|---|
| Vestuario | Sí — `/vestuario/` | Lista marcas reales (BOSS, HUGO, GEOX) y ubicaciones de tienda. |
| Inmobiliaria | Sí — `/inmobiliaria/` | Lista 5 proyectos, pero con texto "Lorem Ipsum" visible y fecha de entrega 2020. |
| Gastronomía | No | Solo existe como sección/ancla en la portada. |
| Agrícola (Valbifrut) | No | Marca propia con 30+ años de historia, sin página dedicada. |
| Soluciones Tecnológicas (Dot Solutions) | No | Marca propia con producto (BI, fidelización), sin página dedicada. |

---

## 7. Contenido — señales de un sitio a medio terminar

- **Contadores de "Nuestro Alcance" en cero:** sucursales, sectores, empleados y marcas activas se muestran como "0" o "+0" — el widget de conteo nunca fue configurado con datos reales.
- **Lorem Ipsum en Inmobiliaria:** párrafo de relleno visible entre la introducción del sector y el listado de proyectos.
- **Proyecto fechado en 2020:** el proyecto destacado "Neocisterna" anuncia entrega para "primer semestre 2020" — seis años de desfase con la fecha actual.
- Vestuario lista marcas de terceros (BOSS, HUGO, GEOX/Hugo Boss Chile) como inquilinos, no como marca propia del grupo.

---

## 8. Lo que esto le pide al rediseño

1. **Decidir el rol del color.** ¿El verde del isotipo se convierte en el color estructural del holding, o se reserva solo para el logo y se construye una paleta corporativa nueva a partir de él? Hoy nadie decidió esto — simplemente no pasó.
2. **Una tipografía con carácter propio.** Open Sans es una fuente de sistema, no una decisión de marca.
3. **Dirección de arte fotográfica única**, aunque sea curando stock bajo una misma paleta y tratamiento de color.
4. **Misma profundidad para las cinco divisiones** — especialmente porque Valbifrut y Dot Solutions ya son marcas con identidad propia.
5. **Retirar o completar todo dato de relleno** antes de publicar: cero Lorem Ipsum, cero contadores en cero, cero fechas vencidas.

---

*Nota de proceso: la dirección de diseño anterior de este proyecto ("Anillos de Roble" — Header +
Hero + `theme.css`) fue archivada en `/_archive-anillos-de-roble/` el 2026-09-02, a pedido del
Ingeniero Líder, para reiniciar la dirección de diseño a partir de este diagnóstico.*
