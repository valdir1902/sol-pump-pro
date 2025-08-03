import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuração importante para hospedagem compartilhada
  base: './', // Use caminhos relativos
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Desabilitar sourcemaps para produção
    minify: 'terser',
    
    rollupOptions: {
      output: {
        // Chunking manual para otimizar carregamento
        manualChunks: {
          // Core React
          vendor: ['react', 'react-dom'],
          
          // Routing
          router: ['react-router-dom'],
          
          // i18n
          i18n: ['react-i18next', 'i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
          
          // Solana
          solana: ['@solana/web3.js'],
          
          // Data fetching
          query: ['@tanstack/react-query'],
          
          // HTTP client
          http: ['axios'],
          
          // UI components
          ui: ['lucide-react'],
          
          // Utils
          utils: ['date-fns']
        },
        
        // Nomeação consistente de arquivos
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          
          return `assets/[ext]/[name]-[hash][extname]`;
        }
      }
    },
    
    // Configurações de terser para minificação
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true,
      },
    },
    
    // Limite de chunk warning (500kb)
    chunkSizeWarningLimit: 500,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  
  preview: {
    port: 4173,
    host: true,
  },
  
  // Otimizações para desenvolvimento
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-i18next',
      'i18next',
      '@tanstack/react-query',
      'axios',
      'lucide-react'
    ],
  },
  
  // Configurações específicas para hospedagem compartilhada
  define: {
    // Definir variáveis de ambiente para build
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __IS_SHARED_HOSTING__: JSON.stringify(true),
  },
  
  // CSS otimizações
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    devSourcemap: false, // Desabilitar sourcemaps CSS em produção
  },
  
  // Configurações de assets
  assetsInclude: ['**/*.woff2', '**/*.woff'],
  
  // PWA configurações (opcional)
  // plugins: [
  //   react(),
  //   VitePWA({
  //     registerType: 'autoUpdate',
  //     workbox: {
  //       globPatterns: ['**/*.{js,css,html,ico,png,svg}']
  //     },
  //     includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  //     manifest: {
  //       name: 'Solana Spinner Bot',
  //       short_name: 'SpinnerBot',
  //       description: 'Trading automatizado de tokens Solana',
  //       theme_color: '#000000',
  //       icons: [
  //         {
  //           src: 'pwa-192x192.png',
  //           sizes: '192x192',
  //           type: 'image/png'
  //         }
  //       ]
  //     }
  //   })
  // ]
})
