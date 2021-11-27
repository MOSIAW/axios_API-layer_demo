import axios from 'axios'   //这样封装,如果到时候需要修改引入的库就很方便了
import { AxiosInstance } from 'axios'
import { AYRequestInterceptors, AYRequestConfig } from './type'

import { ElLoading, ILoadingInstance } from 'element-plus'

// class XRequest{    //这样封装外部就可以调用 XRequest.get()
//   get() {}
//   request() {}
// }

//常量一般大写 
const LOADING = false

class AYRequest{
  instance: AxiosInstance    //AxiosInstance是继承Axios
  interceptors?: AYRequestInterceptors
  loading?: ILoadingInstance
  showLoading: boolean

  constructor(config: AYRequestConfig) {
    this.instance = axios.create(config)
    this.showLoading = config.showLoading ?? false
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
      this.interceptors?.responseInterceptorCatch
    )

//------------------全局的拦截-------------------
    //添加所有实例的拦截器,这个是axios封装的
    this.instance.interceptors.request.use(
      (config) => {
        console.log('axios请求拦截')

        if(this.showLoading) {
          //页面无效果,不知道原因
          this.loading = ElLoading.service({
            lock: true,
            text: "请求中...",
            background: 'rgba(0, 0, 0, 0.5)'
          })
        }
        
        return config
      },
      (err) => {
        return err
      }
    )

    //HTTP 4xx 5xx错误码 在这里拦截  err.response.status
    this.instance.interceptors.response.use(
      (res) => {
        console.log('axios响应拦截')

        //setTimeout调试用 取消loading状态
        setTimeout(() => {
          this.loading?.close()
        }, 1000);
        
        //可以封装checkstatus,显示不同错误

        //错误情况2：后端返回的returnCode
        const data = res.data
        if(data.returnCode === -1001) {
          //TODO
        } else {
          return data
        }

        // 由于axios自动给请求信息封装，我们需要拿到其中的data属性
        return res.data
      },
      (err) => {
        //错误情况1：HttpErrorCode
        switch(err.response.status) {
          case 404: 
            console.log("404错误")
            break
          case 500:
            console.log("500错误")
            break
        }
        return err
      }
    )
  }

//------------------单个请求的拦截-------------------
  //自定义
  req<T>(config: AYRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      //把拦截下来的config修改之后重新赋值
      if(config.freeInterceptors?.requestInterceptor) {
        config = config.freeInterceptors?.requestInterceptor(config)
      }

      if(config.showLoading === true) {
        this.showLoading = config.showLoading
      }

      //相当于axios.request()  axios.get() axios.delete()等都是别名,用别名的话url、method、data这些属性都不必在配置中指定
      this.instance
        //由于上面res返回了res.data,并不是AxiosResponse类型了, request本身有三个泛型,这里修改了第二个
        .request<any, T>(config)
        .then((res) => {
          console.log('封装在构造函数里的自定义reque请求');
          if(config.freeInterceptors?.responseInterceptor) {
            res = config.freeInterceptors?.responseInterceptor(res)
          }
          resolve(res)

          //每次请求完再设置为初始化值
          this.showLoading = false
        })
        .catch((err) => {

          this.showLoading = false
          reject(err)
          return err
        })
    })
    
  }
  get<T>(config: AYRequestConfig<T>): Promise<T> {
    return this.req<T>({...config, method: "GET"})
  }
  delete<T>(config: AYRequestConfig<T>): Promise<T> {
    return this.req<T>({...config, method: "DELETE"})
  }
  post<T>(config: AYRequestConfig<T>): Promise<T> {
    return this.req<T>({...config, method: "POST"})
  }
  patch<T>(config: AYRequestConfig<T>): Promise<T> {
    return this.req<T>({...config, method: "PATCH"})
  }
}

export default AYRequest