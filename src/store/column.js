import { defineStore } from 'pinia'
export const useColumnStore = defineStore({
  id: 'column',
  state: () => ({
    columnLoaded: false,
    columnList: [], // 显示
    allColumnList: [], // 全部
  }),
  actions: {
    setColumnList(columnList) {
      columnList.forEach((column) => {
        if (column.columnManageListVOS.length > 0) {
          column.columnManageListVOS.forEach((child) => {
            if (child.contentMaintenance === 5) {
              child.url = `/news/${child.id}`
            } else {
              child.url = column.routeName + child.routeName
            }
          })
        }
      })
      this.columnList = columnList
    },
    setAllColumnList(columnList) {
      columnList.forEach((column) => {
        if (column.columnManageListVOS.length > 0) {
          column.columnManageListVOS.forEach((child) => {
            if (child.contentMaintenance === 5) {
              child.url = `/news/${child.id}`
            } else {
              child.url = column.routeName + child.routeName
            }
          })
        }
      })
      this.allColumnList = columnList
    },
  },
})
