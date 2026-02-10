import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CatalogoView from '@/views/CatalogoView.vue'
import DesignDetailView from '@/views/DesignDetailView.vue'
import PatternView from '@/views/PatternView.vue'
import PatternExportView from '@/views/PatternExportView.vue'
import PatternListView from '@/views/PatternListView.vue'
import CartView from '@/views/CartView.vue'
import CreateAccountView from '@/views/CreateAccountView.vue'
import LoginView from '@/views/LoginView.vue'
import AccountView from '@/views/AccountView.vue'
import UserMeasurementsView from '@/views/UserMeasurementsView.vue'
import AIMeasurementsView from '@/views/AIMeasurementsView.vue'
import BodyTypeGuideView from '@/views/BodyTypeGuideView.vue'
import PaymentConfirmationView from '@/views/PaymentConfirmationView.vue'
import OrderListView from '@/views/OrderListView.vue'
import DiscountCodesView from '@/views/DiscountCodesView.vue'
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
      path: '/guia-tipos-cuerpo',
      name: 'body-type-guide',
      component: BodyTypeGuideView
    },
    {
      path: '/catalogo',
      name: 'catalogo',
      component: CatalogoView
    },
    {
      path: '/catalogo/:id',
      name: 'design-detail',
      component: DesignDetailView
    },
    {
      path: '/patrones/:id',
      name: 'pattern-view',
      component: PatternView,
      meta: { requiresAuth: true }
    },
    {
      path: '/patrones/:id/export',
      name: 'pattern-export',
      component: PatternExportView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/patrones',
      name: 'patterns',
      component: PatternListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/carrito',
      name: 'cart',
      component: CartView,
      meta: { requiresAuth: true }
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
    },
    {
      path: '/medidas/ia',
      name: 'ai-measurements',
      component: AIMeasurementsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/payment/confirmation',
      name: 'payment-confirmation',
      component: PaymentConfirmationView,
      meta: { requiresAuth: false }
    },
    {
      path: '/mis-pedidos',
      name: 'orders',
      component: OrderListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/mis-descuentos',
      name: 'discount-codes',
      component: DiscountCodesView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard to protect routes that require authentication
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    // Redirect to home if user is not admin
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
