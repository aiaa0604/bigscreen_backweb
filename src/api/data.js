import request from '@/utils/request'
import qs from 'qs'

export function initData(url, params) {
  const requestUrl = url + '?' + qs.stringify(params, { indices: false });
  console.log('CRUD请求URL:', requestUrl);
  
  return request({
    url: requestUrl,
    method: 'get'
  }).then(res => {
    console.log('CRUD请求响应:', url, res);
    return res;
  }).catch(err => {
    console.error('CRUD请求错误:', url, err);
    throw err;
  });
}

export function download(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
