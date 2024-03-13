import { fileURLToPath, URL } from 'node:url'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  const { mode } = configEnv
  // const VITE_TYPE = loadEnv(mode, process.cwd()).VITE_TYPE
  // process.env.mode = mode
  // console.log(VITE_TYPE)
  process.env.mode = mode
  // const isDev = mode === 'development'
  const isPro = mode === 'production'
  const isLib = mode === 'lib'

  if (isLib) {
    return {
      plugins: [
        vue(),
        vueJsx(),
        splitVendorChunkPlugin(),
        dts({

        }),
        optimizeCssModules()

      ],
      // 打包配置
      build: {
        outDir: 'lib',

        lib: {
          entry: resolve(__dirname, 'src/components/rich-mentions/index.ts'),
          name: 'vue3-mentions',
          // the proper extensions will be added
          formats: ['es', 'umd'],
          fileName: (format) => `${format}/index.${format}.js`
        },
        sourcemap: false,

        target: 'esnext',
        minify: 'esbuild', // 混淆器，terser构建后文件体积更小
        rollupOptions: {
          // 确保外部化处理那些你不想打包进库的依赖
          external: [

          ],
          output: {
            // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
            globals: {

            }
          }
        }
      }
    }
  }
  return {
    plugins: [
      vue(),
      vueJsx(),
      VueDevTools(),
      basicSsl(),
      isPro && splitVendorChunkPlugin(),
      isPro && optimizeCssModules()
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
