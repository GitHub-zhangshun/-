// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'normalize.css'
import './assets/style/main.less'

Vue.config.productionTip = false

// 弹窗遮罩
// import Kiko from 'kiko-rascalhao'
// Vue.use(Kiko)

import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})


router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('tokenB')
  if (!token) {
    if (to.name === 'login') {
      next()
    } else {
      next('/login')
    }
  } else {
    if (to.name === 'login') {
      next({
        path: '/'
      })
    } else {
      next()
    }
  }
})
