import Vue from 'vue'

import './element'
import { setupElementI18n } from './element' // 导入Element国际化设置函数
import App from './App.vue'
import router from './router'
import pinia from './store'
import EventBus from '@/utils/eventBus'

// 步骤1: 引入Font Awesome核心库
import { library } from '@fortawesome/fontawesome-svg-core'
// 步骤2: 引入图标组件
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// 步骤3: 引入需要的图标
import { faLocationDot, faEnvelope, faBuilding, faGraduationCap, faIdCard } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin, faTwitter, faOrcid } from '@fortawesome/free-brands-svg-icons'

// 步骤4: 添加图标到库中
library.add(faLocationDot, faEnvelope, faBuilding, faGraduationCap, faIdCard, faGithub, faLinkedin, faTwitter, faOrcid)
// 步骤5: 全局注册组件

// import './utils/rem'
import './assets/styles/index.scss'

import permission from './directives/permission'

// svg sprite
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'

import Breadcrumb from '@/components/Breadcrumb.vue'

// dayjs
import dayjs from 'dayjs'

Vue.prototype.$bus = EventBus
Vue.component(SvgIcon.name, SvgIcon)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

Vue.directive('permission', permission)
Vue.prototype.$dayjs = dayjs

/**
 * 初始化国际化设置
 * 确保在Vue实例创建后执行
 */
const initializeI18n = () => {
  // 初始化Element UI国际化
  setupElementI18n()

  // 设置语言变更事件监听
  EventBus.$on('language-changed', (lang) => {
    console.log('Language changed to:', lang)
    setupElementI18n()
  })
}

// 创建Vue实例
const app = new Vue({
  router,
  pinia,
  // 在mounted钩子中初始化国际化，确保Pinia已完全初始化
  mounted() {
    initializeI18n()
  },
  render: (h) => h(App),
}).$mount('#ruijin')
