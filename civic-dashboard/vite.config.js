import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  base : process.env.VITE_BASE_PATH || "/JanSetu_1",
})
