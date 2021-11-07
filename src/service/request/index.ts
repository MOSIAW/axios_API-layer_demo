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

//------------------实例的拦截-------------------
    //这里是自己封装的，是对应实例的
    //别人从interface接口传进来什么拦截,这里就应用什么拦截
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.reSponseInterceptorCatch
    )

//------------------全局的拦截-------------------
    //添加所有实例的拦截器,这个是axios封装的
    this.instance.interceptors.request.use(
      (config) => {
        console.log('axios请求拦截')
        return config
      },
      (err) => {
        return err
      }
    )

    this.instance.interceptors.response.use(
      (config) => {
        console.log('axios响应拦截')
        return config
      },
      (err) => {
        return err
      }
    )
  }


//------------------具体请求的拦截-------------------
  reque(config: AYRequestConfig): void {
    //把拦截下来的config修改之后重新赋值
    if(config.freeInterceptors?.requestInterceptor) {
      config = config.freeInterceptors?.requestInterceptor(config)
    }

    //相当于axios.request()  这是别名,用别名url、method、data 这些属性都不必在配置中指定
    this.instance.request(config).then((res) => {
      console.log('封装在构造函数里的自定义reque请求');
      console.log(res)
    })
  }
}

export default AYRequest