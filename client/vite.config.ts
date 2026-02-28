import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuração do Vite para o frontend React.
 * O proxy redireciona requisições /api para o backend .NET na porta 5000/5001.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:44303',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
