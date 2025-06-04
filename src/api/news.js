// 正确路径：指向简单系统
import request from '@/utils/fetch'

export function listNews(data) {
  return request({
    url: '/listNews',
    method: 'post',
    data,
  })
}
