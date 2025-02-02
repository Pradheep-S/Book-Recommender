import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "./",  // Ensures correct asset paths in production
  build: {
    outDir: 'dist',  // Ensure output is in 'dist/'
  },
});
