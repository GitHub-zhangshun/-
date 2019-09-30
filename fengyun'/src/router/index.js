import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue')
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../views/info.vue')
    },
    {
      path: '/past',
      name: 'past',
      component: () => import('../views/past.vue')
    }
  ]
})
