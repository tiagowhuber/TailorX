<template>
  <!-- Navigation Header -->
  <NavigationBar />

  <div class="min-h-screen bg-black text-white relative overflow-hidden">
    <!-- Subtle spotlight background -->
    <div class="pointer-events-none absolute -top-24 left-1/3 w-[700px] h-[700px] bg-gradient-radial from-[#E3F450]/20 via-yellow-300/10 to-transparent rounded-full blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-0 right-1/4 w-[900px] h-[600px] bg-gradient-radial from-[#E3F450]/30 via-yellow-300/20 to-transparent rounded-full blur-3xl"></div>

    <main class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Loading State -->
      <motion.div
        v-if="loading"
        class="bg-white/5 border border-white/10 rounded-lg p-8 sm:p-12 text-center"
        :initial="{ opacity: 0, scale: 0.95 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ type: 'spring', stiffness: 250, damping: 25 }"
      >
        <div class="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-[#E3F450] mx-auto mb-4">
        </div>
        <h2 class="text-xl sm:text-2xl font-bold mb-2" >Procesando pago...</h2>
        <p class="text-sm sm:text-base text-gray-400 " >Por favor espera mientras confirmamos tu transacción.</p>
      </motion.div>

      <!-- Success State -->
      <motion.div
        v-else-if="success"
        class="space-y-6 sm:space-y-8"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ type: 'spring', stiffness: 200, damping: 25 }"
      >
        <!-- Success Header -->
        <div class="text-center space-y-3 sm:space-y-4">
          <div class="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#E3F450]/20 border-2 border-[#E3F450] mb-3 sm:mb-4">
            <svg class="h-12 w-12 text-[#E3F450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider " style="background-color: #E3F450; color: black;">
            Pago Confirmado
          </div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black" >PAGO EXITOSO</h1>
          <p class="text-lg sm:text-xl text-gray-300 " >Tu orden ha sido confirmada</p>
        </div>

        <!-- Payment Details Card -->
        <div v-if="paymentData" class="bg-white/5 border border-white/10 rounded-lg p-6 sm:p-8">
          <h3 class="text-base sm:text-lg font-bold mb-4 sm:mb-6 " >Detalles de la Transacción</h3>
          <dl class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-white/10">
              <dt class="text-sm text-gray-400 " >Número de Orden</dt>
              <dd class="text-base font-bold text-[#E3F450] " >{{ paymentData.orderNumber }}</dd>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-white/10">
              <dt class="text-sm text-gray-400 " >Monto Total</dt>
              <dd class="text-xl font-bold text-white " >{{ formatPrice(paymentData.amount) }}</dd>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-white/10">
              <dt class="text-sm text-gray-400 " >Fecha de Transacción</dt>
              <dd class="text-sm text-white " >{{ formatDate(paymentData.transaction_date) }}</dd>
            </div>
            <div v-if="paymentData.card_detail" class="flex justify-between items-center py-3 border-b border-white/10">
              <dt class="text-sm text-gray-400 " >Tarjeta</dt>
              <dd class="text-sm text-white " >**** {{ paymentData.card_detail.card_number }}</dd>
            </div>
            <div class="flex justify-between items-center py-3">
              <dt class="text-sm text-gray-400 " >Código de Autorización</dt>
              <dd class="text-sm text-white " >{{ paymentData.response_code }}</dd>
            </div>
          </dl>
        </div>

        <!-- Success Message -->
        <div class="bg-[#E3F450]/10 border border-[#E3F450]/30 rounded-lg p-6">
          <p class="text-sm text-[#E3F450] " >
            <strong class="font-bold">¡Gracias por tu compra!</strong> Tu pedido está siendo procesado.
            Nuestro equipo empezará a coser tu patrón personalizado de inmediato. Puedes verificar el estado de tu orden en cualquier momento.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="goToOrders"
            class="flex-1 px-6 py-4 rounded-md font-bold uppercase tracking-wide transition-all "
            style="background-color: #E3F450; color: black;"
          >
            Ver Mis Órdenes
          </button>
          <button
            @click="goToHome"
            class="flex-1 px-6 py-4 rounded-md font-bold uppercase tracking-wide bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all "
            
          >
            Volver al Inicio
          </button>
        </div>
      </motion.div>

      <!-- Error State -->
      <motion.div
        v-else-if="error"
        class="space-y-8"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ type: 'spring', stiffness: 200, damping: 25 }"
      >
        <!-- Error Header -->
        <div class="text-center space-y-4">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/20 border-2 border-red-500 mb-4">
            <svg class="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <div class="inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider " style="background-color: #EF4444; color: white;">
            Pago Rechazado
          </div>
          <h1 class="text-4xl md:text-5xl font-black" >PAGO NO COMPLETADO</h1>
          <p class="text-xl text-red-400 " >{{ errorMessage }}</p>
        </div>

        <!-- Error Message -->
        <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
          <p class="text-sm text-yellow-300 " >
            Tu pago no pudo ser procesado. Esto puede deberse a fondos insuficientes, datos incorrectos,
            o una cancelación manual. Por favor, intenta nuevamente o contacta a tu banco para más información.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="goToCart"
            class="flex-1 px-6 py-4 rounded-md font-bold uppercase tracking-wide transition-all "
            style="background-color: #E3F450; color: black;"
          >
            Volver al Carrito
          </button>
          <button
            @click="goToHome"
            class="flex-1 px-6 py-4 rounded-md font-bold uppercase tracking-wide bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all "
            
          >
            Volver al Inicio
          </button>
        </div>
      </motion.div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaymentStore } from '@/stores/payment'
import { useCartStore } from '@/stores/cart'
import NavigationBar from '@/components/NavigationBar.vue'
import { motion } from 'motion-v'

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

const goToOrders = () => {
  router.push('/mis-pedidos')
}

const goToCart = () => {
  router.push('/cart')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
@font-face {
  font-family: 'Stack Sans Notch';
  src: url('@/assets/fonts/Stack_Sans_Notch/static/StackSansNotch-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* Apply Stack Sans Notch font globally */
body {
  font-family: 'Stack Sans Notch', sans-serif;
}

/* General text styles */
p, dl, dt, dd {
  font-family: 'Stack Sans Notch', sans-serif;
}

/* Button styles */
button {
  font-family: 'Stack Sans Notch', sans-serif;
  cursor: pointer;
}
</style>
