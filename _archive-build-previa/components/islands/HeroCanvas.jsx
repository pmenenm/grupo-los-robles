// src/components/islands/HeroCanvas.jsx
// Entry point de la isla React — esto es lo que Hero3D.astro monta con client:load.
// Un solo momento de animación premium en React (§19 del CLAUDE.md del proyecto);
// el resto del sitio sigue en Astro + GSAP vanilla.
import { Canvas } from '@react-three/fiber';
import HeroScene from './HeroScene';

export default function HeroCanvas() {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fallback estático y liviano: sin canvas WebGL, sin animación — el fondo CSS de
  // Hero3D.astro (gradiente + grain) queda como única capa visual.
  if (reducedMotion) return null;

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 42 }}
    >
      <HeroScene />
    </Canvas>
  );
}
