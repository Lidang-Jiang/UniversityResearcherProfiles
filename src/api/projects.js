// 正确路径：指向简单系统
import request from '@/utils/fetch'

export function listProject(data) {
  return request({
    url: '/listProject',
    method: 'post',
    data,
  })
}
