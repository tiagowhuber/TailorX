import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { patternsApi } from '@/lib/api'
import type { Pattern } from '@/types/pattern.types'

export const usePatternsStore = defineStore('patterns', () => {
  // State
  const patterns = ref<Pattern[]>([])
  const selectedPattern = ref<Pattern | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const generationProgress = ref(false)

  // Getters
  const patternCount = computed(() => patterns.value.length)
  
  const draftPatterns = computed(() => 
    patterns.value.filter(pattern => pattern.status === 'draft')
  )

  const finalizedPatterns = computed(() => 
    patterns.value.filter(pattern => pattern.status === 'finalized')
  )

  const archivedPatterns = computed(() => 
    patterns.value.filter(pattern => pattern.status === 'archived')
  )

  // Actions
  const generatePattern = async (userId: number, designId: number) => {
    generationProgress.value = true
    error.value = null
    try {
      const response = await patternsApi.generatePattern({
        user_id: userId,
        design_id: designId,
      })
      
      if (response.success) {
        // Add the new pattern to the list
        if (response.data) {
          patterns.value.unshift(response.data)
        }
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Error al generar el patrón'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const errorData = err.response?.data
      
      // Check if it's a missing measurements error
      if (errorData?.missing_measurements) {
        return {
          success: false,
          message: errorData.message || 'Faltan medidas requeridas',
          missing_measurements: errorData.missing_measurements
        }
      }
      
      const message = errorData?.message || 'Error de conexión al generar el patrón'
      error.value = message
      return { success: false, message }
    } finally {
      generationProgress.value = false
    }
  }

  const fetchUserPatterns = async (userId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await patternsApi.getUserPatterns(userId)
      if (response.success) {
        patterns.value = response.data
        return { success: true }
      } else {
        error.value = 'Error al cargar los patrones'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión al cargar patrones'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const fetchPatternById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await patternsApi.getPatternById(id)
      if (response.success) {
        selectedPattern.value = response.data
        return { success: true, data: response.data }
      } else {
        error.value = 'Error al cargar el patrón'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión al cargar el patrón'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const updatePattern = async (id: number, name?: string, status?: 'draft' | 'finalized' | 'archived') => {
    try {
      const response = await patternsApi.updatePattern(id, { name, status })
      if (response.success) {
        // Update in the list
        const index = patterns.value.findIndex(p => p.id === id)
        if (index !== -1 && response.data) {
          patterns.value[index] = response.data
        }
        // Update selected if it's the same
        if (selectedPattern.value?.id === id && response.data) {
          selectedPattern.value = response.data
        }
        return { success: true, data: response.data }
      } else {
        return { success: false, message: 'Error al actualizar el patrón' }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión'
      return { success: false, message }
    }
  }

  const finalizePattern = async (id: number) => {
    try {
      const response = await patternsApi.finalizePattern(id)
      if (response.success) {
        // Update in the list
        const index = patterns.value.findIndex(p => p.id === id)
        if (index !== -1 && response.data) {
          patterns.value[index] = response.data
        }
        // Update selected if it's the same
        if (selectedPattern.value?.id === id && response.data) {
          selectedPattern.value = response.data
        }
        return { success: true, data: response.data }
      } else {
        return { success: false, message: 'Error al finalizar el patrón' }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión'
      return { success: false, message }
    }
  }

  const archivePattern = async (id: number) => {
    try {
      const response = await patternsApi.archivePattern(id)
      if (response.success) {
        // Update in the list
        const index = patterns.value.findIndex(p => p.id === id)
        if (index !== -1 && response.data) {
          patterns.value[index] = response.data
        }
        // Update selected if it's the same
        if (selectedPattern.value?.id === id && response.data) {
          selectedPattern.value = response.data
        }
        return { success: true, data: response.data }
      } else {
        return { success: false, message: 'Error al archivar el patrón' }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión'
      return { success: false, message }
    }
  }

  const unarchivePattern = async (id: number) => {
    try {
      const response = await patternsApi.unarchivePattern(id)
      if (response.success) {
        // Update in the list
        const index = patterns.value.findIndex(p => p.id === id)
        if (index !== -1 && response.data) {
          patterns.value[index] = response.data
        }
        // Update selected if it's the same
        if (selectedPattern.value?.id === id && response.data) {
          selectedPattern.value = response.data
        }
        return { success: true, data: response.data }
      } else {
        return { success: false, message: 'Error al desarchivar el patrón' }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión'
      return { success: false, message }
    }
  }

  const downloadPatternPLT = async (id: number, nameFallback?: string) => {
    try {
      const result = await patternsApi.exportPatternToPLT(id)
      const data = result.data
      let filename = result.filename
      
      // If we have a fallback name and the filename is generic, try to improve it
      if (nameFallback && filename) {
        const ext = filename.split('.').pop(); // e.g., 'zip' or 'plt'
        if (ext && (filename === 'pattern.plt' || filename === 'pattern_set.zip')) {
           filename = `${nameFallback}.${ext}`;
        }
      } else if (!filename && nameFallback) {
         // Should not happen with current api implementation, but safe fallback
         filename = `${nameFallback}.plt`;
      }

      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      return { success: true }
    } catch (err: any) {
      console.error('Download PLT error:', err)
      return { success: false, message: 'Error al descargar el archivo PLT' }
    }
  }

  const deletePattern = async (id: number) => {
    try {
      const response = await patternsApi.deletePattern(id)
      if (response.success) {
        // Remove from the list
        patterns.value = patterns.value.filter(p => p.id !== id)
        // Clear selected if it's the same
        if (selectedPattern.value?.id === id) {
          selectedPattern.value = null
        }
        return { success: true }
      } else {
        return { success: false, message: 'Error al eliminar el patrón' }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión'
      return { success: false, message }
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearSelectedPattern = () => {
    selectedPattern.value = null
  }

  return {
    // State
    patterns,
    selectedPattern,
    loading,
    error,
    generationProgress,
    
    // Getters
    patternCount,
    draftPatterns,
    finalizedPatterns,
    archivedPatterns,
    
    // Actions
    generatePattern,
    fetchUserPatterns,
    fetchPatternById,
    updatePattern,
    finalizePattern,
    archivePattern,
    unarchivePattern,
    deletePattern,
    downloadPatternPLT,
    clearError,
    clearSelectedPattern,
  }
})
