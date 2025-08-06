import request from '@/utils/request'

export default {
  // 创建资产
  add(data) {
    return request({
      url: 'api/stat/asset-list',
      method: 'post',
      data
    })
  },

  // 更新资产
  edit(data) {
    return request({
      url: 'api/stat/asset-list/' + data.id,
      method: 'put',
      data
    })
  },

  // 删除资产
  del(ids) {
    const data = ids.length > 1 ? ids : ids[0]
    return request({
      url: 'api/stat/asset-list/' + data,
      method: 'delete'
    })
  },

  // 批量删除资产
  delAll(ids) {
    return request({
      url: 'api/stat/asset-list',
      method: 'delete',
      data: ids
    })
  },

  // 根据ID获取资产
  get(id) {
    return request({
      url: 'api/stat/asset-list/' + id,
      method: 'get'
    })
  },

  // 根据IP和端口获取资产
  getByIpPort(assetIp, assetPort) {
    return request({
      url: 'api/stat/asset-list/ip-port',
      method: 'get',
      params: { assetIp, assetPort }
    })
  },

  // 分页查询资产列表
  getList(params) {
    return request({
      url: 'api/stat/asset-list',
      method: 'get',
      params
    })
  },

  // 获取所有资产列表
  getAll() {
    return request({
      url: 'api/stat/asset-list/all',
      method: 'get'
    })
  },

  // 根据条件查询资产列表
  search(params) {
    return request({
      url: 'api/stat/asset-list/search',
      method: 'get',
      params
    })
  },

  // 统计资产总数
  getCount() {
    return request({
      url: 'api/stat/asset-list/count',
      method: 'get'
    })
  },

  // 检查IP和端口组合是否存在
  exists(assetIp, assetPort) {
    return request({
      url: 'api/stat/asset-list/exists',
      method: 'get',
      params: { assetIp, assetPort }
    })
  },

  // 导出资产列表
  download() {
    return request({
      url: 'api/stat/asset-list/download',
      method: 'get',
      responseType: 'blob'
    })
  }
}