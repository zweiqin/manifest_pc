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

// 查询商户下的Dmc信息
export function GetDmcList(data) {
	return request.get('/v1/dmc/GetDmcList', data)
}

// 更新DMC信息,只可以更改名字和状态
export function UpdateDmc(data) {
	return request.put('/v1/dmc/UpdateDmc', data)
}

// 上传采购凭证
export function AddPhoto(data) {
	return request.put('/v1/purchase/AddPhoto', data)
}

// 上传采购凭证
export function PayPurchase(data) {
	return request.put('/v1/purchase/PayPurchase', data)
}

