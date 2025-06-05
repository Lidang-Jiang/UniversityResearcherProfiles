<template>
  <div v-if="showSidebar" class="sidebar">
    <!-- 步骤1：作者信息区域(对应Jekyll的author-profile) -->
    <div v-if="showAuthorProfile" class="author">
      <div class="author__inner">
        <!-- 在模板中优化头像显示逻辑 -->
        <div class="author__avatar">
          <el-skeleton v-if="isLoading" :rows="1" animated class="avatar-skeleton" />
          <img v-else :src="avatarUrl" alt="Author avatar" @error="handleImageError" />
        </div>
        <div class="author__content">
          <h3 class="author__name">{{ t('sidebar.authorInfo.name') }}</h3>
          <!-- 步骤8: 使用新的displayBio计算属性，并添加加载状态 -->
          <p class="author__bio">
            <el-skeleton v-if="isLoading" :rows="2" animated />
            <span v-else>{{ displayBio }}</span>
          </p>
        </div>

        <!-- 作者链接列表 - 使用Font Awesome图标 -->
        <div class="author__urls-wrapper">
          <ul class="author__urls">
            <li v-if="authorData.location">
              <font-awesome-icon icon="location-dot" class="icon-pad-right" /> {{ t('sidebar.authorInfo.location') }}
            </li>
            <li v-if="authorData.email">
              <a :href="`mailto:${authorData.email}`">
                <font-awesome-icon icon="envelope" class="icon-pad-right" /> {{ t('sidebar.links.email') }}
              </a>
            </li>
            <li v-if="authorData.github">
              <a :href="`https://github.com/${authorData.github}`" target="_blank">
                <font-awesome-icon :icon="['fab', 'github']" class="icon-pad-right" /> {{ t('sidebar.links.github') }}
              </a>
            </li>
            <li v-if="authorData.googlescholar">
              <a :href="authorData.googlescholar" target="_blank">
                <!-- 将临时图标替换为正式图标 -->
                <font-awesome-icon icon="graduation-cap" class="icon-pad-right" />
                {{ t('sidebar.links.googleScholar') }}
              </a>
            </li>
            <li v-if="authorData.orcid">
              <a :href="authorData.orcid" target="_blank">
                <!-- 使用ORCID官方品牌图标 -->
                <font-awesome-icon :icon="['fab', 'orcid']" class="icon-pad-right" /> ORCID
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/personal'
import { previewPic } from '@/api/utils'
import ProfileImage from '@/assets/images/profile.png'
import { t, useLangStore } from '@/locales'
import { getCachedAvatar, cacheAvatar, clearCache } from '@/utils/avatarCache'

export default {
  name: 'AppSidebar',
  data() {
    return {
      // 保留作者信息
      avatarUrl: ProfileImage,
      fallbackAvatar: ProfileImage,
      avatarLoading: false, // 专门用于头像加载状态
      // 步骤4: 新增图片加载状态管理
      imageLoaded: false,

      // 步骤1: 初始化userInfo对象
      userInfo: null,
      blobUrl: null, // 存储创建的blob URL，用于组件销毁时清理
      // 步骤2: 添加加载状态
      isLoading: false,
      authorData: {
        name: 'Ge He',
        bio: '', // 将从API获取
        location: 'China',
        email: '邮箱：hege@scu.edu.cn',
        github: 'hege-scu',
        googlescholar: 'https://scholar.google.com/citations?user=3i1Jq70AAAAJ&hl=zh-CN',
        orcid: 'https://orcid.org/0000-0001-8134-7513',
      },

      // 步骤2：通过路由状态控制是否显示侧边栏
      showSidebar: true,
      showAuthorProfile: true,
    }
  },

  computed: {
    // 监听语言变化
    currentLang() {
      const langStore = useLangStore()
      return langStore.currentLang
    },
    // 步骤3: 优化签名计算属性
    userSignature() {
      // 如果API数据未加载，返回null而不是空字符串，确保走到fallback逻辑
      if (!this.userInfo) return null

      // 根据当前语言选择显示中文或英文签名
      return this.currentLang === 'zh-CN' ? this.userInfo.signature : this.userInfo.signatureEn
    },

    // 步骤4: 添加展示用的bio计算属性，统一处理逻辑
    displayBio() {
      // 优先使用API获取的签名，未获取时使用i18n的静态文本
      return this.userSignature || t('sidebar.authorInfo.bio')
    },
  },

  watch: {
    // 步骤4：监听路由变化更新侧边栏
    $route(to) {
      this.updateSidebarByRoute(to)
    },

    // 监听语言变化，重新获取对应语言的用户信息
    currentLang(newLang) {
      console.log('[Language] Changed to:', newLang)
      this.fetchUserInfo(newLang)
      this.$forceUpdate() // 强制重新渲染
    },
  },
  async created() {
    this.updateSidebarByRoute(this.$route)
    await this.fetchUserInfo(this.currentLang)
  },
  mounted() {
    // 步骤6: 在mounted中而非created中处理图片加载
    this.preloadImage()
  },
  // 修改组件销毁逻辑，不再需要手动清理URL
  beforeDestroy() {
    // 释放资源逻辑由缓存服务统一管理，不再需要组件销毁时手动处理
    console.log('[资源清理] 组件销毁，资源由缓存服务管理')
  },
  methods: {
    async fetchUserInfo(langCode = 'zh-CN') {
      this.isLoading = true
      this.avatarLoading = true // 标记头像开始加载

      try {
        const response = await getUserInfo({ languageCode: langCode })

        if (response.errorCode === 0 && response.data) {
          this.userInfo = response.data

          // 显式检查头像名称是否存在
          if (response.data.avatarName && response.data.avatarName.trim() !== '') {
            await this.loadUserAvatar(response.data.avatarName)
          } else {
            console.warn('[用户信息] 用户没有设置头像')
          }

          console.log('[用户信息] 成功获取用户数据', this.userInfo)
        } else {
          console.warn('[用户信息] 获取失败:', response.errorMsg)
        }
      } catch (error) {
        console.error('[用户信息] 请求异常:', error)
      } finally {
        this.isLoading = false
        this.avatarLoading = false // 头像加载结束
      }
    },
    /**
     * 加载用户头像 - 优化版，支持缓存策略
     * @param {string} avatarName - 头像文件名
     */
    async loadUserAvatar(avatarName) {
      // 验证参数
      if (!avatarName) {
        console.warn('[头像加载] 未提供有效的头像名称')
        this.handleImageError()
        return
      }

      try {
        // 步骤1：检查缓存中是否有此头像
        const cachedUrl = getCachedAvatar(avatarName)

        if (cachedUrl) {
          // 缓存命中，直接使用缓存的URL
          console.log('[头像加载] 使用缓存头像')
          this.avatarUrl = cachedUrl
          this.imageLoaded = true

          // 记录当前URL用于后续清理（不需要手动清理，缓存服务会处理）
          this.blobUrl = null // 不再需要组件自行管理URL
          return
        }

        // 步骤2：缓存未命中，调用API获取Blob数据
        console.log('[头像加载] 缓存未命中，从API获取头像')
        const blobData = await previewPic(avatarName)

        // 步骤3：检查返回的是否为有效的Blob对象
        if (blobData instanceof Blob) {
          // 步骤4：缓存头像并获取URL
          const imageUrl = cacheAvatar(avatarName, blobData)

          if (imageUrl) {
            // 步骤5：更新头像URL
            this.avatarUrl = imageUrl
            this.imageLoaded = true
            console.log('[头像加载] 成功加载用户头像并缓存')
          } else {
            console.error('[头像加载] 创建缓存URL失败')
            this.handleImageError()
          }
        } else {
          console.error('[头像加载] 返回的数据不是有效的Blob对象')
          this.handleImageError()
        }
      } catch (error) {
        console.error('[头像加载] 加载失败:', error)
        this.handleImageError()
      }
    },
    // 国际化工具方法
    t,

    // 步骤7: 图片预加载处理
    preloadImage() {
      const img = new Image()
      img.onload = () => {
        this.imageLoaded = true
        console.log('[头像加载] 成功加载头像图片')
      }

      img.onerror = () => {
        console.warn('[头像加载失败] 已切换为默认头像')
        this.avatarUrl = this.fallbackAvatar

        // 如果备用图片也无法加载，使用Element UI的默认头像
        const fallbackImg = new Image()
        fallbackImg.onerror = () => {
          this.avatarUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        }
        fallbackImg.src = this.fallbackAvatar
      }

      img.src = this.avatarUrl
    },

    // 步骤7：文本格式化，支持Markdown语法
    formatText(text) {
      // 保持原有逻辑不变
      if (!text) return ''
      return text.replace(/\n/g, '<br>')
    },
    handleImageError() {
      // 保持原有的错误处理逻辑
      const img = new Image()
      img.onerror = () => {
        this.avatarUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        console.warn('[头像加载失败] 已切换为默认头像')
      }
      img.src = this.avatarUrl
    },

    // 步骤5：根据路由更新侧边栏配置
    updateSidebarByRoute(route) {
      // 模拟Jekyll的页面配置逻辑
      const routeConfig = {
        '/': {
          showSidebar: true,
          showAuthorProfile: true,
          sidebar: this.getDefaultSidebar(),
        },
        '/publications': {
          showSidebar: true,
          showAuthorProfile: true,
          sidebar: this.getPublicationsSidebar(),
        },
        '/projects': {
          showSidebar: true,
          showAuthorProfile: true,
          sidebar: this.getProjectsSidebar(),
        },
      }

      // 获取当前路由的配置
      const config = routeConfig[route.path] || routeConfig['/']
      this.showSidebar = config.showSidebar
      this.showAuthorProfile = config.showAuthorProfile
    },

    // 步骤6：不同页面的侧边栏配置
    getDefaultSidebar() {
      return {
        items: [
          {
            title: '研究领域',
            text: '计算机视觉、深度学习、医学图像分析',
            image: null,
          },
        ],
        nav: {
          title: '导航',
          items: [
            { title: '首页', url: '/' },
            { title: '论文发表', url: '/publications' },
            { title: '研究项目', url: '/projects' },
          ],
        },
      }
    },

    getPublicationsSidebar() {
      return {
        items: [
          {
            title: '论文统计',
            text: '期刊论文: 5篇\n会议论文: 3篇\n专利: 2项',
            image: null,
          },
        ],
        nav: {
          title: '分类查看',
          items: [
            { title: '所有论文', url: '/publications' },
            { title: '期刊论文', url: '/publications?type=journal' },
            { title: '会议论文', url: '/publications?type=conference' },
          ],
        },
      }
    },

    getProjectsSidebar() {
      // 项目页面侧边栏配置
      return {
        items: [
          {
            title: '项目类型',
            text: '国家自然科学基金项目\n企业合作项目\n学校科研项目',
            image: null,
          },
        ],
        nav: {
          title: '分类查看',
          items: [
            { title: '所有项目', url: '/projects' },
            { title: '进行中', url: '/projects?status=active' },
            { title: '已完成', url: '/projects?status=completed' },
          ],
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/* 侧边栏基础样式 */
$headerHeight: 80px; /* 步骤1: 与header保持一致的高度变量 */
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;
$border-radius-circle: 50%;

$box-shadow-sm: 0 2px 5px rgb(0 0 0 / 7%);
$box-shadow-md: 0 2px 10px rgb(0 0 0 / 10%);
$box-shadow-lg: 0 4px 16px rgb(0 0 0 / 12%);

$transition-normal: all 0.3s ease;

.icon-pad-right {
  width: 1em;
  margin-right: 0.5em;
}

.sidebar {
  box-sizing: border-box;

  /* 步骤1: 使用flex布局 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中关键属性 */
  width: 100%;
  padding: 1.5em;
  background-color: #fff;
  border-radius: $border-radius-md;
  box-shadow: $box-shadow-sm;
  transition: $transition-normal;
  transform: translate3d(0, 0, 0);

  @media screen and (min-width: 1024px) {
    position: fixed;
    top: $headerHeight;
    left: 0;
    z-index: 10;
    width: 350px;
    height: calc(100vh - #{$headerHeight});
    overflow-y: auto;
  }

  h3 {
    margin-bottom: 0.5em;
    font-family: Arial, sans-serif;
    font-size: 1.25rem;
  }

  p,
  li {
    font-family: Arial, sans-serif;
    font-size: 0.875rem;
    line-height: 1.5;
  }
}

/* 作者资料区样式 */
.author {
  width: 100%;
  max-width: 100%;
  padding: 40px 20px; /* 减小左右内边距，为内部容器留更多空间 */
  background-color: #fff;
  border-radius: $border-radius-md;
  border-radius: 30px;
  box-shadow: $box-shadow-sm;

  &__inner {
    // 新增：创建内部内容对齐容器
    display: flex;
    flex-direction: column;
    align-items: center; // 整体居中
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }

  // 新增：文本内容容器
  &__text-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start; // 所有文本内容左对齐
    width: 100%;
  }

  &__avatar {
    display: block;
    width: 100%;
    margin-bottom: 1em;
    text-align: center;

    img {
      max-width: 110px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 50%;
      box-shadow: $box-shadow-sm;
    }
  }

  &__content {
    display: block;
    width: 100%;

    /* 内容区不需要特殊对齐，由内部元素控制 */
  }

  &__name {
    width: 100%;
    margin: 0.5em 0;
    font-size: 1.25rem;
    text-align: center; // 保持姓名居中
  }

  &__bio {
    width: 100%;
    margin: 0.5em 0 1.5em;
    text-align: center; // 保持签名居中
  }

  &__location {
    margin-bottom: 1em;
    font-size: 0.875rem;
    color: #666;
    text-align: center; // 保持签名居中
  }
}

/* 作者链接区样式 */
.author__urls-wrapper {
  margin-bottom: 2em;
  text-align: left; /* 确保链接区左对齐 */

  .author__urls {
    padding: 0;
    margin: 0;
    list-style-type: none;

    /* 链接项样式保持不变 */
    li {
      margin-bottom: 0.5em;
      white-space: nowrap;
    }
  }
}

/* 导航区样式 */
.navigation {
  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      margin-bottom: 0.5em;

      a {
        color: #333;
        text-decoration: none;

        &:hover,
        &.router-link-active {
          color: #0366d6;
          text-decoration: underline;
        }
      }
    }
  }
}

/* 步骤11：添加自定义侧边栏项样式 */
.sidebar-item {
  margin-bottom: 1.5em;

  &__image {
    width: 100%;
    margin-bottom: 0.5em;
  }

  &__title {
    margin-top: 0;
    margin-bottom: 0.5em;
    font-family: Arial, sans-serif;
    font-size: 1.125rem;
  }

  &__text {
    font-size: 0.875rem;
    line-height: 1.6;

    :deep(a) {
      // 步骤1：修复深度选择器语法
      color: #0366d6;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

/* 步骤12：添加导航列表样式 */
.nav-list {
  margin-bottom: 1.5em;

  &__title {
    margin-top: 0;
    margin-bottom: 0.75em;
    font-size: 1.125rem;
  }

  &__items {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
}

.nav-item {
  margin-bottom: 0.5em;

  &__link {
    display: block;
    padding: 0.25em 0;
    font-size: 0.875rem;
    color: #333;
    text-decoration: none;

    &:hover,
    &.router-link-active {
      color: #0366d6;
      text-decoration: underline;
    }
  }
}

.navigation,
.sidebar-item,
.nav-list {
  padding: 12px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: $border-radius-md; // 步骤6：导航区域圆角化
  box-shadow: $box-shadow-sm; // 步骤7：轻微阴影
}
</style>
