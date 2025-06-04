import request from '@/utils/fetch'

export function listSelfIntro(data) {
  return request({
    url: '/listSelfIntro',
    method: 'post',
    data,
  })
}
