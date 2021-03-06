import router from '../router'
const axios = require('axios')
import {
  Dialog
} from 'vant'


// 创建axios实例
const service = axios.create({
  baseURL: '/api/jjl0924',
  timeout: 2500 * 10, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  config.method = 'post' // 默认请求post
  config.headers['token'] = window.localStorage.getItem('tokenA')
  return config
}, error => {
  Promise.reject(error)
})

// response拦截器
service.interceptors.response.use(
  response => {
    return Promise.resolve(response.data)
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      Dialog.alert({
        message: '请求超时，请刷新'
      }).then(() => {
        location.reload()
      });
    }
    if (error.response && error.response.data.error === 'TOKEN_ERROR') {
      window.localStorage.setItem('tokenA', '')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service
