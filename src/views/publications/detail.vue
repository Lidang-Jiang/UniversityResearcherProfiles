<script>
// 引入内层布局组件
import Layout from '@/components/layout/layout.vue'
import { listArticle } from '@/api/publications'
import { previewPic, downloadPDF } from '@/api/utils'
import { t } from '@/locales/index'
import languageRefresh from '@/mixins/languageRefresh' // 引入语言刷新混入

export default {
  name: 'PublicationDetail',
  components: {
    Layout,
  },
  mixins: [languageRefresh], // 应用语言刷新混入
  data() {
    return {
      refreshMethodName: 'fetchPublicationDetail', // 指定刷新方法名称
      articleId: null, // 当前文章ID
      originalArticleId: null, // 新增: 保存初始文章ID(用于恢复)
      associationId: null, // 新增: 存储关联文章ID
      loading: true,
      publication: {
        title: '',
        articleRefence: '',
        publishedDate: '',
        titleUrl: '',
        summary: '',
        pictureName: '',
        pdfName: '',
        imageUrl: null,
        domainCategoryCode: '',
      },
    }
  },
  created() {
    // 获取路由参数中的ID
    this.articleId = this.$route.params.id
    // 新增: 保存初始ID，用于可能的回退场景
    this.originalArticleId = this.articleId

    if (this.articleId) {
      this.fetchPublicationDetail()
    } else {
      this.$message.error('文章ID不存在')
      this.loading = false
    }
  },
  // 组件销毁前释放Blob URL，避免内存泄漏
  beforeDestroy() {
    if (this.publication.imageUrl) {
      URL.revokeObjectURL(this.publication.imageUrl)
    }
  },
  methods: {
    t, // 暴露国际化函数给模板使用

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return ''
      return dateString.split('-')[0] || dateString
    },

    // 获取出版物详情
    async fetchPublicationDetail() {
      this.loading = true

      try {
        // 调用与列表相同的API，但传入文章ID作为筛选条件
        const params = {
          articleId: this.articleId, // 使用当前ID，可能是初始ID或关联ID
          pageNo: 1,
          pageSize: 1,
        }

        const res = await listArticle(params)

        if (res && res.data && res.data.articleList && res.data.articleList.length > 0) {
          // 取第一条数据作为当前文章
          this.publication = res.data.articleList[0]

          // 关键修复: 保存关联ID，用于语言切换
          if (this.publication.associationId) {
            // 记录关联ID，供后续语言切换使用
            this.associationId = this.publication.associationId
          }

          // 如果有图片，加载图片
          if (this.publication.pictureName) {
            this.loadArticleImage()
          }

          // 设置页面标题
          document.title = this.publication.title || '文章详情'
        } else {
          // 处理未找到文章的情况
          this.$message.error('未找到文章信息')

          // 新增: 尝试使用初始ID重新获取
          if (this.articleId !== this.originalArticleId) {
            console.info('正在尝试使用原始ID重新获取文章')
            this.articleId = this.originalArticleId
            this.associationId = null

            // 避免递归调用导致无限循环
            setTimeout(() => this.fetchPublicationDetail(), 100)
            return
          }
        }
      } catch (error) {
        console.error('获取文章详情失败:', error)
        this.$message.error('获取文章详情失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 新增: 语言切换前的准备工作
    prepareLanguageSwitch() {
      // 检查是否有关联ID可用
      if (this.associationId) {
        // 使用关联ID替换当前ID
        this.articleId = this.associationId

        // 重置关联ID(因为获取新数据后会再次更新)
        this.associationId = null

        return true
      }
      return false
    },

    // 重写handleLanguageChange方法，覆盖mixin中的默认实现
    handleLanguageChange(newLang) {
      // 先执行准备工作，更新articleId
      this.prepareLanguageSwitch()

      // 设置加载状态
      this.isLanguageRefreshing = true

      // 延迟执行刷新，确保语言状态已完全更新
      this.$nextTick(() => {
        // 调用获取数据方法
        const fetchPromise = this.fetchPublicationDetail()

        // 处理Promise完成后的状态
        if (fetchPromise && typeof fetchPromise.finally === 'function') {
          fetchPromise.finally(() => {
            this.isLanguageRefreshing = false
          })
        } else {
          this.$nextTick(() => {
            this.isLanguageRefreshing = false
          })
        }
      })
    },

    // 现有方法保持不变
    async loadArticleImage() {
      try {
        const response = await previewPic(this.publication.pictureName)
        // 创建Blob URL
        const imageUrl = URL.createObjectURL(response)
        // 使用Vue的响应式更新
        this.$set(this.publication, 'imageUrl', imageUrl)
      } catch (error) {
        console.error('加载文章图片失败:', error)
        this.$set(this.publication, 'imageUrl', null)
      }
    },

    // 图片加载错误处理
    handleImageError() {
      this.$set(this.publication, 'imageUrl', null)
    },

    // 处理PDF下载
    async handleDownloadPDF(filename, title) {
      if (!filename) {
        this.$message.warning('PDF文件不存在')
        return
      }

      try {
        const response = await downloadPDF(filename)

        // 创建下载链接
        const url = URL.createObjectURL(response)
        const link = document.createElement('a')
        link.href = url
        // 使用文章标题作为文件名，添加.pdf后缀
        link.download = `${title || 'document'}.pdf`
        document.body.appendChild(link)
        link.click()

        // 清理
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url) // 释放Blob URL
        }, 100)

        this.$message.success('PDF下载成功')
      } catch (error) {
        console.error('PDF下载失败:', error)
        this.$message.error('PDF下载失败，请稍后重试')
      }
    },

    // 返回列表页
    goBack() {
      this.$router.push('/publications')
    },
  },
}
</script>

<template>
  <layout>
    <template #content>
      <div class="publication-detail">
        <!-- 加载状态显示 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="10" animated />
        </div>

        <template v-else>
          <!-- 论文基本信息区 -->
          <el-card class="info-card">
            <!-- 标题部分 - 独立且居中 -->
            <div class="publication-title-container">
              <h1 class="publication-title">{{ publication.title }}</h1>
            </div>

            <!-- 元数据部分 -->
            <div class="publication-meta">
              <div class="meta-item">
                <span class="meta-label">{{ t('publications.detail.reference') }}</span>
                <span class="meta-value">{{ publication.articleRefence }}</span>
              </div>
              <div v-if="publication.publishedDate" class="meta-item">
                <span class="meta-label">{{ t('publications.detail.publishDate') }}</span>
                <span class="meta-value">{{ formatDate(publication.publishedDate) }}</span>
              </div>
              <div v-if="publication.titleUrl" class="meta-item">
                <span class="meta-label">{{ t('publications.detail.titleUrl') }}</span>
                <span class="meta-value">
                  <a :href="publication.titleUrl" target="_blank">{{ publication.titleUrl }}</a>
                </span>
              </div>
              <div v-if="publication.domainCategoryCode" class="meta-item">
                <span class="meta-label">{{ t('publications.detail.researchField') }}</span>
                <span class="meta-value">{{ t(`domainCategory.${publication.domainCategoryCode}`) }}</span>
              </div>
            </div>

            <div class="divider"></div>

            <!-- 🔥 核心重构：摘要区域 - 扁平化DOM结构实现真正的文字环绕 -->
            <div v-if="publication.summary" class="summary-section">
              <!-- 摘要标题 - 独立显示在最上方 -->
              <div class="section-title">{{ t('publications.detail.summary') }}</div>

              <!-- 🎯 关键：图片直接浮动在文字流中 -->
              <div v-if="publication.pictureName" class="publication-image-container">
                <img
                  v-if="publication.imageUrl"
                  :src="publication.imageUrl"
                  class="publication-image"
                  alt="Article image"
                  @error="handleImageError"
                />
                <div v-else class="image-placeholder">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </div>

              <!-- 摘要内容 - 直接跟在图片后面，实现环绕效果 -->
              <div class="section-content" v-html="publication.summary"></div>
            </div>
          </el-card>

          <!-- 底部操作区 -->
          <div class="action-container">
            <el-button
              v-if="publication.pdfName"
              type="primary"
              icon="el-icon-download"
              @click="handleDownloadPDF(publication.pdfName, publication.title)"
            >
              {{ t('publications.detail.downloadPDF') }}
            </el-button>
            <el-button @click="goBack">{{ t('publications.detail.back') }}</el-button>
          </div>
        </template>
      </div>
    </template>
  </layout>
</template>
<style lang="scss" scoped>
:deep(.el-button--small) {
  border-radius: 10px;
}

.publication-detail {
  padding: 20px;
  margin: 0 auto; // 步骤2: 居中显示

  .loading-container {
    padding: 20px;
  }

  .info-card,
  .citation-card {
    margin-bottom: 20px;
    border-radius: 30px;
  }

  /* 🔥 新增：标题容器样式重置 */
  .publication-title-container {
    margin-bottom: 20px;
    text-align: center;

    .publication-title {
      /* 🎯 关键修复：完全重置h1样式，避免继承Layout的样式 */
      width: auto !important; // 覆盖固定宽度
      height: auto !important; // 覆盖固定高度
      padding: 0 !important; // 重置内边距
      margin: 0 !important; // 重置外边距
      font-size: 28px !important; // 合适的标题字体大小
      font-weight: bold !important; // 加粗显示
      line-height: 1.3 !important; // 自然行高
      color: #303133 !important; // 深色文字，确保可读性
      text-align: center !important; // 水平居中
      background: none !important; // 移除背景色
      border-radius: 0 !important; // 移除圆角
    }
  }

  .publication-image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    width: 460px;
    height: 460px;
    margin: 0 30px 20px 0;
    overflow: hidden;
    background-color: #f5f7fa;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgb(0 0 0 / 12%);

    .publication-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }

    .image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #909399;

      i {
        font-size: 96px;
      }
    }

    @media (max-width: 1200px) {
      width: 420px;
      height: 420px;
      margin: 0 25px 18px 0;

      .image-placeholder i {
        font-size: 72px;
      }
    }

    @media (max-width: 768px) {
      float: none;
      width: 100%;
      height: 300px;
      margin: 0 0 25px;

      .image-placeholder i {
        font-size: 64px;
      }
    }
  }

  /* 🔥 核心重构：摘要区域样式 */
  .summary-section {
    margin: 20px 0;

    /* 摘要标题样式 */
    .section-title {
      margin-bottom: 16px;
      clear: both;
      font-size: 20px;
      font-weight: bold;
      line-height: 1.4;
      color: #303133;
    }

    /* 🔥 关键：摘要内容样式保持不变 */
    .section-content {
      font-size: 15px;
      hyphens: auto;
      line-height: 1.8;
      color: #606266;
      text-align: justify;
      word-wrap: break-word;
    }

    /* 🔥 清除浮动 - 防止影响后续元素 */
    &::after {
      display: table;
      clear: both;
      content: '';
    }
  }

  .publication-meta {
    margin-bottom: 20px;

    .meta-item {
      // 步骤1: 使用Flexbox布局替代inline-block
      display: flex;
      align-items: baseline; // 文本基线对齐
      margin-bottom: 12px;

      .meta-label {
        // 步骤2: 移除inline-block，使用flex-shrink防止压缩
        flex-shrink: 0;
        min-width: 120px; // 步骤3: 增加最小宽度到120px
        margin-right: 16px;
        font-weight: bold;
        color: #303133;

        // 步骤4: 确保文本不换行
        white-space: nowrap;
      }

      .meta-value {
        // 步骤5: 值部分自动占据剩余空间
        flex: 1;
        line-height: 1.4; // 统一行高
        color: #606266;

        a {
          color: #af2125;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .divider {
    height: 1px;
    margin: 20px 0;
    background-color: #ebeef5;
  }

  /* v-html内容样式处理 */
  .section-content :deep(p) {
    margin: 0 0 12px;
  }

  .section-content :deep(img) {
    max-width: 100%;
  }

  .action-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 30px;
    clear: both;

    .el-button {
      min-width: 120px;
    }
  }
}
</style>
