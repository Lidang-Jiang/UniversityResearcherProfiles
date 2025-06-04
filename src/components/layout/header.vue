<template>
  <div class="header">
    <div class="header__top">
      <div class="header__container">
        <!-- 现有的一级导航结构保持不变 -->
        <div class="header__left-spacer"></div>

        <div class="header__center">
          <el-menu :default-active="activeIndex" mode="horizontal" text-color="#333" router unique-opened>
            <!-- 步骤1: 添加循环渲染导航项 -->
            <template v-for="item in localizedColumnList">
              <!-- 修改: 移除el-submenu,改为点击事件 -->
              <el-menu-item :key="item.id" :index="item.routeName" @click="handleMainNavClick(item)">
                {{ item.columnsName }}
              </el-menu-item>
            </template>
          </el-menu>
        </div>

        <div class="header-right">
          <!-- 现有的右侧内容不变 -->
          <el-button
            class="languageCode-switch-btn"
            type="text"
            :title="currentLang === 'zh-CN' ? '切换到英文' : 'Switch to Chinese'"
            @click="handleToggleLang"
          >
            <img :src="require('@/assets/images/lang.jpg')" alt="Switch Language" class="languageCode-icon" />
          </el-button>
        </div>
      </div>
    </div>

    <!-- 步骤2: 添加二级导航水平条 -->
    <div v-if="activeSubMenus && activeSubMenus.length > 0" class="header__sub-nav">
      <div class="header__container">
        <div class="header__sub-nav-list">
          <router-link
            v-for="subItem in activeSubMenus"
            :key="subItem.id"
            :to="subItem.routeName"
            class="header__sub-nav-item"
            :class="{ 'is-active': $route.path === subItem.routeName }"
          >
            {{ subItem.columnsName }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import debounce from 'lodash.debounce'
import { mapState } from 'pinia'
import { useColumnStore } from '@/store'
import { t, useLangStore } from '@/locales' // 步骤2：引入国际化工具

export default {
  name: 'AppHeader',
  data() {
    return {
      hoveredNavId: '', // 菜单栏
      contactHref: '',
      mapHref: '',
      // 新增: 跟踪当前激活的主菜单
      activeMainNav: null,
      // 新增: 存储当前显示的子菜单项
      activeSubMenus: [],
    }
  },
  computed: {
    ...mapState(useColumnStore, {
      columnList() {
        return [
          { columnsName: 'Home', routeName: '/', id: '0' },
          // 在导航配置数组最前面插入新配置
          // 添加新的导航菜单
          {
            columnsName: 'Publications',
            routeName: '/publications',
            id: '1',
          },
          {
            columnsName: 'Projects',
            routeName: '/projects',
            id: '2',
          },
          {
            columnsName: 'News',
            routeName: '/news',
            id: '3',
          },
          {
            columnsName: 'SocialEducation',
            routeName: '/social-education',
            id: '5',
            columnManageListVOS: [
              { columnsName: '教育动态', routeName: '/social-education/dynamics', id: '51' },
              { columnsName: '活动公告', routeName: '/social-education/notice', id: '52' },
              { columnsName: '志愿者服务', routeName: '/social-education/volunteer', id: '53' },
            ],
          },
        ]
      },
      allColumnList(store) {
        const list = store.allColumnList.slice(0)
        return list
      },
    }),

    // 步骤3：添加本地化后的导航列表
    localizedColumnList() {
      return [
        { columnsName: this.t('nav.home'), routeName: '/', id: '0' },
        { columnsName: this.t('nav.publications'), routeName: '/publications', id: '1' },
        { columnsName: this.t('nav.projects'), routeName: '/projects', id: '2' },
        { columnsName: this.t('nav.news'), routeName: '/news', id: '3' },
      ]
    },

    ...mapState(useLangStore, ['currentLang']), // 步骤4：引入语言状态

    activeIndex() {
      return this.$route.meta?.activeNav || this.$route.path
    },
  },
  // 步骤5: 监听路由变化自动更新子菜单
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.updateActiveSubMenusByRoute()
      },
    },
  },
  mounted() {
    // 添加全局点击事件，用于关闭二级菜单
    document.addEventListener('click', this.handleOutsideClick)

    // 初次加载路由时同步菜单状态
    this.$nextTick(this.updateActiveSubMenusByRoute)
  },

  // 步骤2：组件销毁时移除事件监听，防止内存泄漏
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick)
  },
  methods: {
    // 步骤3：处理页面点击事件，判断是否应该关闭子菜单
    handleOutsideClick(e) {
      // 性能优化：如果没有子菜单显示，直接返回，避免不必要计算
      if (!this.activeSubMenus || !this.activeSubMenus.length) return

      // 判断点击是否在导航区域外
      const headerEl = this.$el
      const targetEl = e.target

      // 如果点击的不是导航元素或其子元素
      if (
        !headerEl.contains(targetEl) ||
        // 或者点击了没有子菜单的主菜单项
        this._isClickOnNonSubmenuItem(targetEl)
      ) {
        this.closeSubMenu()
      }
    },

    // 步骤4：辅助方法，判断是否点击了无子菜单的主菜单
    _isClickOnNonSubmenuItem(el) {
      // 向上查找最近的菜单项元素
      const menuItem = this._findParentByClass(el, 'el-menu-item')
      if (!menuItem) return false

      // 获取该菜单项对应的数据
      const itemId = menuItem.getAttribute('data-menu-id')
      if (!itemId) return false

      // 查找对应菜单项数据
      const item = this.localizedColumnList.find((i) => i.id === itemId)
      // 如果找到且没有子菜单，则关闭
      return item && (!item.columnManageListVOS || !item.columnManageListVOS.length)
    },

    // 步骤5：辅助方法，查找父元素
    _findParentByClass(el, className) {
      let current = el
      while (current && !current.classList.contains(className)) {
        current = current.parentElement
      }
      return current
    },

    // 步骤6：关闭子菜单的公共方法
    closeSubMenu() {
      // 添加过渡效果
      this.$el.querySelector('.header__sub-nav')?.classList.add('header__sub-nav--closing')

      // 延迟清空数据，让过渡动画有时间播放
      setTimeout(() => {
        this.activeSubMenus = []
        this.$el.querySelector('.header__sub-nav')?.classList.remove('header__sub-nav--closing')
      }, 150)
    },
    /**
     * 处理主导航点击事件(优化版)
     * @param {Object} item - 点击的导航项数据
     */
    handleMainNavClick(item) {
      // 步骤1: 添加防御性编程检查
      if (!item) return

      this.activeMainNav = item

      // 步骤2: 优化判断条件，增强健壮性
      const isSameMenu = this.activeSubMenus?.length > 0 && this.activeMainNav?.id === item.id

      if (isSameMenu) {
        this.closeSubMenu()
        return
      }

      // 步骤3: 处理有子菜单的情况
      if (item.columnManageListVOS?.length) {
        this.activeSubMenus = item.columnManageListVOS

        const firstSubItem = item.columnManageListVOS[0]

        // 步骤4: 性能优化 - 仅在路径不同时才进行导航
        if (this.$route.path !== firstSubItem.routeName) {
          // 步骤5: 添加导航前性能标记
          this.$perfTracker && this.$perfTracker('nav_autoselect_start')

          // 步骤6: 使用路由导航
          this.$router
            .push({
              path: firstSubItem.routeName,
            })
            .then(() => {
              // 步骤7: 导航成功回调
              this.$perfTracker && this.$perfTracker('nav_autoselect_end')

              // 步骤8: 更新活动状态
              this.$nextTick(() => {
                // 确保DOM更新后执行
                const subNavItems = this.$el.querySelectorAll('.header__sub-nav-item')
                subNavItems.forEach((item) => {
                  if (item.getAttribute('to') === firstSubItem.routeName) {
                    item.classList.add('is-active')
                  }
                })
              })
            })
            .catch((err) => {
              // 步骤9: 增强错误处理
              if (err.name !== 'NavigationDuplicated') {
                console.error('[导航菜单] 自动选择子菜单失败:', err)
              }
            })
        }
      } else {
        // 步骤10: 无子菜单时清空
        this.activeSubMenus = []
      }
    },
    // 步骤4: 路由变化时更新子菜单状态
    updateActiveSubMenusByRoute() {
      const path = this.$route.path
      // 查找当前路径对应的主菜单
      const activeMainNav = this.localizedColumnList.find((item) => {
        // 检查主菜单路径
        if (item.routeName === path) {
          return true
        }
        // 检查子菜单路径
        if (item.columnManageListVOS && item.columnManageListVOS.some((sub) => sub.routeName === path)) {
          return true
        }
        return false
      })

      if (activeMainNav) {
        this.activeMainNav = activeMainNav
        this.activeSubMenus = activeMainNav.columnManageListVOS || []
      }
    },

    // 步骤5：添加语言工具方法
    t,

    // 步骤6：添加语言切换方法（优化版）
    handleToggleLang() {
      const langStore = useLangStore()
      const newLang = langStore.toggleLang()

      // 添加过渡动画效果
      this.$nextTick(() => {
        document.documentElement.classList.add('languageCode-transition')
        setTimeout(() => {
          document.documentElement.classList.remove('languageCode-transition')
        }, 500)
      })

      // 明确触发全局事件，确保数据刷新
      this.$bus && this.$bus.$emit('languageCode-changed', newLang)

      // 可选：添加切换提示
      this.$message({
        message: newLang === 'zh-CN' ? '已切换到中文' : 'Switched to English',
        type: 'success',
        duration: 1500,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
$navHeight: 84px;
$transitionTime: 500ms;
$headerHeight: 80px; /* 步骤1: 定义变量方便复用 */

$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;
$border-radius-circle: 50%;

$box-shadow-sm: 0 2px 5px rgb(0 0 0 / 7%);
$box-shadow-md: 0 2px 10px rgb(0 0 0 / 10%);
$box-shadow-lg: 0 4px 16px rgb(0 0 0 / 12%);

$transition-normal: all 0.3s ease;

.header {
  position: sticky;
  position: -webkit-sticky; /* Safari支持 */
  top: 0;
  z-index: 999;
  width: 100%;
  min-width: 1508px;
  height: $headerHeight; /* 步骤2: 使用变量确保一致性 */

  /* 步骤3: 修复渲染性能 */
  will-change: transform;
  transform: translateZ(0);
  // 增加样式以支持二级导航
  &__sub-nav {
    position: relative;
    z-index: 998;
    width: 100%;
    height: 50px;
    // 步骤2：优化高度过渡效果
    max-height: 50px; // 注意：与height相同
    overflow: hidden;
    background-color: rgb(245 247 250);
    border-top: 1px solid rgb(0 0 0 / 5%);
    box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
    transition: max-height 0.3s ease, opacity 0.25s ease, transform 0.3s ease;
    transform: translateZ(0);

    // 增加硬件加速,优化滚动性能
    will-change: transform;

    // 步骤3：添加关闭状态动画
    &--closing {
      max-height: 0;
      opacity: 0;
      transform: translateY(-10px);
    }
  }
  // 步骤1：修复二级导航水平居中问题
  &__sub-nav-list {
    display: flex;
    align-items: center;
    justify-content: center; // 关键修复：添加水平居中
    width: 100%; // 确保占满容器宽度
    height: 100%;
    padding: 0 16px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__sub-nav-item {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
    margin: 0 8px;
    font-size: 14px;
    color: #333;
    text-decoration: none;
    white-space: nowrap;
    transition: $transition-normal;

    &:hover,
    &.is-active {
      position: relative;
      font-weight: 500;
      color: #409eff;

      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        content: '';
        background-color: currentcolor;
        transition: transform 0.3s ease;
        transform: scaleX(1);
      }
    }
    // 普通状态下隐藏下划线
    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      content: '';
      background-color: currentcolor;
      transition: transform 0.3s ease;
      transform: scaleX(0);
    }

    &:hover::after {
      transform: scaleX(0.8); // 悬停时显示80%宽度
    }
  }

  &__top {
    position: relative;
    z-index: 2;
    height: 80px;
    color: #333;
    background: rgb(255 255 255 / 98%);
    border-bottom: 1px solid rgb(0 0 0 / 8%);
    border-radius: $border-radius-sm;
    box-shadow: $box-shadow-md;
    transition: $transition-normal;
  }

  // 步骤1：添加三段式布局容器
  &__container {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between; // 三段式布局关键
    width: 100%;
    max-width: 1920px;
    height: 100%;
    padding: 0 24px;
    margin: 0 auto;
  }

  // 步骤2：左侧占位区样式
  &__left-spacer {
    flex-shrink: 0;
    width: 60px; // 与右侧按钮区域等宽
    // 可根据需要添加调试边框
    // border: 1px solid rgba(0, 0, 0, 0.1);
  }

  // 步骤3：中间导航区样式
  &__center {
    display: flex;
    flex: 1;
    justify-content: center; // 核心：确保导航居中
    overflow-x: auto;
    scrollbar-width: none; // Firefox隐藏滚动条

    &::-webkit-scrollbar {
      display: none; // Chrome隐藏滚动条
    }

    // 步骤4：内部el-menu样式优化
    // 步骤4：内部el-menu样式优化
    :deep(.el-menu) {
      display: flex;
      justify-content: center; // 步骤1: 确保菜单项居中
      margin: 12px 0 0;
      background: transparent;
      border: 0;

      // 步骤2: 优化菜单项样式
      .el-menu-item,
      .el-submenu__title {
        height: 56px; // 步骤3: 统一菜单项高度
        padding: 0 20px;
        font-size: 16px;
        line-height: 56px;
        color: #333;
        transition: $transition-normal;

        &:hover,
        &:focus {
          color: #409eff; // 使用Element UI主题色
          background-color: transparent; // 步骤4: 去除默认hover背景色
        }
      }

      // 步骤5: 当前激活菜单样式增强
      .is-active {
        font-weight: 500;
        color: #409eff;
        border-bottom: 2px solid #409eff;
      }
    }
  }
}

.nav-transitioning {
  .el-main {
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
}

// 步骤5：右侧区样式优化
.header-right {
  display: flex;
  flex-shrink: 0; // 防止压缩
  align-items: center;
  justify-content: flex-end; // 确保按钮靠右
  width: 60px; // 固定宽度值
  height: 100%;
}

.languageCode-switch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px; // 步骤1: 减小按钮整体尺寸
  height: 50px; // 按钮高宽一致
  padding: 2px; // 步骤2: 减少内边距，增大有效内容区
  background-color: rgb(0 0 0 / 3%); // 步骤3: 降低背景色对比度
  border-radius: $border-radius-md;
  transition: $transition-normal;

  &:hover {
    background-color: rgb(0 0 0 / 8%);
    box-shadow: 0 1px 3px rgb(0 0 0 / 5%); // 保持阴影轻微
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
}

// 语言图标样式优化
.languageCode-icon {
  width: 45px; // 保持图标尺寸不变
  height: 45px;
  object-fit: contain;
}
</style>
