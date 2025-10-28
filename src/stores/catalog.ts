import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { designsApi } from '@/lib/api'
import type { Design } from '@/types/design.types'

export const useCatalogStore = defineStore('catalog', () => {
  // State
  const designs = ref<Design[]>([])
  const selectedDesign = ref<Design | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const showOnlyActive = ref(true)

  // Getters
  const designCount = computed(() => designs.value.length)
  
  const filteredDesigns = computed(() => {
    if (showOnlyActive.value) {
      return designs.value.filter(design => design.is_active)
    }
    return designs.value
  })

  const activeDesignCount = computed(() => 
    designs.value.filter(design => design.is_active).length
  )

  // Actions
  const fetchDesigns = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await designsApi.getDesigns()
      if (response.success) {
        designs.value = response.data
        return { success: true }
      } else {
        error.value = 'Error al cargar los diseños'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión al cargar diseños'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const fetchActiveDesigns = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await designsApi.getActiveDesigns()
      if (response.success) {
        designs.value = response.data
        return { success: true }
      } else {
        error.value = 'Error al cargar los diseños activos'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión al cargar diseños'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const fetchDesignById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await designsApi.getDesignById(id)
      if (response.success) {
        selectedDesign.value = response.data
        return { success: true, data: response.data }
      } else {
        error.value = 'Error al cargar el diseño'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión al cargar el diseño'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const fetchDesignMeasurements = async (id: number) => {
    try {
      const response = await designsApi.getDesignMeasurements(id)
      if (response.success) {
        return { success: true, data: response.data }
      } else {
        return { success: false, message: 'Error al cargar las medidas requeridas' }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión'
      return { success: false, message }
    }
  }

  const toggleActiveFilter = () => {
    showOnlyActive.value = !showOnlyActive.value
  }

  const clearError = () => {
    error.value = null
  }

  const clearSelectedDesign = () => {
    selectedDesign.value = null
  }

  return {
    // State
    designs,
    selectedDesign,
    loading,
    error,
    showOnlyActive,
    
    // Getters
    designCount,
    filteredDesigns,
    activeDesignCount,
    
    // Actions
    fetchDesigns,
    fetchActiveDesigns,
    fetchDesignById,
    fetchDesignMeasurements,
    toggleActiveFilter,
    clearError,
    clearSelectedDesign,
  }
})
