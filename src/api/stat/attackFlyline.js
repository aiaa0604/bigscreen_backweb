import request from '@/utils/request'

// 查询所有攻击飞线记录
export function getList(params) {
  // 添加调试日志
  console.log('攻击飞线API - 请求参数:', params);
  
  return request({
    url: 'api/stat/attack',
    method: 'get',
    params
  }).then(res => {
    console.log('攻击飞线API - 响应数据:', res);
    return res;
  }).catch(err => {
    console.error('攻击飞线API - 请求错误:', err);
    throw err;
  });
}

// 根据ID查询攻击飞线记录
export function getById(id) {
  return request({
    url: `api/stat/attack/${id}`,
    method: 'get'
  })
}

// 创建攻击飞线记录
export function add(data) {
  return request({
    url: 'api/stat/attack',
    method: 'post',
    data
  })
}

// 更新攻击飞线记录
export function edit(data) {
  return request({
    url: `api/stat/attack/${data.id}`,
    method: 'put',
    data
  })
}

// 删除单个攻击飞线记录
export function del(id) {
  return request({
    url: `api/stat/attack/${id}`,
    method: 'delete'
  })
}

// 批量删除攻击飞线记录
export function batchDel(ids) {
  return request({
    url: 'api/stat/attack',
    method: 'delete',
    data: ids
  })
}

export default { getList, getById, add, edit, del, batchDel } 