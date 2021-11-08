import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { ayRequest1, ayRequest2 } from "./service"

createApp(App).use(store).use(router).mount("#app");

interface DataType {
  data: any,
  returnCode: string,
  success: boolean
}

ayRequest1
  //我们自定义引入DataType类型
  .req<DataType>({
    url: '/home/multidata',
    method: 'GET',
    freeInterceptors: {
      requestInterceptor: (config) => {
        console.log('调用自定义实例1的reque的请求拦截')
        return config
      }
    },
    //自定义功能
    showLoading: true
  })
  //这里拿到结果,所以req需要为Promise
  .then((res) => {
    console.log(res.data)
    console.log(res.returnCode);
  })

ayRequest2
  .get<DataType>({
    url: '/home/multidata',
    //这里就不用传method了,因为固定,已经在index.ts封装
    freeInterceptors: {
      
    }
  }).then((res) => {
    res.data
  })

