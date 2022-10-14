import request from '@/utils/request.js'

/*
 **
 **企业微信相关接口
 **
 */

// 获取所有用户列表
export function GetWxList(data) {
	return request.get('/v1/user/GetWxUserList', data)
}

// 重新拉取所有用户列表
export function PullNewList(data) {
	return request.get('/v1/user/UpdateUserList', data)
}

// 获取企业微信推送设置
export function GetConfig(data) {
	return request.get('/v1/config/GetConfig', data)
}

// 修改企业微信推送设置
export function UpdateConfig(data) {
	return request.put('/v1/config/UpdateConfig', data)
}

// 推送测试消息
export function SendTestMsg(data) {
	return request.get('/v1/push/SendTestMsg', data)
}
