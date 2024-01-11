import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 获取环境配置
  const env = loadEnv(mode, process.cwd())

  return {
    base: command === 'serve' ? env.VITE_APP_LOCAL_URL_PREFIX : env.VITE_APP_SERVER_URL_PREFIX, // 若是及本地启动则使用本地服务器url前缀，否则使用远程服务器url前缀
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        dirs: ['./src/stores/*.ts'],
        dts: './presets/auto-import/d.ts/auto-import.d.ts',
        imports: ['vue', 'vue-router', 'pinia'],
        eslintrc: {
          enabled: true, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成，一旦生成配置文件之后，最好把enable关掉，即改成false。否则这个文件每次会在重新加载的时候重新生成，这会导致eslint有时会找不到这个文件。当需要更新配置文件的时候，再重新打开
          filepath: './presets/auto-import/.eslintrc-auto-import.json', // 生成json文件,可以不配置该项，默认就是将生成在根目录
          globalsPropValue: true
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/mixins.scss";' // 每个scss文件会自动加入这段导入mixin的代码
        }
      }
    }
  }
})
