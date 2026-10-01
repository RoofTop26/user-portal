import { createRouter, createWebHistory } from 'vue-router'
import PortalLogin from '../views/PortalLogin.vue'
import PortalRegister from '../views/PortalRegister.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'
import VerifyEmail from '../views/VerifyEmail.vue'
import PortalLayout from '../layouts/PortalLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: PortalLogin },
    { path: '/register', name: 'register', component: PortalRegister },
    { path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
    { path: '/reset-password', name: 'reset-password', component: ResetPassword },
    { path: '/verify-email', name: 'verify-email', component: VerifyEmail },
    {
      path: '/',
      component: PortalLayout,
      children: [
        { path: 'me', name: 'me', component: () => import('../views/PortalProfile.vue') },
        { path: 'me/edit', name: 'me-edit', component: () => import('../views/PortalEditProfile.vue') },
        { path: 'me/password', name: 'me-password', component: () => import('../views/PortalChangePassword.vue') },
      ],
    },
  ],
})

const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!publicPaths.includes(to.path) && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
