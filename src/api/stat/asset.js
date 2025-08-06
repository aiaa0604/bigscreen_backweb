import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: 'api/stat/asset',
      method: 'get',
      params
    })
  },
  getById(id) {
    return request({
      url: `api/stat/asset/${id}`,
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: 'api/stat/asset',
      method: 'post',
      data
    })
  },
  edit(data) {
    return request({
      url: `api/stat/asset/${data.id}`,
      method: 'put',
      data
    })
  },
  del(ids) {
    return request({
      url: 'api/stat/asset',
      method: 'delete',
      data: ids
    })
  },
  batchDel(ids) {
    return request({
      url: 'api/stat/asset',
      method: 'delete',
      data: ids
    })
  }
} 