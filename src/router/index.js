import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import FormBuilder from '../views/FormBuilder.vue'
import RegistrationManagement from '../views/RegistrationManagement.vue'
import AdminAccount from '../views/AdminAccount.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/form-builder',
    name: 'FormBuilder',
    component: FormBuilder,
    meta: { requiresAuth: true },
  },
  {
    path: '/registrations',
    name: 'RegistrationManagement',
    component: RegistrationManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/account',
    name: 'AdminAccount',
    component: AdminAccount,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
