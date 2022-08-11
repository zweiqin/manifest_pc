import request from '@/utils/request.js'

/*
 **
 **员工相关接口
 **
 */

// 登录/demo
export function Login(data) {
  return request.post('/v1/Login', data, { login: false })
}

// 用户查询/demo
export function AdminSearch(data) {
  return request.get('/v1/admin/GetAdminList', data)
}

// 新增/修改用户/删除/修改密码/demo
export function OperateAdmin(data) {
  return request.post('/v1/admin/OperateAdmin', data)
}

// 查询某个用户的详情/demo
export function GetUserInfo(data) {
  return request.get('/v1/admin/GetUserInfo', data)
}
