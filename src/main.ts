import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { ayRequest1, ayRequest2 } from "./service"

createApp(App).use(store).use(router).mount("#app");

ayRequest1.reque({
  url: '/home/multidata',
  method: 'GET',
  freeInterceptors: {
    requestInterceptor: (config) => {
      console.log('调用自定义实例1的reque的请求拦截')
      return config
    }
  } 
})

// ayRequest2.reque({})

