import request from '@/utils/request.js'

/*
 **
 **商城上架相关接口
 **
 */

// 获取产品列表
export function GetProductList(data) {
	return request.get('/v1/product/GetProductList', data)
}

