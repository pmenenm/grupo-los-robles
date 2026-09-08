// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // ─── AGENTE: reemplaza este valor con el dominio real del cliente ───
  site: 'https://grupolosrobles.com',

  integrations: [sitemap({
    filter: (page) =>
      !page.includes('/draft/') && !page.includes('/admin/'),
  }), react()],

  compressHTML: true,

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('gsap'))  return 'gsap';
            if (id.includes('lenis')) return 'lenis';
            if (id.includes('three') || id.includes('@react-three')) return 'three';
          },
        },
      },
    },
    optimizeDeps: {
      include: ['gsap', 'lenis'],
    },
  },
});