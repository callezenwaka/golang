import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue';
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/asset',
    name: 'Asset',
    component: () => import(/* webpackChunkName: "asset" */ '../views/Asset.vue'),
    meta: { requiresAuth: true },
    beforeEnter: (to) => {
      // reject the navigation
      if (!store.getters.isAuthenticated && to.name !== 'Login') {
        return { name: 'Login' }
      }
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    meta: { requiresAuth: true },
    beforeEnter: (to) => {
      // reject the navigation
      if (!store.getters.isAuthenticated && to.name !== 'Login') {
        return { name: 'Login' }
      }
    },
  },
  {
    path: '/mint',
    name: 'Mint',
    component: () => import(/* webpackChunkName: "mint" */ '../views/Mint.vue'),
    meta: { requiresAuth: true },
    beforeEnter: (to) => {
      // reject the navigation
      if (!store.getters.isAuthenticated && to.name !== 'Login') {
        return { name: 'Login' }
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
	{
		path: '/404',
		name: 'NotFound',
		component: () => import('../views/NotFound.vue'),
		meta: { guest: true },
	},
	{
		path: "/:catchAll(.*)", // Unrecognized path automatically matches 404
		redirect: { name: 'NotFound' }
	}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
