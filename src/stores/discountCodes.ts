import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/api' // Using the axios instance directly since it's not in api object yet
import { useAuthStore } from './auth'

export interface DiscountCode {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  value: number;
  max_discount_amount?: number;
  starts_at?: string;
  expires_at?: string;
  is_active: boolean;
  applies_to_design_id?: number;
  target_design_ids?: number[];
  is_free_shipping?: boolean;
  max_total_uses?: number;
  max_uses_per_user?: number;
}

export const useDiscountCodesStore = defineStore('discountCodes', () => {
  const codes = ref<DiscountCode[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()

  const fetchUserCodes = async () => {
    if (!authStore.user?.id) return

    loading.value = true
    error.value = null
    try {
      // Need to add this endpoint to api.ts or use raw axios
      const response = await api.get(`/discount-codes/user/${authStore.user.id}`)
      if (response.data.success) {
        codes.value = response.data.data
      } else {
        error.value = response.data.message
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error fetching discount codes'
    } finally {
      loading.value = false
    }
  }

  const validateCode = async (code: string, cartItems: any[]) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/discount-codes/validate', {
        code,
        userId: authStore.user?.id,
        cartItems
      })
      
      if (response.data.success) {
        return { success: true, data: response.data.data }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Error validating code' }
    } finally {
      loading.value = false
    }
  }

  const redeemCode = async (code: string) => {
    if (!authStore.user?.id) return { success: false, message: 'User not authenticated' }

    loading.value = true
    error.value = null
    try {
      const response = await api.post('/discount-codes/assign', {
        userId: authStore.user.id,
        code
      })
      
      if (response.data.success) {
        // Refresh codes
        await fetchUserCodes()
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Error redeeming code' }
    } finally {
      loading.value = false
    }
  }

  return {
    codes,
    loading,
    error,
    fetchUserCodes,
    validateCode,
    redeemCode
  }
})
