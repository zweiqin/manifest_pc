import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'

import moment from 'moment'
import VueUeditorWrap from 'vue-ueditor-wrap'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters
import './utils/directives'

import { Base64 } from 'js-base64'
import './styles/iconfont.css'
import DeepClone from './utils/deepClone/index'
import Compute from './utils/compute/index'

Vue.use(Base64)

Vue.use(DeepClone)

Vue.use(Compute)

// 引入表格
// import 'xe-utils'
// import VXETable from 'vxe-table'
// import 'vxe-table/lib/style.css'
// Vue.use(VXETable);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.prototype.$moment = moment
Vue.component('vue-ueditor-wrap', VueUeditorWrap)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
var _hmt = _hmt || [];
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (_hmt) {
    if (to.path) {
      _hmt.push(['_trackPageview', '/#' + to.fullPath]);
    }
  }
  // if (to.meta.title) {
  //   document.title = to.meta.title + '-' + JSON.parse(Cookies.get('MerInfo')).login_title
  // }
  next();
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
