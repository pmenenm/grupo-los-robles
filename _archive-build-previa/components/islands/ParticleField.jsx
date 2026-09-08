// src/components/islands/ParticleField.jsx
// Campo de partículas flotantes — shader propio completo (no PBR, blending aditivo),
// con la misma lógica de repulsión por mouse que la esfera, a otra escala.
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PARTICLES_VERTEX_GLSL, PARTICLES_FRAGMENT_GLSL } from './hero3d-shaders';

export default function ParticleField({ count = 700, mouseStrength, mouseWorldPoint, sceneState }) {
  const pointsRef = useRef();

  const [positions, phases, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 2.1 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.55;
      positions[i * 3 + 2] = radius * Math.cos(phi) * 0.55 - 1.2;
      phases[i] = Math.random();
      sizes[i] = Math.random() * 2.2 + 0.6;
    }
    return [positions, phases, sizes];
  }, [count]);

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse3D: { value: new THREE.Vector3(9999, 9999, 9999) },
    uMouseStrength: { value: 0 },
    uRadius: { value: 1.15 },
    uColor: { value: new THREE.Color('#c9a15c') },
  });

  useFrame((_, delta) => {
    uniforms.current.uTime.value += delta;
    uniforms.current.uMouseStrength.value = mouseStrength.current;
    uniforms.current.uMouse3D.value.copy(mouseWorldPoint.current);

    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * (0.02 + sceneState.scroll * 0.05);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={PARTICLES_VERTEX_GLSL}
        fragmentShader={PARTICLES_FRAGMENT_GLSL}
        uniforms={uniforms.current}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
