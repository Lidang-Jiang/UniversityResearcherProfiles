import axios from 'axios'
import { Message } from 'element-ui'
import { downloadFile } from '@/utils'
import { getApiLangParam } from '@/locales' // 步骤1: 引入语言工具函数

// 发布订阅
class EventEmitter {
  constructor() {
    this.event = {}
  }
  on(type, cbres, cbrej) {
    if (!this.event[type]) {
      this.event[type] = [[cbres, cbrej]]
    } else {
      this.event[type].push([cbres, cbrej])
    }
  }
  emit(type, res, ansType) {
    if (!this.event[type]) return
    else {
      this.event[type].forEach((cbArr) => {
        if (ansType === 'resolve') {
          cbArr[0](res)
        } else {
          cbArr[1](res)
        }
      })
    }
  }
}

// 请求key
function generateReqKey(config, hash) {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data), hash].join('&')
}

//是否是文件上传
function isFileUploadApi(config) {
  return Object.prototype.toString.call(config.data) === '[object FormData]'
}

// 存储已发送但未响应的请求
const paddingRequest = new Set()

//发布订阅容器

const ev = new EventEmitter()

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API + '/api', // 步骤1: 直接在baseURL中添加/api前缀
  timeout: 6000,
  headers: { channel: 1 },
  showError: true,
})

instance.interceptors.request.use(
  async (config) => {
    // 步骤2: 添加语言参数到所有请求
    const langParams = getApiLangParam()

    // 是否是文件上传
    const isFileUpload = isFileUploadApi(config)
    if (isFileUpload) {
      return config
    }

    // 生成请求key
    const reqKey = generateReqKey(config, location.hash)

    if (paddingRequest.has(reqKey)) {
      try {
        const res = await new Promise((resolve, reject) => {
          ev.on(reqKey, resolve, reject)
        })
        return Promise.reject({
          type: 'limiteResSuccess',
          val: res,
        })
      } catch (limitFunErr) {
        return Promise.reject({
          type: 'limitResError',
          val: limitFunErr,
        })
      }
    } else {
      // 步骤3: 根据请求方法添加语言参数
      if (config.method === 'get' || !config.method) {
        config.params = { ...config.params, ...langParams }
      } else {
        // POST, PUT等方法
        const contentType = config.headers['Content-Type'] || ''
        if (contentType.includes('application/json') || !contentType) {
          config.data = { ...config.data, ...langParams }
        }
      }

      config.pendKey = reqKey
      paddingRequest.add(reqKey)
    }
    return config
  },
  (error) => {
    console.warn(error)
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    const res = response.data
    const code = res.code || res.error
    if (code !== void 0 && code !== 0) {
      if (response.config.showError) {
        Message.error(res.msg ?? '请稍后重试')
      }
      return handleErrorResponse_limit(response)
    }
    handleSuccessResponse_limit(response)

    // 修改判断条件，跳过自定义下载的请求
    if (response.config.responseType === 'blob' && !response.config.isPreview && !response.config.customDownload) {
      const arr = response.headers['content-disposition']?.split(';') || []
      const fileName = arr[1]?.replace('filename=', '')
      downloadFile(response.data, response.config.fileName || decodeURI(fileName))
    }

    return res
  },
  (error) => {
    return handleErrorResponse_limit(error)
  },
)
// 接口响应成功
function handleSuccessResponse_limit(response) {
  const reqKey = response.config.pendKey
  if (reqKey && paddingRequest.has(reqKey)) {
    let x = null
    try {
      x = JSON.parse(JSON.stringify(response.data))
    } catch (error) {
      x = response.data
    }
    paddingRequest.delete(reqKey)
    ev.emit(reqKey, x, 'resolve')
    delete ev[reqKey]
  }
}

// 接口响应失败
function handleErrorResponse_limit(error) {
  if (error.type && error.type === 'limiteResSuccess') {
    return Promise.resolve(error.val)
  } else if (error.type && error.type === 'limitResError') {
    return Promise.reject(error.val)
  } else {
    if (!axios.isCancel(error)) {
      let loggedError = error
      if (error.toJSON) {
        loggedError = error.toJSON()
        console.warn(loggedError && loggedError.message)
      }
    }
    const reqKey = error.config.pendKey
    if (reqKey && paddingRequest.has(reqKey)) {
      let x = null
      try {
        x = JSON.parse(JSON.stringify(error))
      } catch (e) {
        x = error
      }
      paddingRequest.delete(reqKey)
      ev.emit(reqKey, x, 'reject')
      delete ev[reqKey]
    }
  }
  return Promise.reject(error)
}

export default instance
