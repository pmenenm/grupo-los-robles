// 04 · Agrícola — brote procedural a la izquierda; rota continuamente e interactúa con la luz
// (MeshStandardMaterial real, no shader plano — así responde a las point lights de la escena).
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { applyActivationTransform } from '../objectTransform';

export default function Plant({ activationRef, mouse }) {
  const group = useRef();
  const leafRefs = useRef([]);

  const leafSeeds = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        angle: (i / 6) * Math.PI * 2,
        tilt: 0.5 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    const eased = applyActivationTransform(group.current, {
      activation: activationRef.current,
      restX: -1.7,
      restY: -0.3,
      side: -1,
    });
    const t = state.clock.elapsedTime;

    group.current.rotation.y += 0.0025 + eased * 0.004;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.current.y * 0.08, 0.06);

    leafRefs.current.forEach((leaf, i) => {
      if (!leaf) return;
      const s = leafSeeds[i];
      leaf.rotation.z = s.tilt + Math.sin(t * 0.8 + s.phase) * 0.06 * eased;
    });
  });

  return (
    <group ref={group} position={[-1.7, -0.3, 0]}>
      {/* Tallo */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.045, 1.1, 10]} />
        <meshStandardMaterial color="#4a5a34" roughness={0.6} />
      </mesh>

      {/* Hojas radiales */}
      {leafSeeds.map((s, i) => (
        <group key={i} position={[0, 0.85, 0]} rotation={[0, s.angle, 0]}>
          <mesh ref={(el) => (leafRefs.current[i] = el)} position={[0.28, 0, 0]}>
            <coneGeometry args={[0.09, 0.55, 8]} />
            <meshStandardMaterial color="#5c7a3f" roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Brote central */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color="#c9a15c" roughness={0.35} metalness={0.15} />
      </mesh>
    </group>
  );
}
