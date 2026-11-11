import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
    proxy: {
      "/api": {
        target: "https://api.restful-api.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: env.RESTFUL_API_KEY
        ? { 'x-api-key' : env.RESTFUL_API_KEY}
        : {},
      },
    },
  },
  };
});
  
