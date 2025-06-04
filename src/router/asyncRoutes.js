const Layout = () => import('@/components/layout/index.vue')

// 根据栏目设置动态显示
export const asyncRoutes = [
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/introduce',
    children: [
      {
        path: 'introduce',
        component: () => import('@/views/introduce.vue'),
        meta: { title: '机构概况' },
      },
      {
        path: 'leaders',
        component: () => import('@/views/team.vue'),
        meta: { title: '领导介绍' },
      },
      {
        path: 'architecture',
        component: () => import('@/views/functionaldepartments.vue'),
        meta: { title: '机构架构' },
      },
    ],
    meta: { title: '机构介绍' },
  },
]
