// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './vuex/store'


Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

axios.interceptors.request.use(config => {
    if (sessionStorage.getItem('userToken')) {
      config.headers.Authorization = sessionStorage.getItem('userToken');
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
