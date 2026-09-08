// 01 · Tecnología — laptop procedural que abre la tapa al activarse, flota suave a la derecha.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { applyActivationTransform } from '../objectTransform';

export default function Laptop({ activationRef, mouse }) {
  const group = useRef();
  const lid = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const eased = applyActivationTransform(group.current, {
      activation: activationRef.current,
      restX: 1.6,
      restY: -0.1,
      side: 1,
    });

    // Bisagra: cerrada (~1.55 rad, plegada sobre el teclado) → abierta (~-0.25 rad)
    if (lid.current) {
      lid.current.rotation.x = THREE.MathUtils.lerp(1.55, -0.25, eased);
    }

    // Flote ambiental + parallax de cursor (solo rota, no traslada, para no pelear con el scroll)
    group.current.position.y = -0.1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.03 * eased;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.current.x * 0.18, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -mouse.current.y * 0.08, 0.06);
  });

  return (
    <group ref={group} position={[1.6, -0.1, 0]}>
      {/* Base + teclado */}
      <mesh>
        <boxGeometry args={[1.3, 0.06, 0.9]} />
        <meshStandardMaterial color="#3a3222" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.035, 0]}>
        <boxGeometry args={[1.15, 0.01, 0.75]} />
        <meshStandardMaterial color="#16130d" roughness={0.6} />
      </mesh>

      {/* Tapa — pivote en la bisagra trasera */}
      <group ref={lid} position={[0, 0.03, -0.45]}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.3, 0.8, 0.04]} />
          <meshStandardMaterial color="#3a3222" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.4, 0.021]}>
          <planeGeometry args={[1.1, 0.62]} />
          <meshStandardMaterial
            color="#c9a15c"
            emissive="#c9a15c"
            emissiveIntensity={0.35}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}
