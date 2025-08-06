import request from '@/utils/request'

// 查询所有告警统计记录
export function getList(params) {
  // 添加调试日志
  console.log('告警统计API - 请求参数:', params);
  
  return request({
    url: 'api/stat/alarm',
    method: 'get',
    params
  }).then(res => {
    console.log('告警统计API - 响应数据:', res);
    return res;
  }).catch(err => {
    console.error('告警统计API - 请求错误:', err);
    throw err;
  });
}

// 根据ID查询告警统计记录
export function getById(id) {
  return request({
    url: `api/stat/alarm/${id}`,
    method: 'get'
  })
}

// 创建告警统计记录
export function add(data) {
  return request({
    url: 'api/stat/alarm',
    method: 'post',
    data
  })
}

// 更新告警统计记录
export function edit(data) {
  return request({
    url: `api/stat/alarm/${data.id}`,
    method: 'put',
    data
  })
}

// 删除单个告警统计记录
export function del(id) {
  return request({
    url: `api/stat/alarm/${id}`,
    method: 'delete'
  })
}

// 批量删除告警统计记录
export function batchDel(ids) {
  return request({
    url: 'api/stat/alarm',
    method: 'delete',
    data: ids
  })
}

export default { getList, getById, add, edit, del, batchDel } 