import Vue from 'vue'
import Router from 'vue-router'
import ToDo from '@/components/ToDo'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ToDo',
      component: ToDo
    },
    {
      path: '/un-authenticated',
      name: 'UnAuthenticated',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ],
  mode: 'history' // Use 'history' mode for cleaner URLs (requires server configuration)
})
