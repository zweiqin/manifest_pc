/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const shop = {
  // 商城管理
  path: '/shop',
  component: Layout,
  redirect: '/shop/listed',
  name: '商城管理',
  meta: {
    title: '商城管理',
    icon: 'el-icon-s-custom'
  },
  children: [
    {
      path: '/shop/listed',
      component: () => import('@/views/shop/listed'),
      name: '上架管理',
      meta: { title: '上架管理' }
    }
  ]
}

export default shop
