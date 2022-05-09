import request_cong from '@/utils/request_ai.js'

/* 
**
**员工分组相关接口(预留，基础版没有此模块，后续有需要再做接口地址修改)
**
 */

//用户组查询/demo
export function group_search(data) {
  return request_cong.get('administrator/user/group/search', data)
}

//用户组修改/demo
export function group_update(data) {
  return request_cong.post('administrator/user/group/update', data)
}

//用户组新增/demo
export function group_create(data) {
  return request_cong.post('administrator/user/group/create', data)
}
