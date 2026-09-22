import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { prepareKage } from './scripts/prepare-kage.mjs';

export default defineConfig({
  base: './',
  // Resolve the named import to the package's identical per-component export.
  // This keeps unrelated legacy shaders out of the dependency graph.
  resolve: { alias: [{ find: /^@designcodeio\/threeui$/, replacement: fileURLToPath(new URL('./node_modules/@designcodeio/threeui/lib-dist/package-components/KageLandingPage.js', import.meta.url)) }] },
  plugins: [{
    name: 'portfolio-content',
    async handleHotUpdate({ file, server }) {
      if (/src[\\/](content|personalize-kage)\.js$/.test(file)) {
        await prepareKage();
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  }],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    // OneDrive can temporarily lock files on Windows; polling avoids watcher crashes.
    watch: {
      usePolling: process.platform === 'win32',
      interval: 500,
      ignored: ['**/.superdesign/**', '**/.references/**', '**/public/licenses/**'],
    },
  },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});

