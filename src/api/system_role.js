import request_cong from '@/utils/request_ai.js'

/* 
**
**权限管理相关接口
**
 */

//用户查询/demo
export function role_search(data) {
  return request_cong.get('/api/v1/admin/userRole/search/', data)
}

//后台用户角色新增/修改/demo
export function role_operate(data) {
  return request_cong.post('/api/v1/admin/userRole/operate/', data)
}

//后台用户角色新增/修改/demo
export function role_del(data) {
  return request_cong.get('/api/v1/admin/userRole/operate/'+ data)
}

