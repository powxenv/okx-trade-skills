// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [
      tailwindcss(),
      Icons({ compiler: 'jsx', jsx: 'react' }),
    ],
  },
});
