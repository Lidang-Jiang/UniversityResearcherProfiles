// 假设这是项目中的axios配置文件
import axios from 'axios'
import { getApiLangParam } from '@/locales'

const service = axios.create({
  baseURL: process.env.VITE_BASE_API,
  timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 步骤1：统一添加语言参数
    const langParams = getApiLangParam()

    // 根据请求方法添加参数
    if (config.method === 'get') {
      config.params = { ...config.params, ...langParams }
    } else {
      // POST, PUT等方法
      config.data = { ...config.data, ...langParams }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
