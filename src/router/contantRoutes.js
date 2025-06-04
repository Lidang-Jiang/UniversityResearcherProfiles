const Layout = () => import('@/components/layout/index.vue')

// 静态路由
export const contantRoutes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        name: 'Home',
        path: '',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' },
      },

      {
        path: '404',
        component: () => import('@/views/404.vue'),
      },
    ],
  },

  // 添加Publications路由
  {
    path: '/publications',
    component: Layout,
    meta: { title: 'Publications' },
    children: [
      {
        path: '',
        component: () => import('@/views/publications/index.vue'),
        meta: { title: 'Publications' },
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/publications/detail.vue'),
        meta: { title: 'Publication Detail', activeNav: '/publications' },
      },
    ],
  },

  // 添加Projects路由
  {
    path: '/projects',
    component: Layout,
    meta: { title: 'Projects' },
    children: [
      {
        path: '',
        component: () => import('@/views/projects/index.vue'),
        meta: { title: 'Projects' },
      },
    ],
  },

  // 添加News路由
  {
    path: '/news',
    component: Layout,
    meta: { title: 'News' },
    children: [
      {
        path: '',
        component: () => import('@/views/news/index.vue'),
        meta: { title: 'News' },
      },
    ],
  },
]
