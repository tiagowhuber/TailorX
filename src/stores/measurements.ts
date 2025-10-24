import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { measurementsApi } from '@/lib/api'
import type { MeasurementType, UserMeasurement, BatchMeasurementInput } from '@/types/measurements.types'

export const useMeasurementsStore = defineStore('measurements', () => {
  // State
  const measurementTypes = ref<MeasurementType[]>([])
  const userMeasurements = ref<UserMeasurement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const measurementTypesCount = computed(() => measurementTypes.value.length)
  const userMeasurementsCount = computed(() => userMeasurements.value.length)
  
  // Get measurement value by type id
  const getMeasurementByTypeId = computed(() => {
    return (typeId: number): UserMeasurement | undefined => {
      return userMeasurements.value.find(m => m.measurement_type_id === typeId)
    }
  })

  // Actions
  const fetchMeasurementTypes = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await measurementsApi.getMeasurementTypes()
      
      if (response.success) {
        measurementTypes.value = response.data
        return { success: true }
      } else {
        error.value = 'Error al cargar tipos de medidas'
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

  const fetchUserMeasurements = async (userId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await measurementsApi.getUserMeasurements(userId)
      
      if (response.success) {
        userMeasurements.value = response.data
        return { success: true }
      } else {
        error.value = 'Error al cargar medidas del usuario'
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

  const saveMeasurements = async (userId: number, measurements: BatchMeasurementInput[]) => {
    loading.value = true
    error.value = null
    
    try {
      // Filter out measurements with no value
      const validMeasurements = measurements.filter(m => m.value > 0)
      
      if (validMeasurements.length === 0) {
        error.value = 'No hay medidas válidas para guardar'
        return { success: false, message: error.value }
      }

      const response = await measurementsApi.batchSaveMeasurements({
        user_id: userId,
        measurements: validMeasurements
      })
      
      if (response.success) {
        // Refresh user measurements
        await fetchUserMeasurements(userId)
        return { success: true, data: response.data }
      } else {
        error.value = 'Error al guardar medidas'
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

  const deleteMeasurement = async (id: number, userId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await measurementsApi.deleteMeasurement(id)
      
      if (response.success) {
        // Refresh user measurements
        await fetchUserMeasurements(userId)
        return { success: true }
      } else {
        error.value = 'Error al eliminar medida'
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

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    measurementTypes,
    userMeasurements,
    loading,
    error,
    // Getters
    measurementTypesCount,
    userMeasurementsCount,
    getMeasurementByTypeId,
    // Actions
    fetchMeasurementTypes,
    fetchUserMeasurements,
    saveMeasurements,
    deleteMeasurement,
    clearError,
  }
})
