import { defineStore } from 'pinia'
import EventBus from '@/utils/eventBus'

export const useLangStore = defineStore('languageCode', {
  state: () => ({
    // 默认语言设置（zh-CN为中文，en-US为英文）
    currentLang: localStorage.getItem('languageCode') || 'zh-CN',
    // 支持的语言列表
    supportedLangs: ['zh-CN', 'en-US'],
  }),

  getters: {
    // 获取当前语言
    getCurrentLang: (state) => state.currentLang,
    // 判断是否为英文环境
    isEnglish: (state) => state.currentLang === 'en-US',
    // 判断是否为中文环境
    isChinese: (state) => state.currentLang === 'zh-CN',
  },

  actions: {
    // 切换语言方法
    toggleLang() {
      const newLang = this.currentLang === 'zh-CN' ? 'en-US' : 'zh-CN'
      this.setLang(newLang)
      return newLang
    },

    // 统一设置语言的方法 (合并之前的两个方法)
    setLang(languageCode) {
      if (this.supportedLangs.includes(languageCode)) {
        this.currentLang = languageCode

        // 统一存储键名，避免混淆
        localStorage.setItem('languageCode', languageCode)

        // 同时触发两种事件，确保兼容性
        // 1. CustomEvent 方式
        document.dispatchEvent(
          new CustomEvent('language-changed', {
            detail: { language: languageCode },
          }),
        )

        // 2. EventBus 方式
        EventBus.$emit('language-changed', languageCode)

        console.log(`Language changed to: ${languageCode}`)
      }
    },
  },
})
