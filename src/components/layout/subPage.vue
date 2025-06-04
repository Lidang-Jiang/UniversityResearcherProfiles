<template>
  <div class="sub-page">
    <breadcrumb :column-list="allColumnList" />
    <div class="container">
      <keep-alive v-if="showMenu">
        <div ref="menu$" class="menu">
          <div class="menu__top">
            <div>{{ subPageTitle }}</div>
          </div>
          <ul>
            <router-link v-for="item in leftMenu" :key="item.id" v-slot="{ navigate }" :to="item.url" custom>
              <li class="menu__item" :class="{ 'is-active': subColumnId === item.id }" @click="navigate">
                {{ item.columnsName }}
              </li>
            </router-link>
          </ul>
        </div>
      </keep-alive>
      <div class="main">
        <slot name="main-header"></slot>
        <div class="content">
          <slot></slot>
        </div>
        <slot name="main-footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useColumnStore } from '@/store'
import Breadcrumb from '../Breadcrumb.vue'
import { columnVisit } from '@/api/data'

export default {
  components: { Breadcrumb },
  data() {
    return {
      visitTime: 0,
    }
  },
  computed: {
    ...mapState(useColumnStore, ['allColumnList', 'columnList']),
    subPageTitle() {
      const { matched, meta } = this.$route
      if (meta.article) {
        const column = this.getColumn()
        return column ? column.columnsName : ''
      }
      return matched[0]?.meta?.title ?? meta?.columnName
    },
    subColumnId() {
      const column = this.getColumn()
      const subColumn = this.getSubColumn()
      return subColumn ? subColumn.id : column ? column.columnManageListVOS[0].id : ''
    },
    leftMenu() {
      const column = this.getColumn()
      return column ? column.columnManageListVOS.filter((o) => o.isShow || o.isHome) : []
    },
    showMenu() {
      if (this.$route.query.showMenu === 'false') {
        return false
      } else {
        return true
      }
    },
  },
  mounted() {
    this.visitTime = Date.now()
  },
  beforeDestroy() {
    columnVisit({
      categoryId: this.$route.meta.categoryId ?? this.subColumnId,
      stayTime: new Date(Date.now() - this.visitTime).getSeconds(),
    })
      .then(() => {})
      .catch(() => {})
  },
  methods: {
    getColumn() {
      const { matched, meta, query } = this.$route
      const columnId = meta.article ? query.column_id : matched[0].meta.columnId ?? meta.columnId
      return this.allColumnList.find((nav) => nav.id === columnId)
    },
    getSubColumn() {
      const { matched, meta, query } = this.$route
      const column = this.getColumn()
      if (column && column.columnManageListVOS.length > 0) {
        const subColumnId = meta.article
          ? query.category_id
          : meta.categoryId ?? matched[matched.length - 1].meta.categoryId
        return column.columnManageListVOS.find((c) => subColumnId === c.id)
      }
      return null
    },
  },
}
</script>
<style lang="scss" scoped>
.sub-page {
  width: 100%;
  width: 1240px;
  padding: 0 20px;
  margin: 0 auto 24px;
  background: var(--subpage-bg);
}

.container {
  @include flexLayout();

  position: relative;
  padding-bottom: 86px;
}

.menu {
  position: sticky;
  top: 16px;
  flex: none;
  width: 199px;
  padding: 8px;
  margin-right: 20px;
  background: #fff;
  border-radius: 10px;
  transition: transform 500ms;
  transform: translateZ(0);

  &__top {
    position: relative;
    display: flex;
    align-items: center;
    padding: 32px 0;
    overflow: hidden;
    background-image: var(--subpage-menu-bg-image);
    border-radius: 8px;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 177px;
      height: 94px;
      content: '';
      background: var(--subpage-menu-deco);
    }

    div {
      position: relative;
      z-index: 2;
      width: 100%;
      font-size: 22px;
      font-weight: bold;
      line-height: 30px;
      color: #fff;
      text-align: center;
    }
  }

  &__item {
    padding: 12px;
    margin: 4px 0;
    font-size: 16px;
    line-height: 22px;
    color: var(--color-black);
    cursor: pointer;
    border-radius: 8px;

    &:first-child {
      margin-top: 8px;
    }

    &:hover,
    &.is-active {
      color: #fff;
      background-color: var(--theme-color);
    }

    @include flexLayout(center, center);
  }
}

:root.red {
  .menu__top::before {
    top: -94px;
    left: -74px;
    width: 199px;
    height: 293px;
  }
}

.main {
  flex: 1 1 100%;
  overflow: hidden;
  border-radius: 10px;
}

.content {
  padding: 24px;
  overflow: hidden;
  background: #fff;
}
</style>
