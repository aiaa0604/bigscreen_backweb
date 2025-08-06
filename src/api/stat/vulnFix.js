import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: 'api/stat/vuln-fix',
      method: 'get',
      params
    })
  },
  getById(id) {
    return request({
      url: `api/stat/vuln-fix/${id}`,
      method: 'get'
    })
  },
  add(data) {
    return request({
      url: 'api/stat/vuln-fix',
      method: 'post',
      data
    })
  },
  edit(data) {
    return request({
      url: `api/stat/vuln-fix/${data.id}`,
      method: 'put',
      data
    })
  },
  del(ids) {
    return request({
      url: 'api/stat/vuln-fix',
      method: 'delete',
      data: ids
    })
  },
  batchDel(ids) {
    return request({
      url: 'api/stat/vuln-fix',
      method: 'delete',
      data: ids
    })
  }
} 