/**
 * 语言切换数据自动刷新混入
 * 使用方法:
 * 1. 在组件中引入并使用该混入
 * 2. 确保组件实现了数据刷新方法，默认为fetchData
 * 3. 可选：通过设置组件的refreshMethodName属性自定义刷新方法名
 */
export default {
  data() {
    return {
      // 是否正在因语言切换而刷新数据
      isLanguageRefreshing: false,
    }
  },

  created() {
    // 监听全局语言变化事件
    this.$bus && this.$bus.$on('languageCode-changed', this.handleLanguageChange)
  },

  beforeDestroy() {
    // 组件销毁时移除事件监听，避免内存泄漏
    this.$bus && this.$bus.$off('languageCode-changed', this.handleLanguageChange)
  },

  methods: {
    /**
     * 处理语言变化事件
     * @param {string} newLang - 新的语言代码
     */
    handleLanguageChange(newLang) {
      // 支持自定义刷新方法名，默认为fetchData
      let methodName = this.refreshMethodName || 'fetchData' // 修复：const 改为 let

      // 查找组件中对应的刷新方法
      if (typeof this[methodName] !== 'function') {
        console.warn(`[languageRefresh] 组件未实现${methodName}方法，无法自动刷新数据`)

        // 尝试查找常见的替代方法名
        const alternativeMethods = ['fetchList', 'loadData', 'getList', 'fetchPublications', 'fetchProjects']

        for (const altMethod of alternativeMethods) {
          if (typeof this[altMethod] === 'function') {
            console.info(`[languageRefresh] 自动使用替代方法: ${altMethod}`)
            methodName = altMethod
            break
          }
        }

        if (typeof this[methodName] !== 'function') {
          return
        }
      }

      // 设置标记，可用于UI展示加载状态
      this.isLanguageRefreshing = true

      // 延迟执行刷新，确保语言状态已完全更新
      this.$nextTick(() => {
        // 调用组件的数据获取方法
        const fetchPromise = this[methodName]()

        // 支持返回Promise的情况
        if (fetchPromise && typeof fetchPromise.finally === 'function') {
          fetchPromise.finally(() => {
            this.isLanguageRefreshing = false
          })
        } else {
          // 不返回Promise的情况
          this.$nextTick(() => {
            this.isLanguageRefreshing = false
          })
        }
      })
    },
  },
}
