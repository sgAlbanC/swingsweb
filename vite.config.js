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

      // 用代理首先得有一个标识，表明你的这个连接要使用代理
      //  /api 就是告诉node，我接口用 /api 开头的才使用代理，所以接口都写成 
      // localhost:3000/api/xxx/xxx

      "/api":{
        target:"http://124.220.201.234:7070",
        changeOrigin:true,

        // 但我后端正确的接口路径里面是没有 /api 的，所以就需要pathRewrite
        // 这样在写代码的时候有标识，请求接口的时候自动去掉 /api
        PathRewrite:{
          "^api":"/api"
        }
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    chunkFileNames: (chunkInfo) => {
      const facadeModuleId = chunkInfo.facadeModuleId
        ? chunkInfo.facadeModuleId.split('/')
        : [];
      const fileName =
        facadeModuleId[facadeModuleId.length - 2] || '[name]';
      return `js/${fileName}/[name].[hash].js`;
    }
  }
})
