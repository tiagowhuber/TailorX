import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CatalogoView from '@/views/CatalogoView.vue'
import CreateAccountView from '@/views/CreateAccountView.vue'
import LoginView from '@/views/LoginView.vue'
import AccountView from '@/views/AccountView.vue'
import UserMeasurementsView from '@/views/UserMeasurementsView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/catalogo',
      name: 'catalogo',
      component: CatalogoView
    },
    {
      path: '/crear-cuenta',
      name: 'create-account',
      component: CreateAccountView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/cuenta',
      name: 'account',
      component: AccountView,
      meta: { requiresAuth: true }
    },
    {
      path: '/medidas',
      name: 'measurements',
      component: UserMeasurementsView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
