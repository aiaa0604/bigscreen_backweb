import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: 'api/stat/device',
      method: 'get',
      params
    })
  },
  getById(id) {
    return request({
      url: `api/stat/device/${id}`,
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: 'api/stat/device',
      method: 'post',
      data
    })
  },
  edit(data) {
    return request({
      url: `api/stat/device/${data.id}`,
      method: 'put',
      data
    })
  },
  del(ids) {
    return request({
      url: 'api/stat/device',
      method: 'delete',
      data: ids
    })
  },
  batchDel(ids) {
    return request({
      url: 'api/stat/device',
      method: 'delete',
      data: ids
    })
  }
} 