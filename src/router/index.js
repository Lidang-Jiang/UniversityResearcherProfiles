import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import { contantRoutes } from './contantRoutes'

Vue.use(VueRouter)

NProgress.configure({
  showSpinner: false,
})

// 重写 push
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onComplete, onAbort) {
  if (onComplete || onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }
  return originalPush.call(this, location).catch((error) => console.log(error))
}

// 重写 replace
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location, onComplete, onAbort) {
  if (onComplete || onAbort) {
    return originalReplace.call(this, location, onComplete, onAbort)
  }
  return originalReplace.call(this, location).catch((error) => console.log(error))
}

function createRouter() {
  return new VueRouter({
    // 修改点1: 将hash模式改为history模式，支持Nginx优雅路由
    mode: 'history',
    // 修改点2: 添加base属性，明确指定基础路径
    base: '/',
    routes: contantRoutes,
    // 修改点3: 添加滚动行为控制，提升用户体验
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    },
  })
}

const router = createRouter()

router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()

  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + import.meta.env.VITE_APP_NAME
  }
  next()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export default router
