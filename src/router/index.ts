import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CatalogoView from '@/views/CatalogoView.vue'
import CreateAccountView from '@/views/CreateAccountView.vue'

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
    }
  ]
})

export default router
