/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const admin = {
  // 菜单管理
  path: '/menu',
  component: Layout,
  redirect: '/menu/index',
  name: '菜单',
  meta: {
    title: '菜单', icon: 'el-icon-menu'
  },
  children: [
    {
      path: '/menu/index',
      component: () => import('@/views/menu/index'),
      name: '菜单管理',
      meta: { title: '菜单管理' }
    },
    {
      path: '/admin/role',
      component: () => import('@/views/role/index'),
      name: '权限管理',
      meta: { title: '权限管理' }
    },
  ]
}
  


export default admin