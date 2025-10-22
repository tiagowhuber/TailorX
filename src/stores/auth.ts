import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/api'
import type { User, LoginCredentials, RegisterCredentials } from './types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userName = computed(() => {
    if (user.value?.first_name && user.value?.last_name) {
      return `${user.value.first_name} ${user.value.last_name}`
    }
    return user.value?.email || ''
  })

  // Actions
  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.success) {
        token.value = response.data.data.token
        user.value = response.data.data.user
        
        // Store in localStorage
        localStorage.setItem('authToken', response.data.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        
        return { success: true }
      } else {
        error.value = response.data.message || 'Error al iniciar sesión'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión con el servidor'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/register', credentials)
      
      if (response.data.success) {
        token.value = response.data.data.token
        user.value = response.data.data.user
        
        // Store in localStorage
        localStorage.setItem('authToken', response.data.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        
        return { success: true }
      } else {
        error.value = response.data.message || 'Error al crear la cuenta'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión con el servidor'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Error during logout:', err)
    } finally {
      // Clear state regardless of API response
      token.value = null
      user.value = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      loading.value = false
    }
  }

  const getCurrentUser = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/auth/me')
      
      if (response.data.success) {
        user.value = response.data.data
        localStorage.setItem('user', JSON.stringify(response.data.data))
        return { success: true }
      } else {
        error.value = response.data.message || 'Error al obtener usuario'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión con el servidor'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Error parsing stored user:', err)
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
      }
    }
  }

  const signInWithGoogle = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Initialize Google OAuth
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      
      if (!clientId || clientId === 'your-google-client-id-here') {
        error.value = 'Google Sign-In no está configurado. Por favor configura VITE_GOOGLE_CLIENT_ID en el archivo .env'
        return { success: false, message: error.value }
      }

      // For now, return a message that Google Sign-In needs to be configured
      // In a real implementation, you would use the Google OAuth library
      error.value = 'Google Sign-In está en desarrollo. Por favor usa el registro por email.'
      return { success: false, message: error.value }
      
      // TODO: Implement Google OAuth flow
      // 1. Initialize Google client
      // 2. Get Google token
      // 3. Send token to backend for verification
      // 4. Backend creates/finds user and returns JWT token
      
    } catch (err: unknown) {
      console.error('Google Sign-In error:', err)
      const message = 'Error al iniciar sesión con Google'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    userName,
    // Actions
    login,
    register,
    logout,
    getCurrentUser,
    initializeAuth,
    signInWithGoogle,
  }
})
