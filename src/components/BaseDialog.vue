<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :visible.sync="dialogVisible"
    :width="width"
    :title="title"
    :append-to-body="appendToBody"
    :custom-class="dialogClass"
    :show-close="showClose"
    :top="top"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template slot="title">
      <slot name="title"></slot>
    </template>
    <slot></slot>
    <template slot="footer">
      <div v-if="showFooter" :class="{ 'base-dialog__center-footer': centerFooter }">
        <slot name="footer">
          <el-button class="base-dialog__btn" @click="handleCancel">取消</el-button>
          <el-button
            type="primary"
            :disabled="disabled"
            :loading="disabled"
            class="base-dialog__btn"
            @click="handleConfirm"
            >确认</el-button
          >
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash.debounce'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '472px',
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    top: {
      type: String,
      default: '10vh',
    },
    centerFooter: Boolean,
    height: String,
    title: String,
    customClass: String,
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      },
    },
    dialogClass() {
      return `${this.customClass}${this.title ? '' : ' base-dialog--hide-title'}`
    },
  },
  created() {
    this.handleConfirm = debounce(() => {
      this.$emit('confirm')
    }, 500)
  },
  methods: {
    handleCancel() {
      this.dialogVisible = false
      this.$emit('cancel')
    },
  },
}
</script>
<style lang="scss">
.base-dialog--hide-title {
  .el-dialog__header {
    display: none;
  }
}

.base-dialog {
  &__center-footer {
    text-align: center;
  }

  &__btn {
    + .base-dialog__btn {
      margin-left: 16px;
    }

    padding-right: 30px;
    padding-left: 30px;
  }
}
</style>
