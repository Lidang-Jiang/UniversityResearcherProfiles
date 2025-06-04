<template>
  <div class="pagination-wrapper">
    <!-- 使用 Element UI 提供的国际化功能，不再硬编码中文 -->
    <el-pagination
      :current-page.sync="pageValue"
      :page-size.sync="sizeValue"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      :prev-text="prevText"
      :next-text="nextText"
      :hide-on-single-page="hideOnSinglePage"
      class="pagination"
      v-on="$listeners"
    >
      <span class="jump-title">{{ t('pagination.jumpTo') }}</span>
      <el-input v-model.number="jumpPage" class="jump-input" @change="confirmInput" />
      <span class="count-suffix">{{ t('pagination.page') }}</span>
    </el-pagination>
  </div>
</template>

<script>
// 引入国际化工具函数
import { t } from '@/locales/index'

export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: [Number, String],
      default: 10,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100]
      },
    },
    prevText: String,
    nextText: String,
    total: {
      type: [Number, String],
      default: 0,
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, slot',
    },
    hideOnSinglePage: Boolean,
  },
  data() {
    return {
      jumpPage: '',
    }
  },
  computed: {
    pageValue: {
      get() {
        return this.currentPage
      },
      set(val) {
        this.$emit('update:currentPage', val)
      },
    },
    sizeValue: {
      get() {
        return this.pageSize
      },
      set(val) {
        this.$emit('update:pageSize', val)
      },
    },
    internalPageCount() {
      return Math.max(1, Math.ceil(this.total / this.pageSize))
    },
  },
  methods: {
    // 暴露国际化函数给模板
    t,

    getValidCurrentPage(value) {
      value = parseInt(value, 10)
      const havePageCount = typeof this.internalPageCount === 'number'
      let resetValue

      if (!havePageCount) {
        if (isNaN(value) || value < 1) resetValue = 1
      } else {
        if (value < 1) {
          resetValue = 1
        } else if (value > this.internalPageCount) {
          resetValue = this.internalPageCount
        }
      }

      if (resetValue === undefined && isNaN(value)) {
        resetValue = 1
      } else if (resetValue === 0) {
        resetValue = 1
      }

      return resetValue === undefined ? value : resetValue
    },
    confirmInput() {
      let number = this.getValidCurrentPage(this.jumpPage)
      this.pageValue = number
      this.jumpPage = number
      this.$emit('current-change', number)
    },
  },
}
</script>

<style lang="scss" scoped>
$paginationItemSize: 33px;

.pagination {
  @include flexLayout(center, flex-end);

  font-weight: normal;

  :deep(.btn-prev),
  :deep(.btn-next) {
    min-width: 32px;
    padding: 6px;
    color: var(--color-black);
    border: 1px solid var(--border-color);
    border-radius: 4px;

    &:not(:disabled) {
      background-color: #fff;
    }
  }

  :deep(.el-pager) li {
    min-width: 32px;
    margin: 0 5px;
    border: 1px solid var(--border-color);
    border-radius: 4px;

    &:hover,
    &.active {
      color: #fff;
      background-color: var(--theme-color);
      border-color: var(--theme-color);
    }
  }

  :deep(.el-select) {
    .el-input__inner {
      height: 32px;
    }

    .el-input {
      line-height: 0;

      .el-select__caret {
        color: var(--color-black);
      }

      .el-icon-arrow-up::before {
        content: '\e78f';
      }
    }
  }
}

.jump-title {
  margin-right: 4px;
  margin-left: 12px;
  color: var(--color-black);
}

.count-suffix {
  margin-left: 4px;
  font-size: 14px;
  color: var(--color-black);
}

.jump-input {
  width: 50px;
  font-size: 14px;
  color: var(--color-black);
  text-align: center;

  &:focus {
    outline: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
  }
}
</style>
