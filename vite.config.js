import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const base = process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : process.env.BASE_URL || './';

  return {
    base,
    plugins: [
      {
        name: 'force-js-mime-type',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            if (url.endsWith('.jsx') || url.includes('.jsx?')) {
              res.setHeader('Content-Type', 'text/javascript');
            }
            next();
          });
        },
      },
      react(),
      tailwindcss(),
    ],
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
