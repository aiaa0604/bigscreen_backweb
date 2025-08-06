import request from '@/utils/request'

// 获取所有表名
export function getAllTables() {
  return request({
    url: '/api/csv/tables',
    method: 'get'
  })
}

// 新建表
export function createTable(data) {
  return request({
    url: '/api/csv/createTable',
    method: 'post',
    data
  })
}

// 导入数据到指定表
export function importCsv(data) {
  return request({
    url: '/api/csv/import',
    method: 'post',
    data
  })
} 