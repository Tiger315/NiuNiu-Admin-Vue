// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
// import $ from 'jquery'
import axios from 'axios'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.apiPath = 'http://sign.niuniu.com:8814/api/v1/'
Vue.prototype.$ajax = axios
// Vue.prototype.getData = function (cName, isAsync, sCallback, eCallback) {
//   var url = this.apiPath + cName
//   $.ajax({
//     async: isAsync,
//     url: url,
//     dataType: 'json',
//     type: 'GET',
//     success: function (res) {
//       sCallback(res)
//     },
//     error: function (a, b, c) {
//       eCallback(a, b, c)
//     }
//   })
// }
// Vue.prototype.delData = function (cName, sCallback, eCallback) {
//   var url = this.apiPath + cName;
//   $.ajax({
//     url: url,
//     dataType: "json",
//     type: "DELETE",
//     success: function (res) {
//       sCallback(res);
//     },
//     error: function (a, b, c) {
//       eCallback(a, b, c);
//     }
//   });
// }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
