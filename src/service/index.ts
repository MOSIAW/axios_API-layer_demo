import AYRequest from './request'
import { BASE_URL, TIME_OUT } from './request/config'

export const ayRequest1 = new AYRequest({
  baseURL: BASE_URL,   //请求的服务器
  timeout: TIME_OUT,
  freeInterceptors: {
    requestInterceptor: (config) => {

      //请求就是config 配置
      // const token = ''
      // if(token) {
      //   //headers.Authorization 请求头
      //   //Bearer: 信使 一般token携带的
      //   config.headers?.Authorization = `Bearer ${token}`
      // }


      console.log('实例1的自定义请求拦截');
      return config
    },
    requestInterceptorCatch: (config) => {
      console.log('实例1的自定义请求错误')
      return config
    },
    responseInterceptor: (config) => {
      console.log('实例1的自定义响应拦截')
      return config
    },
    responseInterceptorCatch: (config) => {
      console.log('实例1的自定义响应错误')
      return config
    },
  }
})

export const ayRequest2 = new AYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  freeInterceptors: {
    requestInterceptor: (config) => {
      console.log('实例2的自定义请求拦截')
      return config
    },
    responseInterceptor: (config) => {
      console.log('实例2的自定义响应拦截')
      return config
    }
  }
})

// export default ayRequest1