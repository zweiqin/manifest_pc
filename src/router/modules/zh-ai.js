/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const zhAi = {
  path: '/',
  component: Layout,
  redirect: '/admin/power',
  name: '员工管理',
  meta: {
    title: '员工管理', icon: 'el-icon-document-copy'
  }
}

export default zhAi
