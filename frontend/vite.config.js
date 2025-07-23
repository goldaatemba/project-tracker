import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { api_url } from "../config.json";


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {  
        target: `${api_url}`, // backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
});