
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure process.env.API_KEY becomes the actual null primitive if the env var isn't set
    'process.env.API_KEY': process.env.API_KEY ? JSON.stringify(process.env.API_KEY) : 'null'
  }
})