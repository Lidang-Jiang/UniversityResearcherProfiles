import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import legacy from '@vitejs/plugin-legacy'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default ({ mode }) => {
  const { VITE_PORT = 8220 } = loadEnv(mode, process.cwd())
  return defineConfig({
    base: '/',
    plugins: [
      vue2(),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),

      // element-ui 样式按需导入
      createStyleImportPlugin({
        libs: [
          {
            libraryName: 'element-ui',
            esModule: true,
            resolveStyle: (name) => `../packages/theme-chalk/src/${name}.scss`,
          },
        ],
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          sourceMap: false,
          sassOptions: {
            outputStyle: 'compressed',
          },
          implementation: require('sass'),
          additionalData: `@import '@/assets/styles/element-variables.scss';@import '@/assets/styles/utility.scss';`,
        },
      },
      postcss: {
        plugins: [
          // postCssPxToRem({
          //   rootValue: 192,
          //   propList: ['*'],
          //   /**
          //    * ['body'] will match .body-class
          //    * If value is regexp, it checks to see if the selector matches the regexp.
          //    * [/^body$/] will match body but not .body
          //    */
          //   // selectorBlackList: [/^\.code/],
          // }),
        ],
      }, // 1rem，根据 设计稿宽度/10 进行设置propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
    },
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: VITE_PORT,
      // 监听所有地址
      host: 'localhost',
      // 服务启动时是否自动打开浏览器
      open: false,
      // 允许跨域
      cors: true,
    },
    build: {
      // outDir: mode === 'production' ? 'dist' : 'test-dist',
      outDir: 'dist',

      // 构建后是否生成 source map 文件
      sourcemap: false,

      //  chunk 大小警告的限制（以 kbs 为单位）
      chunkSizeWarningLimit: 2000,

      rollupOptions: {
        output: {
          entryFileNames: 'js/entry-[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          // assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            'element-ui': ['element-ui'],
          },
        },
      },
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
  })
}
