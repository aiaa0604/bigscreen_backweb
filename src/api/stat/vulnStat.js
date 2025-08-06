import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: 'api/stat/vuln-stat',
      method: 'get',
      params
    })
  },
  getById(id) {
    return request({
      url: `api/stat/vuln-stat/${id}`,
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: 'api/stat/vuln-stat',
      method: 'post',
      data
    })
  },
  edit(data) {
    return request({
      url: `api/stat/vuln-stat/${data.id}`,
      method: 'put',
      data
    })
  },
  del(ids) {
    return request({
      url: 'api/stat/vuln-stat',
      method: 'delete',
      data: ids
    })
  },
  batchDel(ids) {
    return request({
      url: 'api/stat/vuln-stat',
      method: 'delete',
      data: ids
    })
  }
} 