import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { paymentsApi } from '@/lib/api'
import type { 
  PaymentRequest, 
  PaymentResponse,
  PaymentConfirmationResponse,
  PaymentStatus
} from '@/types/payment.types'
import type { CartItem } from '@/types/cart.types'

export const usePaymentStore = defineStore('payment', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentOrderId = ref<number | null>(null)
  const currentPaymentToken = ref<string | null>(null)
  const currentPaymentUrl = ref<string | null>(null)
  const paymentStatus = ref<PaymentStatus | null>(null)

  // Getters
  const isProcessing = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // Actions

  /**
   * Create a payment transaction
   */
  const createPayment = async (
    cart: CartItem[],
    userId: number,
    discountCode?: string | null,
    returnUrl?: string
  ): Promise<PaymentResponse> => {
    loading.value = true
    error.value = null

    try {
      // Calculate subtotal (client side check, backend re-calculates)
      const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

      // Prepare payment request
      const paymentRequest: PaymentRequest = {
        cart: cart.map(item => ({
          patternId: item.patternId,
          patternName: item.patternName,
          designId: item.designId,
          designName: item.designName,
          price: item.price,
          quantity: item.quantity,
          status: item.status,
          addedAt: item.addedAt,
          imageUrl: item.imageUrl
        })),
        user_id: userId,
        return_url: returnUrl || `${window.location.origin}/payment/confirmation`,
        subtotal: subtotal,
        discountCode: discountCode || undefined // Send code if exists
      }

      const response = await paymentsApi.createPayment(paymentRequest)

      if (response.success && response.data) {
        currentOrderId.value = response.data.orderId
        currentPaymentToken.value = response.data.token
        currentPaymentUrl.value = response.data.url
      }

      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el pago'
      error.value = errorMessage
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Confirm payment with Transbank token
   */
  const confirmPayment = async (token: string): Promise<PaymentConfirmationResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await paymentsApi.confirmPayment(token)

      if (response.success && response.data) {
        currentOrderId.value = response.data.orderId
        
        // Store payment status
        paymentStatus.value = {
          orderId: response.data.orderId,
          orderNumber: response.data.orderNumber,
          status: response.data.status === 'AUTHORIZED' ? 'confirmed' : 'cancelled',
          paymentStatus: response.data.status,
          paymentMethod: 'webpay',
          totalAmount: response.data.amount,
          createdAt: new Date(response.data.transaction_date)
        }
      }

      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al confirmar el pago'
      error.value = errorMessage
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Get payment status by order ID
   */
  const getPaymentStatus = async (orderId: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await paymentsApi.getPaymentStatus(orderId)

      if (response.success && response.data) {
        paymentStatus.value = response.data
        currentOrderId.value = orderId
      } else {
        error.value = response.message || 'Error al obtener el estado del pago'
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener el estado del pago'
      error.value = errorMessage
    } finally {
      loading.value = false
    }
  }

  /**
   * Redirect to Webpay payment page
   */
  const redirectToPayment = (url: string, token: string) => {
    // Create a form and submit it to redirect to Webpay
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = url
    
    const tokenInput = document.createElement('input')
    tokenInput.type = 'hidden'
    tokenInput.name = 'token_ws'
    tokenInput.value = token
    
    form.appendChild(tokenInput)
    document.body.appendChild(form)
    form.submit()
  }

  /**
   * Clear payment data
   */
  const clearPaymentData = () => {
    currentOrderId.value = null
    currentPaymentToken.value = null
    currentPaymentUrl.value = null
    paymentStatus.value = null
    error.value = null
  }

  /**
   * Format currency
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return {
    // State
    loading,
    error,
    currentOrderId,
    currentPaymentToken,
    currentPaymentUrl,
    paymentStatus,
    // Getters
    isProcessing,
    hasError,
    // Actions
    createPayment,
    confirmPayment,
    getPaymentStatus,
    redirectToPayment,
    clearPaymentData,
    formatPrice
  }
})
