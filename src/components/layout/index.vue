<template>
  <div class="layout">
    <AppHeader @search="setKeyword" />
    <div class="main-container">
      <!-- 添加侧边栏组件 -->
      <AppSidebar class="sticky-sidebar" />
      <div class="content-wrapper">
        <keep-alive :include="cachedPages">
          <router-view />
        </keep-alive>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './header.vue'
import AppSidebar from './sidebar.vue' // 引入侧边栏组件
import AppFooter from './footer.vue'
export default {
  name: 'AppLayout',
  components: {
    AppHeader,
    AppSidebar, // 注册侧边栏组件
    AppFooter, // 注册组件
  },
  provide() {
    return {
      getKeyword: () => {
        return this.keyword
      },
    }
  },
  data() {
    return {
      keyword: '',
      cachedPages: ['DigitalMemorial'],
    }
  },
  watch: {
    $route: {
      handler(route) {
        const columnId = route.meta.columnId ?? route.query.column_id
        const theme = columnId === '6' ? 'red' : '' // 党建专栏自定义主题色红色
        const currentTheme = document.documentElement.className
        if (theme !== currentTheme) {
          document.documentElement.className = theme ?? ''
        }
      },
      immediate: true,
    },
  },
  methods: {
    setKeyword(e) {
      this.keyword = e
    },
  },
}
</script>
<style lang="scss" scoped>
.layout {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;

  /* 步骤1: 重点修改 - 移除可能影响sticky的overflow-x:hidden */
  overflow: visible; /* 允许header的sticky定位正常工作 */
  background: #fff;
}

.main-container {
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  padding-top: 0;
  overflow-x: hidden; /* 保留这里的横向溢出控制，不影响header */
  overflow-y: visible; /* 步骤1: 确保垂直方向内容可见 */
}

.content-wrapper {
  box-sizing: border-box; /* 步骤5：确保padding不会增加元素宽度 */
  flex: 1;
  width: 100%; /* 步骤4：明确内容区域宽度 */
  padding: 0;

  /* 防止内容过宽导致布局破坏 */
  overflow-x: hidden;
  @media screen and (min-width: 1024px) {
    width: calc(100% - 350px); /* 步骤6：计算实际可用宽度 */
    margin-left: 350px; /* 给侧边栏预留空间 */
  }
}

.sticky-sidebar {
  @media screen and (min-width: 1024px) {
    position: fixed; /* 步骤7：恢复固定定位 */
    top: 80px; /* 步骤1: 从60px改为80px，与header高度一致 */
    left: 0; /* 步骤8：固定位置 */
    z-index: 10;
    width: 350px;
    height: calc(100vh - 80px); /* 步骤2: 一并修改计算值 */
    overflow-y: auto; /* 步骤11：侧边栏内容过多时可滚动 */
  }

  @media screen and (max-width: 1023px) {
    position: absolute; /* 步骤12：小屏幕使用绝对定位 */
    transform: translateX(-100%); /* 步骤13：默认隐藏侧边栏 */

    /* 这里可以添加侧边栏切换显示的逻辑，如需要 */
  }
}
</style>
