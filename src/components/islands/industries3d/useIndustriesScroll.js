// src/components/islands/industries3d/useIndustriesScroll.js
// Un ScrollTrigger por sección (busca [data-industry-slot] en el DOM, renderizado por
// IndustriesSection.astro) — reutiliza el gsap/ScrollTrigger global del sitio, no crea
// un segundo motor de scroll. Cada trigger produce una curva "campana" (0→1→0) que
// alcanza su pico cuando la sección está centrada en el viewport: eso es lo que hace
// que la transición entre objetos 3D se sienta continua en vez de un corte brusco.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useIndustriesScroll(count) {
  const activationRefs = useRef(
    Array.from({ length: count }, () => ({ current: 0 }))
  ).current;
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const slots = document.querySelectorAll('[data-industry-slot]');
    const triggers = [];

    slots.forEach((slot, i) => {
      if (i >= count) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: slot,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            // Campana centrada en progress=0.5: sube al entrar, pico al centro, baja al salir.
            const bell = 1 - Math.abs(self.progress - 0.5) * 2;
            activationRefs[i].current = Math.max(0, bell);
          },
        })
      );
    });

    const onPointerMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [count, activationRefs]);

  return { activationRefs, mouse };
}
