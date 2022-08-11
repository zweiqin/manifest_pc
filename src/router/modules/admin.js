/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const admin = {
  // 员工
  path: '/admin',
  component: Layout,
  redirect: '/admin/power/index',
  name: '员工',
  meta: {
    title: '员工',
    icon: 'el-icon-s-custom'
  },
  children: [
    {
      path: '/admin/power',
      component: () => import('@/views/admin/power'),
      name: '员工权限',
      meta: { title: '员工权限' }
    },
    {
      path: '/admin/info',
      component: () => import('@/views/admin/info'),
      name: '员工信息',
      meta: { title: '员工信息' }
    }
  ]
}

export default admin
