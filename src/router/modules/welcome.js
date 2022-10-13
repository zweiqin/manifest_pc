/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const welcome = {
  // 欢迎页
  path: '/welcome',
  component: Layout,
  name: '欢迎页',
  meta: {
    title: '欢迎页',
    icon: 'el-icon-s-custom'
  },
  children: [
    {
      path: '/welcome/index',
      component: () => import('@/views/welcome/index'),
      name: '欢迎页',
      meta: { title: '欢迎页' }
    }
  ]
}

export default welcome
