import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // IF USE DEPLOYMENT BACKEND, REPLACE THE plugins above with the one below
  // plugins: [react(), mkcert()],
})
