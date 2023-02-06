import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:{
      '@':path.resolve(__dirname, './src')
    }
  },
  server:{
    hmr:true,
    port:3004,
    proxy:{
      "/api":{
        target:"http://localhost:7070",
        changeOrigin:true,
        PathRewrite:{
          "^api":"/api"
        }
      }
    }
  }
})
