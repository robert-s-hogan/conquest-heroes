import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home/HomeView.vue'
import Login from '@/views/Login/LoginView.vue'
import Dashboard from '@/views/Dashboard/DashboardView.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { auth } from '@/firebase/firebaseConfig'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [{ path: '', component: HomeView }],
  },
  {
    path: '/login',
    component: DefaultLayout,
    children: [{ path: '', component: Login }],
  },

  {
    path: '/register',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/Register/RegisterView.vue'),
      },
    ],
  },
  {
    path: '/reset-password',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/ResetPassword/ResetPasswordView.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    component: AuthLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', component: Dashboard }],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const currentUser = auth.currentUser

  if (requiresAuth && !currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
