import AYRequest from './request'
import { BASE_URL, TIME_OUT } from './request/config'

export const ayRequest1 = new AYRequest({
  baseURL: BASE_URL,   //请求的服务器
  timeout: TIME_OUT,
  freeInterceptors: {
    requestInterceptor: (config) => {
      console.log('实例1的请求拦截');
      return config
    },
    requestInterceptorCatch: (config) => {
      console.log('实例1的请求错误')
      return config
    },
    responseInterceptor: (config) => {
      console.log('实例1的响应拦截')
      return config
    },
  }
})

export const ayRequest2 = new AYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  freeInterceptors: {
    requestInterceptor: (config) => {
      console.log('实例2的请求拦截')
      return config
    },
    responseInterceptor: (config) => {
      console.log('实例2的响应拦截')
      return config
    }
  }
})

// export default ayRequest1