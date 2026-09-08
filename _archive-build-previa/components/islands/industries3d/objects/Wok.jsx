// 02 · Gastronomía — wok procedural a la izquierda; los "ingredientes" saltan en loop físico.
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { applyActivationTransform } from '../objectTransform';

export default function Wok({ activationRef, mouse }) {
  const group = useRef();
  const ingredientRefs = useRef([]);

  const seeds = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        radius: 0.16 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
        speed: 2 + Math.random() * 1.6,
      })),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    const eased = applyActivationTransform(group.current, {
      activation: activationRef.current,
      restX: -1.6,
      restY: -0.05,
      side: -1,
    });
    const t = state.clock.elapsedTime;

    // El wok se "tostea" — rock suave, más marcado mientras está activo
    group.current.rotation.z = Math.sin(t * 1.6) * 0.08 * eased;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -0.3 + mouse.current.x * 0.12, 0.06);

    // Ingredientes saltando dentro del wok — cada uno con fase/velocidad propia (física simulada)
    ingredientRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = seeds[i];
      const bounce = Math.abs(Math.sin(t * s.speed + s.phase));
      mesh.position.y = 0.06 + bounce * 0.22 * eased;
      mesh.position.x = Math.cos(s.angle + t * 0.3) * s.radius;
      mesh.position.z = Math.sin(s.angle + t * 0.3) * s.radius * 0.7;
    });
  });

  return (
    <group ref={group} position={[-1.6, -0.05, 0]} rotation={[0, -0.3, 0]}>
      {/* Cuerpo: casquete esférico invertido (bowl) */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.55, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color="#2b241a" metalness={0.85} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Mango */}
      <mesh position={[0.75, 0.12, 0]} rotation={[0, 0, Math.PI / 2.4]}>
        <cylinderGeometry args={[0.035, 0.035, 0.6, 12]} />
        <meshStandardMaterial color="#16130d" roughness={0.7} />
      </mesh>
      {/* Ingredientes */}
      {seeds.map((_, i) => (
        <mesh key={i} ref={(el) => (ingredientRefs.current[i] = el)} position={[0, 0.06, 0]}>
          <icosahedronGeometry args={[0.07, 0]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#c9a15c' : '#8a6d3f'} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
