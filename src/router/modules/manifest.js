/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const manifest = {
  // 货单管理
  path: '/manifest',
  component: Layout,
  redirect: '/manifest/index',
  name: '货单管理',
  meta: {
    title: '货单管理',
    icon: 'el-icon-s-custom'
  },
  children: [
    {
      path: '/manifest/index',
      component: () => import('@/views/manifest/index'),
      name: '货单管理',
      meta: { title: '货单管理' }
    },
    {
      path: '/manifest/goods',
      component: () => import('@/views/manifest/goods'),
      name: '货单生成',
      meta: { title: '货单生成' }
    },
    {
      path: '/manifest/approval',
      component: () => import('@/views/manifest/approval'),
      name: '货单审批',
      meta: { title: '货单审批' }
    },
    {
      path: '/manifest/order',
      component: () => import('@/views/manifest/order'),
      name: '订单管理',
      meta: { title: '订单管理' }
    }
  ]
}

export default manifest
