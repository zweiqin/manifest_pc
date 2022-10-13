/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const company_wx = {
  // 企业微信管理
  path: '/company-wx',
  component: Layout,
  redirect: '/company-wx/list',
  name: '企业微信管理',
  meta: {
    title: '企业微信管理',
    icon: 'el-icon-s-custom'
  },
  children: [
    {
      path: '/company-wx/list',
      component: () => import('@/views/company-wx/list'),
      name: '企业微信列表',
      meta: { title: '企业微信列表' }
    },
    {
      path: '/company-wx/setting',
      component: () => import('@/views/company-wx/setting'),
      name: '推送参数设置',
      meta: { title: '推送参数设置' }
    }
  ]
}

export default company_wx
