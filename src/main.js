// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import 'babel-polyfill'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.apiPath = 'http://api.niuniu.com/api/v1/'
Vue.prototype.dealDate = function (date) {
  var d = new Date(date)
  var m = ''
  var day = ''
  d.getMonth() + 1 < 10 ? m = '0' + (d.getMonth() + 1) : m = d.getMonth() + 1
  d.getDate() < 10 ? day = '0' + d.getDate() : day = d.getDate()
  var datetime = d.getFullYear() + '-' + m + '-' + day
  return datetime
}
axios.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      config.params = {
        _t: Math.random(),
        ...config.params
      }
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
Vue.prototype.$ajax = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
