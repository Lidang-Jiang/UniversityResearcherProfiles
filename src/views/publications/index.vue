<template>
  <layout>
    <template #content>
      <div class="publications-container">
        <!-- 步骤1: 添加筛选表单区域 -->
        <el-card class="filter-container">
          <el-form :inline="true" :model="query" class="form-inline">
            <!-- 步骤2: 添加领域分类筛选下拉框，使用t函数实现多语言 -->
            <el-form-item :label="t('sidebar.nav.researchArea')" prop="domainCategoryCode">
              <el-select
                v-model="query.domainCategoryCode"
                :placeholder="t('domainCategory.all')"
                clearable
                @change="handleFilterChange"
              >
                <el-option
                  v-for="code in domainCategoryCodes"
                  :key="code"
                  :label="t(`domainCategory.${code}`)"
                  :value="code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card v-for="(publication, index) in publicationList" :key="index" class="publication-item">
          <!-- 步骤1: 添加flex容器包裹图片和内容 -->
          <div class="publication-content">
            <!-- 步骤2: 左侧图片区域 -->
            <div v-if="publication.pictureName" class="publication-image-container">
              <img
                v-if="publication.imageUrl"
                :src="publication.imageUrl"
                class="publication-image"
                alt="Article image"
                @error="handleImageError(publication)"
              />
              <div v-else class="image-placeholder">
                <i class="el-icon-picture-outline"></i>
              </div>
            </div>
            <!-- 空图片占位，确保布局一致性 -->
            <div v-else class="publication-image-container empty-image">
              <div class="image-placeholder">
                <i class="el-icon-picture-outline"></i>
              </div>
            </div>

            <!-- 步骤3: 右侧内容区域 -->
            <div class="publication-info">
              <!-- 标题 -->
              <a
                v-if="publication.titleUrl"
                :href="publication.titleUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="publication-title-link"
                >{{ publication.title }}</a
              >
              <div v-else class="publication-title">{{ publication.title }}</div>

              <!-- 文章摘要 -->
              <div v-if="publication.summary" class="publication-summary" v-html="publication.summary"></div>

              <!-- 文章元数据 -->
              <div class="publication-meta">
                <div class="publication-authors">{{ publication.articleRefence }}</div>
                <!-- 步骤3: 使用国际化显示领域分类 -->
                <div class="publication-year">{{ formatDate(publication.publishedDate) }}</div>
              </div>

              <!-- 操作按钮 -->
              <div class="publication-actions">
                <el-button
                  v-if="publication.pdfName"
                  type="primary"
                  size="mini"
                  icon="el-icon-download"
                  @click="handleDownloadPDF(publication.pdfName, publication.title)"
                  >{{ t('publications.downloadPDF') }}</el-button
                >
                <el-button type="text" class="detail-link" @click="viewDetail(publication.articleId)">{{
                  t('publications.viewDetail')
                }}</el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 加载状态和分页不变 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        <el-empty v-if="!loading && publicationList.length === 0" description="暂无发布物数据"></el-empty>
        <div v-if="totalItems > 0" class="pagination-container">
          <Pagination
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            :total="totalItems"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </template>
  </layout>
</template>

<script>
// 引入内层布局组件
import Layout from '@/components/layout/layout.vue'
import { listArticle } from '@/api/publications'
import { previewPic, downloadPDF } from '@/api/utils'
import Pagination from '@/components/Pagination.vue'
import { t } from '@/locales/index' // 步骤4: 引入国际化工具函数
import languageRefresh from '@/mixins/languageRefresh' // 新增: 引入语言刷新混入

export default {
  name: 'Publications',
  components: {
    Layout,
    Pagination,
  },
  mixins: [languageRefresh], // 新增: 应用语言刷新混入
  data() {
    return {
      refreshMethodName: 'fetchPublications', // 步骤3: 指定刷新方法名称（可选）
      publicationList: [], // 出版物列表
      totalItems: 0, // 总条目数
      pageSize: 10, // 每页显示数量
      currentPage: 1, // 当前页码
      loading: false, // 加载状态
      query: {
        domainCategoryCode: '', // 步骤5: 将领域分类代码移至query对象
      },
      imageLoadErrors: new Set(), // 记录图片加载失败的条目
      // 步骤6: 添加领域分类代码列表
      domainCategoryCodes: ['materials', 'device', 'process'],
    }
  },
  created() {
    this.fetchPublications()
  },
  // 组件销毁前释放所有Blob URL，避免内存泄漏
  beforeDestroy() {
    this.publicationList.forEach((publication) => {
      if (publication.imageUrl) {
        URL.revokeObjectURL(publication.imageUrl)
      }
    })
  },
  methods: {
    // 步骤7: 暴露t函数给模板使用
    t,

    // 步骤8: 添加获取领域分类文本的方法
    getDomainCategoryText(code) {
      if (!code) return t('domainCategory.all')
      return t(`domainCategory.${code}`)
    },

    // 步骤9: 添加筛选变化处理函数
    handleFilterChange() {
      this.currentPage = 1 // 重置页码到第一页
      this.fetchPublications()
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return ''
      // 仅保留年份
      return dateString.split('-')[0] || dateString
    },
    // 修改: 获取出版物列表方法 - 将会被语言切换时自动调用
    async fetchPublications() {
      this.loading = true
      try {
        // 清理之前的Blob URLs（避免内存泄漏）
        this.publicationList.forEach((publication) => {
          if (publication.imageUrl && publication.imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(publication.imageUrl)
          }
        })

        // 步骤10: 修改API参数对象，使用query中的筛选条件
        const params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          domainCategoryCode: this.query.domainCategoryCode || undefined,
        }

        const res = await listArticle(params)

        // 处理API返回数据
        if (res && res.data) {
          this.publicationList = res.data.articleList || []
          this.totalItems = res.data.totalCount || 0

          // 加载每篇文章的图片
          this.publicationList.forEach((publication) => {
            if (publication.pictureName) {
              this.loadArticleImage(publication)
            }
          })
        } else {
          this.publicationList = []
          this.totalItems = 0
        }
      } catch (error) {
        console.error('获取发布物列表失败:', error)
        this.$message.error('获取发布物列表失败，请稍后重试')
        this.publicationList = []
        this.totalItems = 0
      } finally {
        this.loading = false
      }
    },
    // 新增: 加载文章图片
    async loadArticleImage(publication) {
      // 避免重复加载失败的图片
      if (this.imageLoadErrors.has(publication.pictureName)) return

      try {
        const response = await previewPic(publication.pictureName)
        // 创建Blob URL
        const imageUrl = URL.createObjectURL(response)
        // 使用Vue的响应式更新来确保UI更新
        this.$set(publication, 'imageUrl', imageUrl)
      } catch (error) {
        console.error('加载文章图片失败:', error)
        this.imageLoadErrors.add(publication.pictureName)
      }
    },

    // 新增: 图片加载错误处理
    handleImageError(publication) {
      this.imageLoadErrors.add(publication.pictureName)
      this.$set(publication, 'imageUrl', null)
    },

    // 新增: 处理PDF下载
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

    // 查看详情
    viewDetail(id) {
      this.$router.push(`/publications/detail/${id}`)
    },

    // 页码变化
    handlePageChange(page) {
      this.currentPage = page
      this.fetchPublications()
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.el-button--mini) {
  border-radius: 10px;
}

.loading-container {
  padding: 20px 0;
}

/* 步骤11: 添加筛选区域样式 */
.filter-container {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
  border-radius: 20px;

  .form-inline {
    display: flex;
    justify-content: flex-start;

    .el-form-item {
      margin-right: 20px;
      margin-bottom: 0;
    }
  }
}

.publications-container {
  display: flex;
  flex-direction: column;
  align-items: center; // 新增：水平居中所有子元素
  padding: 20px;
  margin: 0 auto; // 步骤2: 居中显示

  .publication-item {
    width: 100%;
    max-width: 1200px; // 新增：限制最大宽度
    margin-bottom: 15px;
    overflow: hidden;
    border-radius: 30px;
    transition: transform 0.3s ease;

    &:hover {
      box-shadow: 0 6px 12px rgb(0 0 0 / 10%);
      transform: translateY(-3px);
    }

    // 水平布局样式
    .publication-content {
      display: flex;
      gap: 20px;
    }

    // 调整图片容器样式保持不变
    .publication-image-container {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 180px;
      height: 180px;
      overflow: hidden;
      background-color: #f5f7fa;

      &.empty-image {
        opacity: 0.5;
      }

      .publication-image {
        max-width: 100%;
        max-height: 180px;
        object-fit: contain;
      }

      .image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #909399;

        i {
          font-size: 48px;
        }
      }
    }

    // 调整内容区域样式
    .publication-info {
      display: flex;
      flex: 1;
      flex-direction: column;
    }

    .publication-title,
    .publication-title-link {
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      text-decoration: none;
    }

    .publication-title-link {
      color: #409eff;

      &:hover {
        text-decoration: underline;
      }
    }

    // 修改：摘要样式，限制为两行
    .publication-summary {
      position: relative;
      display: -webkit-box; // 新增：使用webkit-box布局
      margin: 8px 0;
      overflow: hidden;
      line-height: 1.6;
      color: #606266;
      text-overflow: ellipsis; // 新增：末尾显示省略号
      -webkit-line-clamp: 2; // 新增：限制为两行
      -webkit-box-orient: vertical; // 新增：垂直方向
    }

    // 其他样式保持不变
    .publication-meta {
      padding-top: 10px;
      margin-top: auto;
    }

    .publication-authors,
    .publication-journal,
    .publication-year {
      margin-bottom: 5px;
      color: #606266;
    }

    .publication-actions {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }

    .detail-link {
      margin-left: 10px;
      color: #af2125;
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    width: 100%; // 确保分页控件也能在容器中居中
    margin-top: 30px;
  }
}

/* 处理v-html内容的样式 */
.publication-summary :deep(p) {
  margin: 0 0 8px;
}

.publication-summary :deep(img) {
  max-width: 100%;
}

// 步骤8: 添加媒体查询实现响应式布局
@media screen and (max-width: 768px) {
  .publications-container {
    .publication-item {
      .publication-content {
        flex-direction: column;
      }

      .publication-image-container {
        width: 100%;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
