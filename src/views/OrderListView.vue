<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="relative pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Sidebar -->
          <AccountSidebar active-section="orders" />

          <!-- Main Content Area -->
          <main class="flex-1 min-w-0">
            <!-- Header -->
            <motion.div
              class="mb-6 sm:mb-8"
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ type: 'spring', stiffness: 250, damping: 30 }"
            >
              <div class="inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 " style="background-color: #E3F450; color: black;">
                Historial de Compras
              </div>
              <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2" >MIS PEDIDOS</h1>
              <p class="text-xs sm:text-sm text-gray-400 " >
                {{ orders.length }} {{ orders.length === 1 ? 'pedido' : 'pedidos' }} realizados
              </p>
            </motion.div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-20">
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E3F450]"></div>
            </div>

            <!-- Empty State -->
            <motion.div
              v-else-if="orders.length === 0"
              class="text-center py-20"
              :initial="{ opacity: 0, scale: 0.95 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ type: 'spring', stiffness: 200, damping: 25 }"
            >
              <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-white/5 border border-white/10 mb-6">
                <ShoppingBag class="h-12 w-12 text-gray-500" />
              </div>
              <h3 class="text-2xl font-semibold text-gray-400 mb-2" >
                No tienes pedidos aún
              </h3>
              <p class="text-gray-500 mb-6 " >
                Cuando realices una compra, aparecerá aquí
              </p>
              <Button
                @click="router.push({ name: 'catalogo' })"
                variant="outline"
                class="bg-[#E3F450] border-[#E3F450] text-black hover:bg-[#E3F450]/80 "
                
              >
                <Store class="mr-2 h-4 w-4" />
                Explorar Catálogo
              </Button>
            </motion.div>

            <!-- Orders List -->
            <div v-else class="space-y-4">
              <motion.div
                v-for="(order, index) in orders"
                :key="order.id"
                :initial="{ opacity: 0, y: 20 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ type: 'spring', stiffness: 200, damping: 25, delay: index * 0.05 }"
              >
                <Collapsible
                  v-model:open="order.isOpen"
                  class="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all"
                >
                  <CollapsibleTrigger class="w-full">
                    <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-3 sm:gap-0">
                      <div class="flex-1 text-left w-full">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 class="text-base sm:text-lg font-bold text-white">
                            {{ order.order_number }}
                          </h3>
                          <div class="flex flex-wrap gap-2">
                            <Badge :class="getStatusClass(order.status)">
                              {{ getStatusLabel(order.status) }}
                            </Badge>
                            <Badge v-if="order.payment_status" :class="getPaymentStatusClass(order.payment_status)">
                              {{ getPaymentStatusLabel(order.payment_status) }}
                            </Badge>
                          </div>
                        </div>
                        <div class="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 " >
                          <span class="flex items-center gap-1">
                            <Calendar class="h-4 w-4" />
                            {{ formatDate(order.created_at) }}
                          </span>
                          <span class="flex items-center gap-1">
                            <Package class="h-4 w-4" />
                            {{ order.items?.length || 0 }} {{ order.items?.length === 1 ? 'artículo' : 'artículos' }}
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                        <div class="text-left sm:text-right flex-1 sm:flex-none">
                          <p class="text-xs sm:text-sm text-gray-400 " >Total</p>
                          <p class="text-lg sm:text-xl font-bold text-[#E3F450] " >
                            {{ formatPrice(order.total_amount) }}
                          </p>
                        </div>
                        <ChevronDown
                          class="h-5 w-5 text-gray-400 transition-transform duration-200"
                          :class="{ 'rotate-180': order.isOpen }"
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div class="border-t border-white/10 p-6 bg-black/20">
                      <!-- Order Items -->
                      <h4 class="text-sm font-bold text-white mb-4">
                        ARTÍCULOS DEL PEDIDO
                      </h4>
                      <div class="space-y-3">
                        <motion.div
                          v-for="(item, itemIndex) in order.items"
                          :key="item.id"
                          class="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-4"
                          :initial="{ opacity: 0, x: -20 }"
                          :animate="{ opacity: 1, x: 0 }"
                          :transition="{ delay: Number(itemIndex) * 0.05 }"
                        >
                          <div class="flex-shrink-0">
                            <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                              <FileText class="w-8 h-8 text-gray-500" />
                            </div>
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-white " >
                              Patrón #{{ item.pattern_id }}
                            </p>
                            <p class="text-xs text-gray-400 " >
                              Cantidad: {{ item.quantity }}
                            </p>
                          </div>
                          <div class="text-right">
                            <p class="text-sm font-bold text-white " >
                              {{ formatPrice(item.price * item.quantity) }}
                            </p>
                            <p class="text-xs text-gray-400 " >
                              {{ formatPrice(item.price) }} c/u
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      <!-- Order Summary -->
                      <div class="mt-6 pt-6 border-t border-white/10">
                        <div class="flex justify-between items-center">
                          <span class="text-sm text-gray-400 " >
                            Total del Pedido
                          </span>
                          <span class="text-xl font-bold text-[#E3F450] " >
                            {{ formatPrice(order.total_amount) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ordersApi } from '@/lib/api'
import { 
  ShoppingBag,
  Store,
  Calendar,
  Package,
  ChevronDown,
  FileText
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import NavigationBar from '@/components/NavigationBar.vue'
import AccountSidebar from '@/components/AccountSidebar.vue'
import { motion } from 'motion-v'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const orders = ref<any[]>([])

// Fetch orders on mount
onMounted(async () => {
  if (!authStore.isAuthenticated || !authStore.user) {
    router.push('/login')
    return
  }

  try {
    const response = await ordersApi.getUserOrders(authStore.user.id)
    if (response.success && response.data) {
      // Add isOpen property for collapsible
      orders.value = response.data.map((order: any) => ({
        ...order,
        isOpen: false
      }))
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
})

// Format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price)
}

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
  }).format(date)
}

// Get status label
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    processing: 'Procesando',
    shipped: 'Enviado',
    completed: 'Completado',
    cancelled: 'Cancelado',
  }
  return labels[status] || status
}

// Get status class
const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    confirmed: 'bg-green-500/20 text-green-300 border-green-500/30',
    processing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    completed: 'bg-green-600/20 text-green-400 border-green-600/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
  }
  return classes[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
}

// Get payment status label
const getPaymentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pago Pendiente',
    completed: 'Pagado',
    failed: 'Pago Fallido',
    rejected: 'Pago Rechazado',
    cancelled: 'Pago Cancelado',
  }
  return labels[status] || status
}

// Get payment status class
const getPaymentStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    completed: 'bg-green-500/20 text-green-300 border-green-500/30',
    failed: 'bg-red-500/20 text-red-300 border-red-500/30',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
    cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  }
  return classes[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
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
p, span, div {
  font-family: 'Stack Sans Notch', sans-serif;
}

/* Button styles */
button {
  font-family: 'Stack Sans Notch', sans-serif;
  cursor: pointer;
}
</style>
