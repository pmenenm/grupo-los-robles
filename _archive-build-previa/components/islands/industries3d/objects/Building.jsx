// 05 · Inmobiliaria — torre procedural a la derecha; los pisos se elevan desde el suelo
// en secuencia, cada uno con su propia ventana dentro de la activación general.
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { applyActivationTransform } from '../objectTransform';

export default function Building({ activationRef, mouse }) {
  const group = useRef();
  const floorRefs = useRef([]);

  const floorDefs = useMemo(
    () => [
      { w: 0.9, h: 0.4, d: 0.7, y: 0.2 },
      { w: 0.75, h: 0.4, d: 0.6, y: 0.6 },
      { w: 0.6, h: 0.4, d: 0.5, y: 1.0 },
      { w: 0.42, h: 0.5, d: 0.38, y: 1.45 },
    ],
    []
  );

  useFrame(() => {
    if (!group.current) return;
    const eased = applyActivationTransform(group.current, {
      activation: activationRef.current,
      restX: 1.6,
      restY: -0.4,
      side: 1,
    });
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0.5 + mouse.current.x * 0.1, 0.06);

    // Cada piso tiene su propia sub-ventana dentro de la activación total del edificio:
    // el piso i sube cuando eased*N pasa por encima de i — construcción secuencial.
    floorDefs.forEach((f, i) => {
      const mesh = floorRefs.current[i];
      if (!mesh) return;
      const localT = THREE.MathUtils.clamp(eased * floorDefs.length - i, 0, 1);
      const riseEase = localT * localT * (3 - 2 * localT);
      mesh.position.y = THREE.MathUtils.lerp(f.y - 1.4, f.y, riseEase);
    });
  });

  return (
    <group ref={group} position={[1.6, -0.4, 0]} rotation={[0, 0.5, 0]}>
      {floorDefs.map((f, i) => (
        <mesh key={i} ref={(el) => (floorRefs.current[i] = el)} position={[0, f.y - 1.4, 0]}>
          <boxGeometry args={[f.w, f.h, f.d]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#3a3222' : '#2b241a'} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
