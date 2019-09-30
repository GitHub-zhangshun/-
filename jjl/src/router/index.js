import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: (resolve) => require(['@/view/index.vue'], resolve),
    },
    {
      path: '/affirm',
      name: 'affirm',
      component: (resolve) => require(['@/view/affirm.vue'], resolve),
    },
    {
      path: '/info',
      name: 'info',
      component: (resolve) => require(['@/view/info.vue'], resolve),
    },
    {
      path: '/login',
      name: 'login',
      component: (resolve) => require(['@/view/login.vue'], resolve),
    }
  ]
})
