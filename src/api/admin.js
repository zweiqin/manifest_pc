import request_cong from '@/utils/request_ai.js'

/* 
**
**员工相关接口
**
 */

//登录/demo
export function admin_login(data) {
  return request_cong.post('/api/v1/admin/user/login/', data, { login: false })
}

//用户查询/demo
export function admin_search(data) {
  return request_cong.get('/api/v1/admin/user/', data)
}
//修改密码/demo
export function pwd_update(data) {
  return request_cong.put('/api/v1/admin/user/', data)
}
//删除用户/demo
export function admin_del(data) {
  return request_cong.post('/api/v1/admin/enabled/',data)
}

//新增用户/demo
export function admin_create(data) {
  return request_cong.post('/api/v1/admin/user/', data)
}

//查询某个用户的详情/demo
export function admin_details(data) {
  return request_cong.get('/api/v1/admin/user/'+data)
}

//考勤汇总列表查询/demo
export function get_admin_work_count(data) {
  return request_cong.get('/administrator/adminWorkTime/summary/', data)
}

//下载考勤汇总/demo
export function download_admin_work(data) {
  return request_cong.post('/administrator/adminWorkTime/summary/', data)
}

/* 
**员工状态
**
 */
//查询员工状态列表/demo
export function get_state(data) {
  return request_cong.get('/api/v1/admin/state/')
}

//新增/修改状态/demo
export function add_state(data) {
  return request_cong.post('/api/v1/admin/state/', data)
}

//后台用户状态设置/demo
export function set_state(data) {
  return request_cong.post('/api/v1/admin/User/state/setUp/', data)
}


//删除后台用户状态/demo
export function del_state(data) {
  return request_cong.delete(`/api/v1/admin/state/${data}`)
}