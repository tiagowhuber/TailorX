<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Procesando pago...</h2>
        <p class="text-gray-600">Por favor espera mientras confirmamos tu transacción.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
          <p class="text-lg text-gray-600">Tu orden ha sido confirmada</p>
        </div>

        <div v-if="paymentData" class="border-t border-gray-200 pt-6 mb-6">
          <dl class="space-y-4">
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-500">Número de Orden</dt>
              <dd class="text-sm font-semibold text-gray-900">{{ paymentData.orderNumber }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-500">Monto Total</dt>
              <dd class="text-sm font-semibold text-gray-900">{{ formatPrice(paymentData.amount) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-500">Fecha de Transacción</dt>
              <dd class="text-sm text-gray-900">{{ formatDate(paymentData.transaction_date) }}</dd>
            </div>
            <div class="flex justify-between" v-if="paymentData.card_detail">
              <dt class="text-sm font-medium text-gray-500">Tarjeta</dt>
              <dd class="text-sm text-gray-900">**** {{ paymentData.card_detail.card_number }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-500">Código de Autorización</dt>
              <dd class="text-sm text-gray-900">{{ paymentData.response_code }}</dd>
            </div>
          </dl>
        </div>

        <div class="bg-blue-50 rounded-lg p-4 mb-6">
          <p class="text-sm text-blue-800">
            <strong>¡Gracias por tu compra!</strong> Tus patrones están ahora disponibles en tu cuenta.
            Puedes descargarlos en cualquier momento desde tu lista de patrones.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="goToPatterns"
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ver Mis Patrones
          </button>
          <button
            @click="goToHome"
            class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg class="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Pago No Completado</h1>
          <p class="text-lg text-red-600 mb-4">{{ errorMessage }}</p>
        </div>

        <div class="bg-yellow-50 rounded-lg p-4 mb-6">
          <p class="text-sm text-yellow-800">
            Tu pago no pudo ser procesado. Esto puede deberse a fondos insuficientes, datos incorrectos,
            o una cancelación manual. Por favor, intenta nuevamente o contacta a tu banco para más información.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="goToCart"
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Volver al Carrito
          </button>
          <button
            @click="goToHome"
            class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaymentStore } from '@/stores/payment'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentStore()
const cartStore = useCartStore()

const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const paymentData = ref<any>(null)

onMounted(async () => {
  const token = route.query.token_ws as string

  if (!token) {
    error.value = true
    errorMessage.value = 'No se encontró el token de pago'
    loading.value = false
    return
  }

  try {
    const response = await paymentStore.confirmPayment(token)

    if (response.success && response.data) {
      success.value = true
      paymentData.value = response.data

      // Clear cart on successful payment
      cartStore.clearCart()
    } else {
      error.value = true
      errorMessage.value = response.message || 'Error al confirmar el pago'
    }
  } catch (err: any) {
    error.value = true
    errorMessage.value = err.response?.data?.message || 'Error al confirmar el pago'
  } finally {
    loading.value = false
  }
})

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)
}

const goToPatterns = () => {
  router.push('/patterns')
}

const goToCart = () => {
  router.push('/cart')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
