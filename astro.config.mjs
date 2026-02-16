import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://openreef.ai',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
