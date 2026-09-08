// 03 · Vestuario — plano de tela con vertex shader ondulante (efecto viento), a la derecha.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { applyActivationTransform } from '../objectTransform';

const VERTEX = `
  uniform float uTime;
  uniform float uActivation;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 pos = position;
    // Ondulación de viento: dos frecuencias cruzadas para que no se vea un patrón repetitivo
    float wave = sin(pos.x * 3.2 + uTime * 1.4) * 0.16
               + sin(pos.y * 4.6 - uTime * 1.1) * 0.09;
    pos.z += wave * (0.25 + uActivation * 0.75);

    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT = `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    float fresnel = pow(1.0 - abs(vNormal.z), 2.0);
    vec3 col = mix(uColor * 0.55, uColor * 1.5, fresnel);
    float vignette = smoothstep(0.75, 0.05, distance(vUv, vec2(0.5)));
    gl_FragColor = vec4(col, vignette);
  }
`;

export default function Fabric({ activationRef, mouse }) {
  const group = useRef();
  const uniforms = useRef({
    uTime: { value: 0 },
    uActivation: { value: 0 },
    uColor: { value: new THREE.Color('#c9a15c') },
  });

  useFrame((state) => {
    if (!group.current) return;
    const eased = applyActivationTransform(group.current, {
      activation: activationRef.current,
      restX: 1.7,
      restY: 0.1,
      side: 1,
    });

    uniforms.current.uTime.value = state.clock.elapsedTime;
    uniforms.current.uActivation.value = eased;

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0.4 + mouse.current.x * 0.15, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.current.y * 0.1, 0.06);
  });

  return (
    <group ref={group} position={[1.7, 0.1, 0]} rotation={[0, 0.4, 0]}>
      <mesh>
        <planeGeometry args={[1.6, 1.9, 48, 56]} />
        <shaderMaterial
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms.current}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
