// 正确路径：指向简单系统
import request from '@/utils/fetch'

export function listArticle(data) {
  return request({
    url: '/listArticle',
    method: 'post',
    data,
  })
}
