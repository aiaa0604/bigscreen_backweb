import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: 'api/stat/outbound-ip',
      method: 'get',
      params
    })
  },
  getById(id) {
    return request({
      url: `api/stat/outbound-ip/${id}`,
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: 'api/stat/outbound-ip',
      method: 'post',
      data
    })
  },
  edit(data) {
    return request({
      url: `api/stat/outbound-ip/${data.id}`,
      method: 'put',
      data
    })
  },
  del(ids) {
    return request({
      url: 'api/stat/outbound-ip',
      method: 'delete',
      data: ids
    })
  },
  batchDel(ids) {
    return request({
      url: 'api/stat/outbound-ip',
      method: 'delete',
      data: ids
    })
  }
} 