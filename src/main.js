// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

//jquery
import $ from 'jquery'

//element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


//ckplayer
import '../static/ckplayer/ckplayer/ckplayer.js'

//$.cookie
import '../static/jquery.cookie.js'


//jsencrypt
// import '../static/jsencrypt.js'

//echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//公用css
import './css/style.css'



//公用js
import Global from './components/global';
Vue.prototype.Global = Global

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
