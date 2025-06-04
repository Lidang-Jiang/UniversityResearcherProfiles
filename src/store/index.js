import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

Vue.use(PiniaVuePlugin)

const pinia = createPinia()

pinia.use(createPersistedState({ storage: sessionStorage }))

export default pinia

export * from './column'
export * from './modules/languageCode'
