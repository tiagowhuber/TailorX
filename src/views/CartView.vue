<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="relative pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Sidebar -->
          <AccountSidebar active-section="cart" />

          <!-- Main Content Area -->
          <main class="flex-1 min-w-0">
            <!-- Header -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h1 class="text-3xl font-bold text-white">Mi Carrito</h1>
                  <p class="text-gray-400 text-sm mt-1">
                    {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'artículo' : 'artículos' }} en tu carrito
                  </p>
                </div>
                <Button
                  v-if="cartStore.itemCount > 0"
                  @click="clearCartConfirm"
                  variant="outline"
                  class="text-red-400 border-red-400/50 hover:bg-red-500/50"
                >
                  <Trash2 class="mr-2 h-4 w-4" />
                  Vaciar Carrito
                </Button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="cartStore.itemCount === 0" class="text-center py-20">
              <ShoppingCart class="mx-auto h-24 w-24 text-gray-600 mb-6" />
              <h3 class="text-2xl font-semibold text-gray-400 mb-2">
                Tu carrito está vacío
              </h3>
              <p class="text-gray-500 mb-6">
                Agrega patrones finalizados para comenzar tu orden
              </p>
              <Button
                @click="router.push({ name: 'patterns' })"
                variant="outline"
                class="bg-[#E3F450] border-[#E3F450] text-black hover:bg-[#E3F450]/80"
              >
                <FileText class="mr-2 h-4 w-4" />
                Ver Mis Patrones
              </Button>
            </div>

            <!-- Cart Items -->
            <div v-else class="space-y-6">
              <!-- Cart Items List -->
              <div class="space-y-4">
                <Card
                  v-for="item in cartStore.cartItems"
                  :key="item.patternId"
                  class="bg-white/5 border-white/10 hover:border-white/20 transition-all"
                >
                  <CardContent class="p-6">
                    <div class="flex gap-6">
                      <!-- Image -->
                      <div class="flex-shrink-0">
                        <div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-800">
                          <img
                            v-if="item.imageUrl"
                            :src="item.imageUrl"
                            :alt="item.designName"
                            class="w-full h-full object-cover"
                          />
                          <div v-else class="w-full h-full flex items-center justify-center">
                            <FileText class="w-10 h-10 text-gray-500" />
                          </div>
                        </div>
                      </div>

                      <!-- Details -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                          <div class="flex-1">
                            <h3 class="text-lg font-semibold text-white mb-1">
                              {{ item.patternName }}
                            </h3>
                            <p class="text-sm text-gray-400">
                              Diseño: {{ item.designName }}
                            </p>
                            <!-- Warning for archived patterns -->
                            <div v-if="item.status === 'archived'" class="mt-2">
                              <div class="flex items-center gap-2 text-yellow-400 text-sm">
                                <AlertTriangle class="w-4 h-4" />
                                <span>Este patrón ha sido archivado</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            @click="removeItemConfirm(item)"
                            variant="ghost"
                            size="icon"
                            class="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <X class="h-5 w-5" />
                          </Button>
                        </div>

                        <!-- Price and Quantity Controls -->
                        <div class="flex items-center justify-between mt-4">
                          <!-- Quantity Controls -->
                          <div class="flex items-center gap-3">
                            <span class="text-sm text-gray-400">Cantidad:</span>
                            <div class="flex items-center gap-2 bg-white/10 rounded-lg">
                              <Button
                                @click="decrementQuantity(item)"
                                variant="ghost"
                                size="icon"
                                class="h-8 w-8 text-white hover:bg-white/10"
                              >
                                <Minus class="h-4 w-4" />
                              </Button>
                              <span class="text-white font-semibold min-w-[2rem] text-center">
                                {{ item.quantity }}
                              </span>
                              <Button
                                @click="incrementQuantity(item)"
                                variant="ghost"
                                size="icon"
                                class="h-8 w-8 text-white hover:bg-white/10"
                              >
                                <Plus class="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <!-- Price -->
                          <div class="text-right">
                            <p class="text-sm text-gray-400">Precio unitario</p>
                            <p class="text-lg font-bold text-[#E3F450]">
                              {{ cartStore.formatPrice(item.price) }}
                            </p>
                            <p v-if="item.quantity > 1" class="text-sm text-gray-400 mt-1">
                              Subtotal: {{ cartStore.formatPrice(item.price * item.quantity) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Cart Summary -->
              <Card class="bg-white/5 border-white/10 sticky bottom-4">
                <CardContent class="p-6">
                  <div class="space-y-4">
                    <div class="flex items-center justify-between text-lg">
                      <span class="text-gray-400">Total:</span>
                      <span class="text-2xl font-bold text-[#E3F450]">
                        {{ cartStore.formatPrice(cartStore.totalAmount) }}
                      </span>
                    </div>

                    <Separator class="bg-white/10" />

                    <div class="flex justify-center">
                      <Button
                        @click="proceedToCheckout"
                        class="w-full max-w-md bg-[#E3F450] text-black hover:bg-[#E3F450]/80"
                        :disabled="hasArchivedItems || processingCheckout"
                      >
                        <span v-if="processingCheckout">Procesando...</span>
                        <span v-else>Proceder al Checkout</span>
                      </Button>
                    </div>

                    <p v-if="hasArchivedItems" class="text-sm text-yellow-400 text-center">
                      Elimina los patrones archivados para continuar
                    </p>
                    <p v-else class="text-sm text-gray-400 text-center">
                      Los precios están congelados al momento de agregar al carrito
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Remove Item Confirmation Dialog -->
    <Dialog :open="showRemoveDialog" @update:open="showRemoveDialog = $event">
      <DialogContent class="bg-black/95 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>Eliminar del Carrito</DialogTitle>
          <DialogDescription class="text-gray-400">
            ¿Estás seguro de que quieres eliminar "{{ itemToRemove?.patternName }}" del carrito?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            @click="showRemoveDialog = false"
            variant="outline"
            class="border-white/20 text-black hover:bg-white/50"
          >
            Cancelar
          </Button>
          <Button
            @click="confirmRemoveItem"
            variant="destructive"
            class="bg-red-500 hover:bg-red-600"
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Clear Cart Confirmation Dialog -->
    <Dialog :open="showClearDialog" @update:open="showClearDialog = $event">
      <DialogContent class="bg-black/95 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>Vaciar Carrito</DialogTitle>
          <DialogDescription class="text-gray-400">
            ¿Estás seguro de que quieres eliminar todos los artículos del carrito?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            @click="showClearDialog = false"
            variant="outline"
            class="border-white/20 text-black hover:bg-white/50"
          >
            Cancelar
          </Button>
          <Button
            @click="confirmClearCart"
            variant="destructive"
            class="bg-red-500 hover:bg-red-600"
          >
            Vaciar Carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { usePaymentStore } from '@/stores/payment'
import { 
  ShoppingCart,
  FileText, 
  Trash2,
  Plus,
  Minus,
  X,
  AlertTriangle
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import NavigationBar from '@/components/NavigationBar.vue'
import AccountSidebar from '@/components/AccountSidebar.vue'
import type { CartItem } from '@/types/cart.types'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const paymentStore = usePaymentStore()

const showRemoveDialog = ref(false)
const showClearDialog = ref(false)
const itemToRemove = ref<CartItem | null>(null)
const processingCheckout = ref(false)

// Computed
const hasArchivedItems = computed(() => {
  return cartStore.cartItems.some(item => item.status === 'archived')
})

// Methods
const incrementQuantity = (item: CartItem) => {
  cartStore.updateQuantity(item.patternId, item.quantity + 1)
}

const decrementQuantity = (item: CartItem) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.patternId, item.quantity - 1)
  }
}

const removeItemConfirm = (item: CartItem) => {
  itemToRemove.value = item
  showRemoveDialog.value = true
}

const confirmRemoveItem = () => {
  if (itemToRemove.value) {
    cartStore.removeFromCart(itemToRemove.value.patternId)
    itemToRemove.value = null
  }
  showRemoveDialog.value = false
}

const clearCartConfirm = () => {
  showClearDialog.value = true
}

const confirmClearCart = () => {
  cartStore.clearCart()
  showClearDialog.value = false
}

const proceedToCheckout = async () => {
  if (!authStore.user || !authStore.user.id) {
    alert('Por favor inicia sesión para continuar')
    router.push('/login')
    return
  }

  if (hasArchivedItems.value) {
    alert('Por favor elimina los patrones archivados antes de continuar')
    return
  }

  if (cartStore.itemCount === 0) {
    return
  }

  processingCheckout.value = true

  try {
    const response = await paymentStore.createPayment(
      cartStore.cartItems,
      authStore.user.id
    )

    if (response.success && response.data) {
      // Redirect to Webpay
      paymentStore.redirectToPayment(response.data.url, response.data.token)
    } else {
      alert(response.message || 'Error al crear el pago. Por favor intenta nuevamente.')
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    alert('Error al procesar el pago. Por favor intenta nuevamente.')
  } finally {
    processingCheckout.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
