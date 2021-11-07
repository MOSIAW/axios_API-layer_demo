import axios from 'axios'   //这样封装,如果到时候需要修改引入的库就很方便了
import { AxiosInstance } from 'axios'
import { AYRequestInterceptors, AYRequestConfig } from './type'

// class XRequest{    //这样封装外部就可以调用 XRequest.get()
//   get() {}
//   request() {}
// }

class AYRequest{
  instance: AxiosInstance    //AxiosInstance是继承Axios
  interceptors?: AYRequestInterceptors

  constructor(config: AYRequestConfig) {
    this.instance = axios.create(config)

    //把所有传进来的interceptors保存到this
    this.interceptors = config.freeInterceptors

    //别人从interface接口传进来什么拦截,这里就应用什么拦截,是对应实例的
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.reSponseInterceptorCatch
    )

    //添加所有实例的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log('全局请求拦截')
        return config
      },
      (err) => {
        return err
      }
    )

    this.instance.interceptors.response.use(
      (config) => {
        console.log('全局响应拦截')
        return config
      },
      (err) => {
        return err
      }
    )
  }
  reque(config: AYRequestConfig): void {
    //相当于axios.request()  这是别名,用别名url、method、data 这些属性都不必在配置中指定
    this.instance.request(config).then((res) => {
      console.log(res)
    })
  }
}

export default AYRequest