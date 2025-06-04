<template>
  <layout>
    <template #content>
      <div class="projects-container">
        <!-- 筛选表单区域 -->
        <el-card class="filter-container">
          <el-form :inline="true" :model="query" class="form-inline">
            <!-- 修改: 替换硬编码中文为t函数 -->
            <el-form-item :label="t('projects.filter.projectType')" prop="projectTypeCode">
              <el-select
                v-model="query.projectTypeCode"
                :placeholder="t('projects.filter.allTypes')"
                clearable
                @change="handleFilterChange"
              >
                <el-option
                  v-for="type in localizedProjectTypes"
                  :key="type.code"
                  :label="type.description"
                  :value="type.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
        <!-- 项目列表 -->
        <el-card v-for="(project, index) in projectList" :key="index" class="project-item">
          <div slot="header" class="project-header">
            <span class="project-title">{{ project.title }}</span>
          </div>
          <div class="project-content-full" v-html="project.content"></div>
        </el-card>
        <!-- 加载状态和分页不变 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        <el-empty v-if="!loading && projectList.length === 0" description="暂无项目数据"></el-empty>
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
import { listProject } from '@/api/projects'
import Pagination from '@/components/Pagination.vue'
import { t } from '@/locales/index'
import languageRefresh from '@/mixins/languageRefresh'

export default {
  name: 'Projects',
  components: {
    Layout,
    Pagination,
  },
  mixins: [languageRefresh],
  data() {
    return {
      refreshMethodName: 'fetchProjects',
      projectList: [], // 项目列表
      totalItems: 0,
      pageSize: 10,
      currentPage: 1,
      loading: false,
      query: {
        projectTypeCode: '', // 修改: 使用项目类型作为筛选条件
      },
      // 项目类型列表，从后端ProjectType枚举映射
      projectTypes: [
        { code: 'basic', description: '基础研究' },
        { code: 'commercial', description: '企业横向' },
        // 可以根据后端实际枚举值添加更多项目类型
      ],
    }
  },
  computed: {
    // 新增计算属性：本地化后的项目类型列表
    localizedProjectTypes() {
      return this.projectTypes.map((type) => {
        // 根据当前code构建翻译键
        const translationKey = `projects.types.${type.code}`
        return {
          code: type.code,
          description: this.t(translationKey),
        }
      })
    },
  },
  created() {
    this.fetchProjects()
  },
  methods: {
    t,

    // 筛选变化处理函数
    handleFilterChange() {
      this.currentPage = 1 // 重置页码到第一页
      this.fetchProjects()
    },

    // 获取项目列表
    async fetchProjects() {
      this.loading = true
      try {
        const params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          projectTypeCode: this.query.projectTypeCode || undefined, // 修改: 使用项目类型作为筛选参数
        }

        const res = await listProject(params)

        // 处理API返回数据
        if (res && res.data) {
          this.projectList = res.data.projectList || []
          this.totalItems = res.data.totalCount || 0
        } else {
          this.projectList = []
          this.totalItems = 0
        }
      } catch (error) {
        console.error('获取项目列表失败:', error)
        this.$message.error('获取项目列表失败，请稍后重试')
        this.projectList = []
        this.totalItems = 0
      } finally {
        this.loading = false
      }
    },

    // 页码变化
    handlePageChange(page) {
      this.currentPage = page
      this.fetchProjects()
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

.projects-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 0 auto;

  .project-item {
    width: 100%;
    max-width: 1200px;
    margin-bottom: 15px;
    overflow: hidden;
    border-radius: 30px;
    transition: transform 0.3s ease;

    &:hover {
      box-shadow: 0 6px 12px rgb(0 0 0 / 10%);
      transform: translateY(-3px);
    }

    .project-content {
      display: flex;
      flex-direction: column;
      padding: 5px;
    }

    .project-info {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
    // 新增：标题头部样式
    .project-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;

      .project-title {
        position: relative;
        padding-left: 12px;
        font-size: 18px;
        font-weight: 600;
        color: var(--theme-color, #409eff); // 使用主题色变量，兼容无变量情况

        &::before {
          position: absolute;
          top: 50%;
          left: 0;
          width: 4px;
          height: 18px;
          content: '';
          background-color: var(--theme-color, #409eff);
          border-radius: 2px;
          transform: translateY(-50%);
        }
      }
    }

    // 调整内容区域样式以适应新结构
    .project-content-full {
      padding: 20px;
      line-height: 1.8;
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
.project-content-full :deep(p) {
  margin: 0 0 8px;
}

.project-content-full :deep(img) {
  max-width: 100%;
}

@media screen and (max-width: 768px) {
  .projects-container {
    padding: 10px;

    .project-item {
      .project-content {
        padding: 10px 5px;
      }
    }
  }
}
</style>
