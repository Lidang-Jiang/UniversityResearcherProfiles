import { asyncRoutes } from './asyncRoutes'

const Layout = () => import('@/components/layout/index.vue')
const generateRoutes = (list) => {
  const ret = []
  const genericRoute = {
    path: '/news',
    component: Layout,
    children: [],
  }
  list.forEach((item) => {
    item.columnManageListVOS.forEach((subItem) => {
      if (subItem.contentMaintenance === 5) {
        let component
        switch (item.id) {
          case '5':
            component = () => import('@/views/interaction.vue')
            break
          default:
            component = () => import('@/views/generic.vue')
            break
        }
        genericRoute.children.push({
          path: subItem.id,
          component,
          meta: {
            title: subItem.columnsName,
            columnName: item.columnsName,
            columnId: item.id,
            categoryId: subItem.id,
          },
        })
      }
    })
    // 非资讯模块的路由
    if (item.routeName) {
      const route = asyncRoutes.find((r) => r.path === item.routeName)
      route.meta.columnId = item.id
      route.children = route.children
        .map((child) => {
          const childRoute = item.columnManageListVOS.find(
            (i) => i.routeName && i.routeName.replace(/^\//, '') === child.path,
          )
          if (!childRoute || childRoute.contentMaintenance === 5) return
          return {
            ...child,
            meta: {
              ...child.meta,
              title: childRoute.columnsName,
              columnName: item.columnsName,
              columnId: item.id,
              categoryId: childRoute.id,
            },
          }
        })
        .filter((i) => i)
      ret.push(route)
    }
  })
  ret.push(genericRoute)
  ret.push({
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: () => import('@/views/404.vue'),
  })
  return ret
}

export default generateRoutes
