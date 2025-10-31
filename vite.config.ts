import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests from /api/... to your NocoDB server
      '/api': {
        target: 'https://nocodb.avignatattva.com',
        changeOrigin: true, // Recommended for virtual hosted sites
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // This hook explicitly sets the header on each outgoing proxied request.
            // Replicates `proxy_set_header xc-token "lol";` from your Nginx config.
            proxyReq.setHeader('xc-token', 'P1wRIV95QJl_j7EIYyhkEO7uU7UemRkBRcXG8QlP');
          });
        },
      },
    },
  },
});
