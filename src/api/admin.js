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

/*
 **
 **供应商管理相关接口
 **
 */

// 新增修改供应商
export function OperateSupplier(data) {
	return request.post('/v1/supplier/OperateSupplier', data)
}

// 获取供应商列表
export function GetSupplierList(data) {
	return request.get('/v1/supplier/GetSupplierList', data)
}

// 获取供应商联系人列表
export function GetSupplierUserList(data) {
	return request.get('/v1/supplier/GetSupplierUserList', data)
}

// 新增更改供应商联系人
export function CreateSupplierUser(data) {
	return request.post('/v1/supplier/CreateSupplierUser', data)
}

/*
 **
 **团队管理相关接口
 **
 */

// 获取团队列表
export function GetTeamList(data) {
	return request.get('/v1/team/GetTeamList', data)
}

// 获取团队成员信息
// 用于权限控制
export function GetTeamUserInfo(data) {
	return request.get('/v1/team/GetTeamUserInfo', data)
}

// 新增修改团队
export function OperateTeam(data) {
	return request.post('/v1/team/OperateTeam', data)
}
