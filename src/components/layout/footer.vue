<template>
  <footer class="footer">
    <div class="footer__container">
      <!-- 步骤1：简化版权信息区域 -->
      <div class="footer__copyright">
        <p>© {{ currentYear }} {{ authorName }} - All Rights Reserved</p>
        <p v-if="contactEmail" class="footer__contact">
          <span
            >Please contact <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a> with comments, questions, or
            suggestions.</span
          >
        </p>

        <!-- 步骤2：可选的社交媒体链接 (保持极简) -->
        <div v-if="showSocialLinks" class="footer__social">
          <a
            v-for="(link, index) in socialLinks"
            :key="index"
            :href="link.url"
            :title="link.name"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
          >
            <i :class="link.icon"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
/**
 * 个人学术网站页脚组件
 * @description 显示个人网站版权信息和必要联系方式
 * @author Lidang Jiang
 * @version 2.0.0
 */
export default {
  name: 'AppFooter',
  props: {
    // 步骤3：使用props让父组件可以自定义内容
    showSocialLinks: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 步骤4：个人信息配置
      authorName: 'Ge He', // 个人或研究组名称
      contactEmail: 'hege@scu.edu.cn', // 联系邮箱

      // 步骤5：社交媒体链接(默认隐藏，可通过props开启)
      socialLinks: [
        { name: 'GitHub', icon: 'el-icon-s-custom', url: 'https://github.com/' },
        { name: 'Google Scholar', icon: 'el-icon-document', url: 'https://scholar.google.com/' },
      ],
    }
  },
  computed: {
    // 步骤6：动态计算当前年份
    currentYear() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style lang="scss" scoped>
/* 与header.vue保持一致的设计变量 */
$border-radius-sm: 4px;
$box-shadow-sm: 0 2px 5px rgb(0 0 0 / 7%);
$box-shadow-md: 0 2px 10px rgb(0 0 0 / 10%);
$transition-normal: all 0.3s ease;

/* 步骤7：简化的footer样式 */
.footer {
  position: relative;
  z-index: 10;
  width: 100%;
  margin-top: 40px;
  background: rgb(255 255 255 / 98%); /* 与header保持一致的背景色 */
  border-top: 1px solid rgb(0 0 0 / 8%); /* 保持微妙边框分隔 */
  box-shadow: 0 -2px 10px rgb(0 0 0 / 5%); /* 顶部阴影效果 */

  /* 硬件加速优化 */
  will-change: transform;
  transform: translateZ(0);

  &__container {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 1200px;
    padding: 20px;
    margin: 0 auto;

    @media (max-width: 768px) {
      padding: 15px;
    }
  }

  /* 步骤8：版权信息区样式 */
  &__copyright {
    width: 100%;
    font-size: 14px;
    color: #666;
    text-align: center;

    p {
      margin: 5px 0;
    }
  }

  /* 步骤9：联系邮箱样式 */
  &__contact {
    font-size: 13px;

    a {
      color: #555;
      text-decoration: none;
      transition: $transition-normal;

      &:hover {
        color: #333;
        text-decoration: underline;
      }
    }
  }

  /* 步骤10：极简社交媒体链接 */
  &__social {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 12px;

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      color: #666;
      background: rgb(0 0 0 / 3%);
      border-radius: 50%;
      transition: $transition-normal;

      &:hover {
        color: #333;
        background: rgb(0 0 0 / 7%);
        transform: translateY(-2px);
      }

      i {
        font-size: 16px;
      }
    }
  }
}
</style>
