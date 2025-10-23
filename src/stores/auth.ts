import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/api'
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth.types'

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

  const signInWithGoogle = async (credential: string) => {
    loading.value = true
    error.value = null
    
    try {
      // Send the credential to our backend
      const result = await api.post('/auth/google', {
        credential: credential
      })

      if (result.data.success) {
        token.value = result.data.data.token
        user.value = result.data.data.user
        
        // Store in localStorage
        localStorage.setItem('authToken', result.data.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.data.user))
        
        return { success: true }
      } else {
        error.value = result.data.message || 'Error al iniciar sesión con Google'
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

  const updateProfile = async (data: { first_name?: string; last_name?: string }) => {
    if (!user.value) {
      return { success: false, message: 'Usuario no autenticado' }
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/users/${user.value.id}`, data)

      if (response.data.success) {
        user.value = response.data.data
        localStorage.setItem('user', JSON.stringify(response.data.data))
        return { success: true }
      } else {
        error.value = response.data.message || 'Error al actualizar perfil'
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

  const uploadProfilePicture = async (file: File) => {
    if (!user.value) {
      return { success: false, message: 'Usuario no autenticado' }
    }

    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('profile_picture', file)

      const response = await api.post(`/users/${user.value.id}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        // Update user with new profile picture URL
        if (user.value) {
          user.value.profile_picture_url = response.data.data.profile_picture_url
          localStorage.setItem('user', JSON.stringify(user.value))
        }
        return { success: true, data: response.data.data }
      } else {
        error.value = response.data.message || 'Error al subir imagen'
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

  const deleteProfilePicture = async () => {
    if (!user.value) {
      return { success: false, message: 'Usuario no autenticado' }
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.delete(`/users/${user.value.id}/profile-picture`)

      if (response.data.success) {
        // Update user to remove profile picture URL
        if (user.value) {
          user.value.profile_picture_url = undefined
          localStorage.setItem('user', JSON.stringify(user.value))
        }
        return { success: true }
      } else {
        error.value = response.data.message || 'Error al eliminar imagen'
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
    updateProfile,
    uploadProfilePicture,
    deleteProfilePicture,
  }
})
