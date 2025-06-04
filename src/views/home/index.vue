<template>
  <layout>
    <template #content>
      <div class="self-intro-container">
        <!-- 加载状态展示 -->
        <div v-if="loading" class="loading-container">
          <el-spinner type="primary" />
          <span>数据加载中...</span>
        </div>

        <!-- 数据为空状态 -->
        <el-empty v-else-if="!loading && (!introList || introList.length === 0)" description="暂无简介数据" />

        <!-- 数据展示区域 -->
        <div v-else class="intro-list">
          <el-card v-for="(item, index) in introList" :key="index" class="intro-item" shadow="hover">
            <div slot="header" class="intro-header">
              <span class="intro-title">{{ item.title }}</span>
            </div>
            <div class="intro-content" v-html="item.content"></div>
          </el-card>
        </div>
      </div>
    </template>
  </layout>
</template>

<script>
import Layout from '@/components/layout/layout.vue'
import { listSelfIntro } from '@/api/profile'
import languageRefresh from '@/mixins/languageRefresh' // 新增: 引入语言刷新混入

export default {
  name: 'HomeView',

  components: {
    Layout,
  },
  mixins: [languageRefresh], // 新增: 应用语言刷新混入

  data() {
    return {
      refreshMethodName: 'fetchSelfIntro', // 步骤3: 指定刷新方法名称（可选）
      introList: [], // 简介列表数据
      loading: false, // 加载状态
      error: '', // 错误信息
    }
  },

  /**
   * 在组件创建时获取数据
   * Vue2生命周期最佳实践：created比mounted更早调用，提前请求数据
   */
  created() {
    this.fetchSelfIntro()
  },

  methods: {
    /**
     * 获取个人简介数据
     * @returns {Promise<void>}
     */
    async fetchSelfIntro() {
      this.loading = true
      this.error = ''

      try {
        // 调用API获取数据，传入空对象表示无需额外参数
        const res = await listSelfIntro({})

        // 检查API返回是否成功
        if (res && res.errorCode === 0 && res.data) {
          // 不需要分页，直接获取列表数据
          this.introList = res.data.selfIntroList || []
        } else {
          this.error = res.errorMsg || '获取数据失败'
        }
      } catch (error) {
        console.error('获取简介数据异常:', error)
        this.error = '网络异常，请稍后重试'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.self-intro-container {
  padding: 20px;
  margin: 0 auto; // 步骤2: 居中显示

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
  }

  .intro-list {
    // 步骤3: 修改为flex布局，确保每行只有一个item
    display: flex;
    flex-direction: column;
    gap: 24px; // 增加间距提升层次感

    .intro-item {
      width: 100%;
      border: none; // 步骤5: 移除默认边框
      border-radius: 30px;
      box-shadow: 0 4px 12px rgb(0 0 0 / 5%); // 步骤6: 优化阴影效果
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 10px 20px rgb(0 0 0 / 10%);
        transform: translateY(-5px);
      }

      .intro-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px; // 步骤7: 增加内边距
        border-bottom: 1px solid #f0f0f0;

        .intro-title {
          position: relative;
          padding-left: 12px;
          font-size: 18px; // 步骤8: 增大标题字号
          font-weight: 600;
          color: var(--theme-color);

          // 步骤9: 添加装饰线增强视觉层次
          &::before {
            position: absolute;
            top: 50%;
            left: 0;
            width: 4px;
            height: 18px;
            content: '';
            background-color: var(--theme-color);
            border-radius: 2px;
            transform: translateY(-50%);
          }
        }
      }

      .intro-content {
        padding: 20px; // 步骤10: 优化内容区域内边距
        line-height: 1.8; // 步骤11: 增加行高提升可读性

        ::v-deep(img) {
          max-width: 100%;
          height: auto;
          margin: 12px 0; // 步骤13: 图片上下增加间距
          border-radius: 4px; // 步骤12: 图片增加圆角
        }

        ::v-deep(p) {
          margin-bottom: 16px; // 步骤14: 增加段落间距
          color: #333; // 步骤15: 优化文字颜色
        }

        // 步骤16: 优化列表样式
        ::v-deep(ul, ol) {
          padding-left: 20px;
          margin-bottom: 16px;
        }

        ::v-deep(li) {
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
