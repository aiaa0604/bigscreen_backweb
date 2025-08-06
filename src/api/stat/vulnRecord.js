import request from '@/utils/request'

// 查询所有漏洞记录
export function getList(params) {
  return request({
    url: 'api/stat/vuln-record',
    method: 'get',
    params
  })
}

// 根据ID查询漏洞记录
export function getById(id) {
  return request({
    url: `api/stat/vuln-record/${id}`,
    method: 'get'
  })
}

// 创建漏洞记录
export function add(data) {
  return request({
    url: 'api/stat/vuln-record',
    method: 'post',
    data
  })
}

// 更新漏洞记录
export function edit(data) {
  return request({
    url: `api/stat/vuln-record/${data.id}`,
    method: 'put',
    data
  })
}

// 删除单个漏洞记录
export function del(id) {
  return request({
    url: `api/stat/vuln-record/${id}`,
    method: 'delete'
  })
}

// 批量删除漏洞记录
export function batchDel(ids) {
  return request({
    url: 'api/stat/vuln-record',
    method: 'delete',
    data: ids
  })
}

export default { getList, getById, add, edit, del, batchDel } 