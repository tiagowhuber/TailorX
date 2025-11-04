<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

// Initialize auth state and cart from localStorage on app mount
onMounted(() => {
  authStore.initializeAuth()
  cartStore.initializeCart()
})
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
