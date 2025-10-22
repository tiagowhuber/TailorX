<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Initialize auth state from localStorage on app mount
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
