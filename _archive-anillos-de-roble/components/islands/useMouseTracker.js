// src/components/islands/useMouseTracker.js
// Trackeo físico del mouse para HeroScene: suaviza la posición (lerp), mide qué tan rápido
// se mueve (velocidad) y convierte esa velocidad en un impulso de "energía" que decae solo.
// Ver la explicación matemática completa al final de la respuesta.
import { useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function useMouseTracker({ damping = 0.08, decay = 0.055, sensitivity = 14, max = 1.4 } = {}) {
  const { camera } = useThree();

  const raw = useRef(new THREE.Vector2(0, 0));       // NDC crudo del puntero (-1..1)
  const smooth = useRef(new THREE.Vector2(0, 0));     // NDC suavizado (con inercia)
  const prevSmooth = useRef(new THREE.Vector2(0, 0)); // frame anterior, para medir velocidad
  const strength = useRef(0);                          // energía de interacción (decae solo)
  const worldPoint = useRef(new THREE.Vector3());      // mouse proyectado en el plano z=0

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  useFrame(() => {
    // 1) Lerp: la posición suavizada persigue a la cruda con inercia — evita el "salto"
    //    brusco de un movimiento de mouse real y le da peso físico al gesto.
    smooth.current.x += (raw.current.x - smooth.current.x) * damping;
    smooth.current.y += (raw.current.y - smooth.current.y) * damping;

    // 2) Velocidad = distancia recorrida por el punto SUAVIZADO en este frame.
    //    Un movimiento rápido del mouse produce un salto grande aquí, aunque el punto
    //    crudo ya se haya "aplanado" un poco por el propio lerp.
    const velocity = smooth.current.distanceTo(prevSmooth.current);
    prevSmooth.current.copy(smooth.current);

    // 3) Integrador con fuga (leaky integrator): la energía decae exponencialmente hacia 0
    //    cada frame, y cada movimiento le inyecta un impulso proporcional a su velocidad.
    //    Resultado: un mouse quieto → strength cae a 0; un swipe rápido → pico que se apaga solo.
    strength.current = THREE.MathUtils.lerp(strength.current, 0, decay);
    strength.current = Math.min(strength.current + velocity * sensitivity, max);

    // 4) Proyección a 3D: rayo cámara→puntero intersectado con el plano z=0 (donde vive
    //    la escena). Así "strength" y "worldPoint" quedan listos en espacio de mundo para
    //    que cada objeto (esfera, partículas) los convierta a su propio espacio local.
    raycaster.setFromCamera(smooth.current, camera);
    raycaster.ray.intersectPlane(plane, worldPoint.current);
  });

  const onPointerMove = (event) => {
    raw.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    raw.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  return { onPointerMove, strength, worldPoint };
}
