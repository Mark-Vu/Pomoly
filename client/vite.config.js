import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let plugins = [react()];

  // if (mode === 'production') {
  //   plugins.push(mkcert());
  // }
  plugins.push(mkcert());
  return {
    plugins: plugins
  };
});
