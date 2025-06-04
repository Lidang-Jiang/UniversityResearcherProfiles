<template>
  <div class="breadcrumb-wrap">
    <!-- <svg-icon icon-class="position" class-name="icon-position"></svg-icon> -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in list"
        :key="index"
        :to="index === lastIndex || (!index && item.link !== '/') ? '' : item.link"
        >{{ item.title }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    columnList: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {}
  },
  computed: {
    list() {
      const { matched } = this.$route
      let ret = []
      matched.forEach((item) => {
        if (item?.meta?.activeNav) {
          ret.push({
            title: item?.meta?.activeNavTitle,
            link: item?.meta?.activeNav,
          })
        }
        if (item?.path) {
          ret.push({
            title: item?.meta?.title,
            link: item?.path,
          })
        }
      })
      // console.log(ret)
      return ret
    },
    lastIndex() {
      return this.list.length - 1
    },
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.breadcrumb-wrap {
  @include flexLayout(center);

  height: 68px;
  padding: 0 8px;
}

.icon-position {
  @include setSize(20px);

  margin-right: 12px;
}

.breadcrumb {
  font-size: 14px;
  line-height: 20px;

  :deep(.el-breadcrumb__item):not(:last-child) {
    .el-breadcrumb__inner {
      font-weight: normal;

      &.is-link {
        color: var(--color-black);
      }
    }
  }

  :deep(.el-breadcrumb__item):last-child .el-breadcrumb__inner {
    color: var(--theme-color);
  }

  :deep(.el-breadcrumb__separator) {
    color: var(--color-black);
  }
}
</style>
