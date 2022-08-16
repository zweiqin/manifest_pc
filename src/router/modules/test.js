/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const test = {
  // 测试页面
  path: '/test',
  component: Layout,
  redirect: '/test/father',
  name: '测试页面',
  meta: {
    title: '测试页面',
    icon: 'el-icon-s-custom'
  },
  children: [
    {
      path: '/test/father',
      component: () => import('@/views/test/father'),
      name: '测试父组件',
      meta: { title: '测试父组件' }
    },
    {
      path: '/test/children',
      component: () => import('@/views/test/children'),
      name: '测试子页面',
      meta: { title: '测试子页面' }
    }
  ]
}

export default test
