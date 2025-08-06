import request from '@/utils/request'

// 查询所有异常事件统计
export function getList(params) {
  return request({
    url: 'api/stat/abnormal',
    method: 'get',
    params
  })
}

// 根据ID查询异常事件统计
export function getById(id) {
  return request({
    url: `api/stat/abnormal/${id}`,
    method: 'get'
  })
}

// 创建异常事件统计
export function add(data) {
  return request({
    url: 'api/stat/abnormal',
    method: 'post',
    data
  })
}

// 更新异常事件统计
export function edit(data) {
  return request({
    url: `api/stat/abnormal/${data.id}`,
    method: 'put',
    data
  })
}

// 删除单个异常事件统计
export function del(id) {
  return request({
    url: `api/stat/abnormal/${id}`,
    method: 'delete'
  })
}

// 批量删除异常事件统计
export function batchDel(ids) {
  return request({
    url: 'api/stat/abnormal',
    method: 'delete',
    data: ids
  })
}

export default { getList, getById, add, edit, del, batchDel } 