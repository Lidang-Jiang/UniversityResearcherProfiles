<template>
  <layout>
    <template #content>
      <div class="news-container">
        <!-- 项目列表 -->
        <el-card v-for="(news, index) in newsList" :key="index" class="news-item">
          <div class="news-content">
            <div class="news-info">
              <div class="news-row">
                <!-- 标题和内容水平排列 -->
                <div class="news-title">
                  {{ news.newsTitle || (news.shelfTime ? news.shelfTime.replace('T', ' ') : '') }}
                </div>
                <div class="news-content-full" v-html="news.newsContent"></div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 加载状态和分页不变 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        <el-empty v-if="!loading && newsList.length === 0" description="暂无项目数据"></el-empty>
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
import { listNews } from '@/api/news'
import Pagination from '@/components/Pagination.vue'
import { t } from '@/locales/index'
import languageRefresh from '@/mixins/languageRefresh'

export default {
  name: 'News',
  components: {
    Layout,
    Pagination,
  },
  mixins: [languageRefresh],
  data() {
    return {
      refreshMethodName: 'fetchNews',
      newsList: [], // 项目列表
      totalItems: 0,
      pageSize: 10,
      currentPage: 1,
      loading: false,
      query: {
        newsTypeCode: '', // 修改: 使用项目类型作为筛选条件
      },
      // 项目类型列表，从后端ProjectType枚举映射
      newsTypes: [
        { code: 'basic', description: '基础研究' },
        { code: 'commercial', description: '企业横向' },
        // 可以根据后端实际枚举值添加更多项目类型
      ],
    }
  },
  created() {
    this.fetchNews()
  },
  methods: {
    t,

    // 获取项目列表
    async fetchNews() {
      this.loading = true
      try {
        const params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          newsTypeCode: this.query.newsTypeCode || undefined, // 修改: 使用项目类型作为筛选参数
        }

        const res = await listNews(params)

        // 处理API返回数据
        if (res && res.data) {
          this.newsList = res.data.newsList || []
          this.totalItems = res.data.totalCount || 0
        } else {
          this.newsList = []
          this.totalItems = 0
        }
      } catch (error) {
        console.error('获取项目列表失败:', error)
        this.$message.error('获取项目列表失败，请稍后重试')
        this.newsList = []
        this.totalItems = 0
      } finally {
        this.loading = false
      }
    },

    // 页码变化
    handlePageChange(page) {
      this.currentPage = page
      this.fetchNews()
    },
  },
}
</script>

<style lang="scss" scoped>
.loading-container {
  padding: 20px 0;
}

.filter-container {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;

  .form-inline {
    display: flex;
    justify-content: flex-start;

    .el-form-item {
      margin-right: 20px;
      margin-bottom: 0;
    }
  }
}

.news-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 0 auto;

  .news-item {
    width: 100%;
    max-width: 1200px;
    margin-bottom: 15px;
    overflow: hidden;
    border-radius: 20px;
    transition: transform 0.3s ease;

    &:hover {
      box-shadow: 0 6px 12px rgb(0 0 0 / 10%);
      transform: translateY(-3px);
    }

    .news-content {
      display: flex;
      flex-direction: column;
      padding: 5px;
    }

    .news-info {
      display: flex;
      flex: 1;
      flex-direction: column;
    }

    .news-row {
      display: flex;
      gap: 12px; // 标题和内容之间的间距
      align-items: flex-start; // 顶部对齐
    }

    .news-title {
      flex-shrink: 0; // 防止标题被挤压
      min-width: 150px; // 给标题一个最小宽度
      max-width: 200px; // 限制最大宽度
      margin-bottom: 0; // 移除原有的下边距
      overflow: hidden;
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      text-overflow: ellipsis; // 超长显示省略号
      white-space: nowrap; // 防止标题换行
    }

    .news-content-full {
      flex: 1; // 内容区域自适应剩余空间
      overflow: hidden; // 防止内容溢出
      line-height: 1.6;
      color: #606266;
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 30px;
  }
}

/* 处理v-html内容的样式 */
.news-content-full :deep(p) {
  margin: 0 0 8px;
}

.news-content-full :deep(img) {
  max-width: 100%;
}

@media screen and (max-width: 768px) {
  .news-container {
    padding: 10px;

    .news-item {
      .news-content {
        padding: 10px 5px;
      }
    }
  }
}
</style>
