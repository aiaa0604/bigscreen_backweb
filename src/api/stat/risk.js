import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: 'api/stat/risk',
      method: 'get',
      params
    })
  },
  getById(id) {
    return request({
      url: `api/stat/risk/${id}`,
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: 'api/stat/risk',
      method: 'post',
      data
    })
  },
  edit(data) {
    return request({
      url: `api/stat/risk/${data.id}`,
      method: 'put',
      data
    })
  },
  del(ids) {
    return request({
      url: 'api/stat/risk',
      method: 'delete',
      data: ids
    })
  },
  batchDel(ids) {
    return request({
      url: 'api/stat/risk',
      method: 'delete',
      data: ids
    })
  }
} 