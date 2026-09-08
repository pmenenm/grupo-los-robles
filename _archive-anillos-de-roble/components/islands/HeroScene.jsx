// src/components/islands/HeroScene.jsx
// Contenido de la escena R3F: luces cinemáticas + objeto flotante + partículas.
// Reutiliza el GSAP/ScrollTrigger global del sitio (no crea un segundo motor de scroll,
// no re-instancia Lenis) — solo agrega su propio ScrollTrigger, igual que cualquier otro
// componente de este proyecto (Hero.astro, IndustriesGallery.astro, etc.).
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DistortedSphere from './DistortedSphere';
import ParticleField from './ParticleField';
import { useMouseTracker } from './useMouseTracker';

gsap.registerPlugin(ScrollTrigger);

export default function HeroScene() {
  const { onPointerMove, strength, worldPoint } = useMouseTracker();
  // Objeto plano mutable (no React state): useFrame lo lee cada frame sin causar
  // re-renders; GSAP y ScrollTrigger lo escriben directamente desde fuera del canvas.
  const sceneState = useRef({ scroll: 0, activation: 0 }).current;

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const section = document.querySelector('[data-hero3d-section]');
    const trigger = section
      ? ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => { sceneState.scroll = self.progress; },
        })
      : null;

    // Transición reposo → activo: la dispara Hero3D.astro al terminar su timeline de intro.
    const activate = () => {
      gsap.to(sceneState, { activation: 1, duration: 1.4, ease: 'power2.out' });
    };
    document.addEventListener('hero3d:activate', activate);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      trigger?.kill();
      document.removeEventListener('hero3d:activate', activate);
    };
  }, [onPointerMove, sceneState]);

  return (
    <>
      <ambientLight intensity={0.4} color="#3a3222" />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#f2ece0" />
      <pointLight position={[-4, -1.5, 2]} intensity={5} color="#c9a15c" />
      <pointLight position={[2.5, -3, -2]} intensity={3} color="#5b7fb0" />

      <DistortedSphere mouseStrength={strength} mouseWorldPoint={worldPoint} sceneState={sceneState} />
      <ParticleField mouseStrength={strength} mouseWorldPoint={worldPoint} sceneState={sceneState} />
    </>
  );
}
