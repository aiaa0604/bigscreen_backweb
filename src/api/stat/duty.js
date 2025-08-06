import request from '@/utils/request'

// 查询所有值班记录
export function getList(params) {
  return request({
    url: 'api/stat/duty',
    method: 'get',
    params
  })
}

// 根据ID查询值班记录
export function getById(id) {
  return request({
    url: `api/stat/duty/${id}`,
    method: 'get'
  })
}

// 创建值班记录
export function add(data) {
  return request({
    url: 'api/stat/duty',
    method: 'post',
    data
  })
}

// 更新值班记录
export function edit(data) {
  return request({
    url: `api/stat/duty/${data.id}`,
    method: 'put',
    data
  })
}

// 删除单个值班记录
export function del(id) {
  return request({
    url: `api/stat/duty/${id}`,
    method: 'delete'
  })
}

// 批量删除值班记录
export function batchDel(ids) {
  return request({
    url: 'api/stat/duty',
    method: 'delete',
    data: ids
  })
}

export default { getList, getById, add, edit, del, batchDel } 