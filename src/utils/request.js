import axios from 'axios'
import Vue from 'vue'
import { Toast } from 'vant'
import qs from 'qs'
import { BASE_URL } from './config'

Vue.use(Toast)

const errorHandle = status => {
  // 判断状态码
  switch (status) {
    case 401:
      // Toast('请登录后操作')
      break
    case 403:
      Toast('登录过期，请重新登录')
      break
    case 500:
      Toast.fail('找不到此服务，请稍后重试~')
      break
    case 503:
      Toast.fail('服务器开小差了~请稍后~')
      break
    default:
      Toast.fail('未知错误')
  }
  return { rc: 1, data: [] }
}

export const ApplicationJson = 'application/json'

// 新建了一个 axios 实例
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 10
})

// 处理请求
request.interceptors.request.use(
  config => {
    config.headers.authorization = `authorization`
    if (!(config.data instanceof FormData)) {
      config.headers = {
        'Content-Type': ApplicationJson,
        ...config.headers
      }
      // 封装post, 帮转一层, 后端可以解析
      if (config.method === 'post' || config.method === 'put') {
        const { params = '' } = config.data
        if (params && params.baseURL) {
          // 更改 post 请求的 baseUrl
          config.baseURL = params.baseURL
        }
        if (params && params.contentType) {
          // 更改 content-type
          config.headers['Content-Type'] = params.contentType
        }
        if (config.headers['Content-Type'] === 'application/json' && config.data) {
          config.data = config.data.params
        } else if (config.data) {
          // 表单请求，需要用 qs 转下
          config.data = qs.stringify(config.data.params)
        }
      }

      // 更改 baseURL
      if (config.params && config.params.baseURL) {
        config.baseURL = config.params.baseURL
      }
      // 更改 contentType
      if (config.params && config.params.contentType) {
        config.headers['Content-Type'] = config.params.contentType
      }
    }

    return config
  },
  // 请求错误
  () => {
    // console.log('request error', err)
  }
)

// 处理响应数据
request.interceptors.response.use(
  // 请求成功
  res => {
    if (res.status === 200) {
      if (res.data.rc === 1) {
        Toast.fail(res.data.msg)
      }
      return res.data
    }
    return Promise.reject(res.data)
  },
  // todo: 请求失败
  err => {
    const { response } = err
    if (response) {
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    }
    return { rc: 1, data: [] }
  }
)

export default request
