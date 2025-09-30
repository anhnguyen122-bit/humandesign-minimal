import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative base so it works on GitHub Pages project sites
export default defineConfig({
  base: './',
  plugins: [react()],
})
