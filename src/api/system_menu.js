import request from '@/utils/request.js'

/*
 **
 **菜单相关接口
 **
 */

// 最高权限角色PC/手机端菜单权限信息列表查询
export function GetMenuByType(data) {
  return request.get('/v1/menu/GetMenuByType', data)
}
