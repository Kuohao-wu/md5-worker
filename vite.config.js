import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 开发时使用mkcert自动生成https证书
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    mkcert({
      source: 'coding',
    })
  ],
})
