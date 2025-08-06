import request from '@/utils/request'

export default {
  // 上传CSV文件
  uploadCsv(data) {
    return request({
      url: 'api/csv/upload',
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 预览CSV数据
  previewCsv(data) {
    return request({
      url: 'api/csv/preview',
      method: 'post',
      data: data
    })
  },

  // 导入CSV数据
  importCsv(data) {
    return request({
      url: 'api/csv/import',
      method: 'post',
      data: data
    })
  },

  // 获取导入历史
  getImportHistory(params) {
    return request({
      url: 'api/csv/history',
      method: 'get',
      params: params
    })
  },

  // 下载CSV模板
  downloadTemplate() {
    return request({
      url: 'api/csv/template',
      method: 'get',
      responseType: 'blob'
    })
  }
}
