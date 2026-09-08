// src/components/islands/industries3d/objectTransform.js
// Lógica compartida por los 5 objetos: cómo entran/salen de escena según su propio
// "activation" (0 a 1, calculado por useIndustriesScroll a partir del scroll).
import * as THREE from 'three';

/**
 * Aplica la transición de un objeto según su activación de scroll.
 * - side: +1 (entra/descansa a la derecha) | -1 (izquierda) — define el zig-zag.
 * - Al activarse, el objeto llega desde su propio lado y desde el fondo (menor Z),
 *   escalando de chico a su tamaño real — sensación de "aparece flotando".
 */
export function applyActivationTransform(group, { activation, restX, restY = 0, restZ = 0, side }) {
  const a = THREE.MathUtils.clamp(activation, 0, 1);
  const eased = a * a * (3 - 2 * a); // smoothstep: entrada/salida orgánica, no lineal

  const exitOffset = (1 - eased) * 2.4 * side; // se aleja hacia SU lado al desactivarse
  group.position.x = restX + exitOffset;
  group.position.y = restY;
  group.position.z = restZ - (1 - eased) * 1.6; // "emerge" desde el fondo

  const scale = THREE.MathUtils.lerp(0.3, 1, eased);
  group.scale.setScalar(scale);
  group.visible = a > 0.01;

  return eased;
}
