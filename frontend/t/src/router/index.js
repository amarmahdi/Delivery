import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Signup from '../views/signup.vue'
import Login from '../views/login.vue'
import Dashbord from '../views/Dashbord.vue'
import Logout from '../views/logout.vue'
import Cart from '../views/Cart.vue'
import Order from '../views/Order.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashbord',
    name: 'Dashbord',
    component: Dashbord
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/order',
    name: 'Order',
    component: Order
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
