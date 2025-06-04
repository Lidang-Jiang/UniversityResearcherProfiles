// 正确路径：指向简单系统
import request from '@/utils/fetch'

export function getUserInfo(data) {
  return request({
    url: '/userInfo',
    method: 'post',
    data,
  })
}
