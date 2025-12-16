import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { addressesApi } from '@/lib/api'
import type { UserAddress, CreateAddressRequest, UpdateAddressRequest } from '@/types/address.types'

export const useAddressesStore = defineStore('addresses', () => {
  // State
  const addresses = ref<UserAddress[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const defaultAddress = computed(() => addresses.value.find(addr => addr.is_default))
  const hasAddresses = computed(() => addresses.value.length > 0)

  // Actions
  const fetchAddresses = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await addressesApi.getUserAddresses()
      if (response.success) {
        addresses.value = response.data
        return { success: true }
      } else {
        error.value = response.message || 'Error al cargar direcciones'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión al cargar direcciones'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const createAddress = async (data: CreateAddressRequest) => {
    loading.value = true
    error.value = null
    try {
      const response = await addressesApi.createAddress(data)
      if (response.success) {
        addresses.value.push(response.data)
        // If this is the first address or marked as default, refresh list to ensure consistency
        if (addresses.value.length === 1 || data.is_default) {
          await fetchAddresses()
        }
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Error al crear dirección'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión al crear dirección'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const updateAddress = async (id: number, data: UpdateAddressRequest) => {
    loading.value = true
    error.value = null
    try {
      const response = await addressesApi.updateAddress(id, data)
      if (response.success) {
        const index = addresses.value.findIndex(a => a.id === id)
        if (index !== -1) {
          addresses.value[index] = response.data
        }
        // If marked as default, refresh list to ensure others are unset
        if (data.is_default) {
          await fetchAddresses()
        }
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'Error al actualizar dirección'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión al actualizar dirección'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const deleteAddress = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await addressesApi.deleteAddress(id)
      if (response.success) {
        addresses.value = addresses.value.filter(a => a.id !== id)
        return { success: true }
      } else {
        error.value = response.message || 'Error al eliminar dirección'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión al eliminar dirección'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    addresses,
    loading,
    error,
    // Getters
    defaultAddress,
    hasAddresses,
    // Actions
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  }
})
