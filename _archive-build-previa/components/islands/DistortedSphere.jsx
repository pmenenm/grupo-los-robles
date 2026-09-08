// src/components/islands/DistortedSphere.jsx
// Objeto flotante abstracto: esfera con desplazamiento por vertex shader personalizado,
// inyectado en MeshPhysicalMaterial vía onBeforeCompile — así el objeto sigue recibiendo
// las luces reales de la escena (PBR) en vez de reimplementar la iluminación a mano.
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NOISE_GLSL, SPHERE_UNIFORMS_GLSL, SPHERE_DISPLACEMENT_GLSL } from './hero3d-shaders';

export default function DistortedSphere({ mouseStrength, mouseWorldPoint, sceneState }) {
  const meshRef = useRef();
  const localMouse = useMemo(() => new THREE.Vector3(), []);

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse3D: { value: new THREE.Vector3(9999, 9999, 9999) },
    uMouseStrength: { value: 0 },
    uRadius: { value: 1.15 },
    uActivation: { value: 0 },
    uScroll: { value: 0 },
  });

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#c9a15c'),
      roughness: 0.28,
      metalness: 0.7,
      clearcoat: 0.5,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.1,
    });

    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms.current);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${SPHERE_UNIFORMS_GLSL}\n${NOISE_GLSL}`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>\n${SPHERE_DISPLACEMENT_GLSL}`);
    };
    // Cache key propio: evita que Three reutilice un programa compilado sin nuestras inyecciones.
    mat.customProgramCacheKey = () => 'distorted-sphere-v1';

    return mat;
  }, []);

  useFrame((_, delta) => {
    uniforms.current.uTime.value += delta;
    uniforms.current.uMouseStrength.value = mouseStrength.current;
    uniforms.current.uActivation.value = sceneState.activation;
    uniforms.current.uScroll.value = sceneState.scroll;

    if (!meshRef.current) return;

    // El punto del mouse vive en espacio de mundo (ver useMouseTracker); lo convertimos
    // al espacio LOCAL de esta malla para que el shader (que trabaja sobre `position`,
    // siempre local) compare distancias correctamente aunque el objeto esté rotando.
    localMouse.copy(mouseWorldPoint.current);
    meshRef.current.worldToLocal(localMouse);
    uniforms.current.uMouse3D.value.copy(localMouse);

    // Scroll: rotación continua que se acelera + leve acercamiento a cámara.
    meshRef.current.rotation.y += delta * (0.08 + sceneState.scroll * 0.5);
    meshRef.current.rotation.x = sceneState.scroll * 0.6;
    meshRef.current.scale.setScalar(1 + sceneState.scroll * 0.25);
  });

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[1.15, 96, 96]} />
    </mesh>
  );
}
