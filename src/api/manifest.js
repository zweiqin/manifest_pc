import request from '@/utils/request.js'

/*
 **
 **manifest相关接口
 **
 */

// 生成货单
export function CreateManifest(data) {
	return request.post('/v1/manifest/CreateManifest', data, { login: false })
}

// 获取货单列表
export function GetManifestList(data) {
	return request.get('/v1/manifest/GetManifestList', data, { login: false })
}

// 获取货单生成的采购单列表
export function GetPurchaseList(data) {
	return request.get('/v1/purchase/GetPurchaseList', data, { login: false })
}

// 提交审批
export function ChangeManifestStatus(data) {
	return request.put('/v1/manifest/ChangeManifestStatus', data, { login: false })
}

// 更改货单数量
export function UpdateManifestNum(data) {
	return request.put('/v1/product/UpdateManifestNum', data, { login: false })
}
