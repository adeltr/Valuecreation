import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The copilot proxy (src/server/proxy.ts) holds the API key server-side; the UI only calls /api.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:8787' } },
});
