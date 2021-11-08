
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

//定义传入哪些hook \ 拦截器
export interface AYRequestInterceptors {
  //要求这里定义四个requestInterceptors
  //use里定义的泛型, config是AxiosRequestConfig类型, 返回值也是AxiosRequestConfig类型
  //别人传过来什么样的拦截, use就应用什么样的拦截
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  //错误拦截 catch,  use中给error就是any类型
  requestInterceptorCatch?: (error: any) => any
  //res在后来劫持定义为res.data, 并不是AxiosResponse类型了
  responseInterceptor?: (res: any) => any
  responseInterceptorCatch?: (error: any) => any
}

//自定义配置
export interface AYRequestConfig extends AxiosRequestConfig {
  freeInterceptors?: AYRequestInterceptors,
  showLoading?: boolean
}
