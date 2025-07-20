import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {  // Proxy all requests starting with `/api` to your backend
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove `/api` prefix
      },
    },
  },
});