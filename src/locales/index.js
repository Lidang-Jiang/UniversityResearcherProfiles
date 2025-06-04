import zhCN from './zh-CN'
import enUS from './en-US'
import { useLangStore } from '@/store/modules/languageCode'

// Element UI 内置翻译
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'

/**
 * 国际化工具函数 - 支持应用自定义翻译和Element UI内置翻译
 * @param {string} key - 翻译键值，支持点语法，如'nav.home'或'el.pagination.total'
 * @param {Object} [options] - 可选参数
 * @param {boolean} [options.silent=false] - 是否静默处理未找到的翻译键
 * @param {string} [options.forceLanguage] - 强制使用指定语言
 * @param {Object} [options.values] - 插值变量，用于替换{name}这样的占位符
 * @returns {string} 翻译后的文本
 */
export function t(key, options = {}) {
  const langStore = useLangStore()
  const currentLang = options.forceLanguage || langStore.currentLang
  const silent = options.silent || false
  const values = options.values || {}

  // 获取应用自定义语言资源
  const appResources = {
    'zh-CN': zhCN,
    'en-US': enUS,
  }

  // Element UI内置语言资源
  const elementResources = {
    'zh-CN': elementZhLocale,
    'en-US': elementEnLocale,
  }

  // 尝试从应用资源获取翻译
  const appLangResource = appResources[currentLang] || appResources['zh-CN']

  // 支持多级key，如'nav.home'
  const keyPath = key.split('.')
  let result = appLangResource
  let found = true

  // 检查是否为Element UI的键值(el.开头)
  if (key.startsWith('el.')) {
    // 从Element UI资源获取翻译
    const elKeyPath = key.split('.')
    let elResult = elementResources[currentLang] || elementResources['zh-CN']

    for (let i = 0; i < elKeyPath.length; i++) {
      const k = elKeyPath[i]
      if (elResult && elResult[k] !== undefined) {
        elResult = elResult[k]
      } else {
        found = false
        break
      }
    }

    if (found) {
      // 处理插值变量
      return processTemplate(elResult, values)
    }
  }

  // 常规应用翻译键查找
  for (let i = 0; i < keyPath.length; i++) {
    const k = keyPath[i]
    if (result && result[k] !== undefined) {
      result = result[k]
    } else {
      found = false
      break
    }
  }

  // 处理未找到的情况
  if (!found && !silent) {
    console.warn(`[I18n] Translation key not found: ${key}`)
  }

  // 处理找到的翻译文本中的插值变量
  return found ? processTemplate(result, values) : key
}

/**
 * 处理模板字符串中的插值变量
 * @param {string} template - 带占位符的模板字符串
 * @param {Object} data - 要插入的数据对象
 * @returns {string} 替换后的字符串
 */
function processTemplate(template, data) {
  if (!template || typeof template !== 'string' || !data) return template

  // 支持{name}格式的插值占位符
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match
  })
}

// 获取当前语言环境的API请求参数
export function getApiLangParam() {
  const langStore = useLangStore()
  return { languageCode: langStore.currentLang }
}

// 导出语言Store，方便使用
export { useLangStore }
