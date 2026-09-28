// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// GH_PAGES_PREVIEW: seteada SOLO por el workflow de deploy a GitHub Pages (ver
// .github/workflows/deploy.yml) -- ese fallback (pmenenm.github.io/grupo-los-robles/)
// se sirve bajo un subpath, a diferencia del dominio real (raiz). Sin esta variable
// (build local, o el dia que grupolosrobles.com apunte de verdad a este deploy), base
// queda en "/" como siempre. Las rutas internas (imagenes, favicon, nav) son todas
// relativas + un <base> nativo en BaseHead.astro, asi que este valor las redirige solo
// con cambiar aca -- no hace falta tocar nada mas al pasar a produccion real.
const base = process.env.GH_PAGES_PREVIEW ? '/grupo-los-robles/' : '/';

export default defineConfig({
  // ─── AGENTE: reemplaza este valor con el dominio real del cliente ───
  site: 'https://grupolosrobles.com',
  base,

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