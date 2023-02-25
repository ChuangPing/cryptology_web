import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from "axios"
// 配置请求的跟路径 方便调用接口  调用接口只有写接口，不用在加根路径
axios.defaults.baseURL = '/api'
// 将axios配置到vue实例使每个组件均能使用axios $axios 符合VUeAPI规范
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
