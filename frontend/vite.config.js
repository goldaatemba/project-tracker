import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { api_url } from "../config.json";


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {  // Proxy all requests starting with `/api` to your backend
        target: 'https://project-bank-db99.onrender.com', // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
});