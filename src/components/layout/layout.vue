<template>
  <div class="main-container" :style="containerStyle">
    <div class="layout-wrapper">
      <Breadcrumb v-if="showBreadcrumb" />

      <!-- 文本框插槽 -->
      <div class="input-container">
        <!-- 标题区域（可选） -->
        <div v-if="title" class="page-title">
          <h1>{{ title }}</h1>
        </div>
        <!-- 主要内容区域 -->
        <div class="scrollable-content">
          <slot name="content"></slot>
        </div>

        <!-- 按钮区域（可选） -->
        <div v-if="$slots.button" class="button-container">
          <slot name="button"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  props: {
    backgroundImage: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    showBreadcrumb: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    containerStyle() {
      if (!this.backgroundImage) return {}

      return {
        backgroundImage: `url(${this.backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
        backgroundSize: 'cover',
      }
    },
  },
}
</script>
<style lang="scss" scoped>
/* 定义变量 */
$title-color: #dbcca9;
$input-border-color: #ccc;
$input-focus-border: #dbcca9;

/* 核心改造点：边距系统重构 */
.main-container {
  /* 基础容器设置 */
  position: relative;
  // min-height: 100vh;
  overflow: hidden;

  /* 新增适配层 */
  .layout-wrapper {
    width: 100%; /* 步骤1: 改为响应式宽度 */
    max-width: 1200px; /* 步骤2: 限制最大宽度，保持页面美观 */
    padding: 30px 0; /* 步骤3: 添加顶部内边距，与sidebar保持一致 */
    margin: 0 auto; /* 步骤4: 水平居中显示 */

    /* 添加媒体查询 */
    @media screen and (max-width: 1200px) {
      padding: 30px 15px; /* 小屏幕增加水平内边距，同时保持顶部内边距 */
    }

    /* 文本框容器样式 */
    .input-container {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 80vh;
      padding: 20px;
      background-color: #fff;
      // border: 1px solid $input-border-color;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgb(0 0 0 / 10%);

      /* 滚动区域样式 */
      .scrollable-content {
        // height: 70vh;
        overflow: scroll;
        overflow-y: auto; /* 垂直方向滚动 */
        scrollbar-width: none; /* 隐藏 Firefox 滚动条 */
        -ms-overflow-style: none; /* 隐藏 IE 滚动条 */

        /* 隐藏 Chrome 滚动条 */
        &::-webkit-scrollbar {
          display: none;
        }

        /* 标题样式 */

        /* 标题样式同步 */
        h1 {
          width: 252px; // 与visitBook标题同宽
          height: 61px;
          // margin-left: 32px; // 左侧间距同步
          font-size: 36px;
          font-weight: 900;
          line-height: 60px;
          color: white;
          text-align: center;
          background-color: rgb(175 33 37);

          // border-radius: 10px;
        }

        /* 文本说明样式 */
        p {
          margin-bottom: 20px;
          font-size: 1em;
          line-height: 1.5;
          color: #666;
        }

        /* 预约须知标题样式 */
        .notice-title {
          margin-bottom: 10px;
          font-size: 1.2em;
          font-weight: bold;
          text-align: center !important;
        }

        /* 表单标题样式 */
        .form-title {
          margin-bottom: 10px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
        }

        /* 表单项容器样式 */
        .form-items {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* 表单元素样式 */
        .form-class {
          width: 100%;

          .el-form-item {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;

            .el-form-item__content {
              width: 300px; /* 统一设置输入控件的宽度 */
            }
          }
        }

        /* 输入框样式 */
        input,
        select,
        .el-input,
        .el-select,
        .el-input-number {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid $input-border-color;
          border-radius: 5px;
          outline: none;
          transition: border-color 0.3s;

          &:focus {
            border-color: $input-focus-border;
            box-shadow: 0 0 5px rgb(0 0 0 / 20%);
          }
        }
      }

      /* 按钮容器样式 */
      .button-container {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        padding-top: 10px;

        button {
          padding: 8px 15px;
          font-size: 16px;
          color: #fff;
          cursor: pointer;
          background-color: rgb(175 33 37);
          border: 1px solid #ccc; /* 设置按钮灰色边框 */
          border-radius: 5px;
          transition: background-color 0.3s;

          &:hover {
            background-color: #c5b28b;
          }

          &:active {
            background-color: #b09976;
          }

          &:focus {
            outline: none;
          }
        }
      }

      /* 按钮组样式 */
      .button-group {
        display: flex;
        gap: 10px;

        /* 取消按钮样式 */
        .custom-circle-cancel-button {
          justify-self: center;
          margin-right: 6px;
          color: black !important;
          background-color: rgb(255 255 255) !important;
        }
      }
    }
  }
}
</style>
