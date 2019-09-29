import router from '../router'
const axios = require('axios')
import {Dialog } from 'vant'


// 创建axios实例
const service = axios.create({
  baseURL: '/activity/gqfyb0926/h5/api',
  timeout: 2500 * 10, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  config.method = 'post' // 默认请求post
  config.headers['token'] = window.localStorage.getItem('tokenB')
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// response拦截器
service.interceptors.response.use(
  response => {
    return Promise.resolve(response.data)
  },
  error => {
    console.log('resp-error========>')
    console.dir(error)
    // console.log(error.response.data.error)
    // console.log(error.code)
    if (error.code === 'ECONNABORTED') {
      Dialog.alert({
        message: '请求超时，请刷新'
      }).then(() => {
        location.reload()
      });
    }
    if (error.response && error.response.data.error === 'TOKEN_ERROR') {
      window.localStorage.setItem('tokenB', '')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service
