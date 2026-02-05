<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDiscountCodesStore } from '@/stores/discountCodes'
import AccountSidebar from '@/components/AccountSidebar.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import { 
  Ticket, 
  Copy, 
  Check, 
  Clock, 
  Percent, 
  AlertCircle,
  Plus
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuthStore } from '@/stores/auth'

const discountStore = useDiscountCodesStore()
const authStore = useAuthStore()
const copiedCode = ref<string | null>(null)
const redeemCodeInput = ref('')
const redeemError = ref<string | null>(null)
const redeemSuccess = ref<string | null>(null)
const isRedeemDialogOpen = ref(false)
const isRedeeming = ref(false)

onMounted(() => {
  if (authStore.isAuthenticated) {
    discountStore.fetchUserCodes()
  }
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Indefinido'
  return new Date(dateString).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    copiedCode.value = code
    setTimeout(() => {
      copiedCode.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const handleRedeemCode = async () => {
  if (!redeemCodeInput.value.trim()) return
  
  isRedeeming.value = true
  redeemError.value = null
  redeemSuccess.value = null
  
  try {
    const result = await discountStore.redeemCode(redeemCodeInput.value.trim())
    if (result.success) {
      redeemSuccess.value = '¡Código canjeado con éxito!'
      redeemCodeInput.value = ''
      setTimeout(() => {
        isRedeemDialogOpen.value = false
        redeemSuccess.value = null
      }, 1500)
    } else {
      redeemError.value = result.message || 'Error al canjear el código'
    }
  } catch (error) {
    redeemError.value = 'Ocurrió un error inesperado'
  } finally {
    isRedeeming.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="relative pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Sidebar -->
          <AccountSidebar active-section="discount-codes" :show-mobile="false" />

          <!-- Main Content Area -->
          <main class="flex-1 min-w-0">
            <!-- Header -->
            <div
              class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
              <div>
                <div class="inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider mb-4 rounded-md" style="background-color: #E3F450; color: black;">
                  Mis Beneficios
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 font-head">CÓDIGOS DE DESCUENTO</h1>
                <p class="text-gray-400 text-sm font-body">
                  Gestiona tus cupones y descuentos exclusivos
                </p>
              </div>

              <Dialog v-model:open="isRedeemDialogOpen">
                <DialogTrigger as-child>
                  <Button class="bg-[#E3F450] text-black hover:bg-[#E3F450]/90 font-bold">
                    <Plus class="mr-2 h-4 w-4" />
                    Canjear Código
                  </Button>
                </DialogTrigger>
                <DialogContent class="bg-black/90 border-white/20 text-white sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle class="text-xl font-bold text-white">Canjear Código</DialogTitle>
                    <DialogDescription class="text-gray-400">
                      Ingresa el código promocional que deseas agregar a tu cuenta.
                    </DialogDescription>
                  </DialogHeader>
                  <div class="grid gap-4 py-4">
                    <div class="flex flex-col gap-2">
                      <Input
                        v-model="redeemCodeInput"
                        placeholder="Ej: BIENVENIDA10"
                        class="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#E3F450] focus:ring-[#E3F450]"
                        @keyup.enter="handleRedeemCode"
                      />
                      <p v-if="redeemError" class="text-red-400 text-sm">{{ redeemError }}</p>
                      <p v-if="redeemSuccess" class="text-green-400 text-sm">{{ redeemSuccess }}</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      @click="handleRedeemCode" 
                      :disabled="isRedeeming || !redeemCodeInput"
                      class="bg-[#E3F450] text-black hover:bg-[#E3F450]/90 w-full sm:w-auto"
                    >
                      <span v-if="isRedeeming">Canjeando...</span>
                      <span v-else>Canjear</span>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <!-- Loading State -->
            <div v-if="discountStore.loading" class="flex justify-center py-20">
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E3F450]"></div>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="discountStore.codes.length === 0"
              class="text-center py-20"
            >
              <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-white/5 border border-white/10 mb-6">
                <Ticket class="h-12 w-12 text-gray-500" />
              </div>
              <h3 class="text-2xl font-semibold text-gray-400 mb-2 font-head">
                No tienes códigos disponibles
              </h3>
              <p class="text-gray-500 mb-6 font-body">
                Los códigos promocionales que adquieras aparecerán aquí
              </p>
            </div>

            <!-- Codes Grid -->
            <div v-else class="grid gap-6 md:grid-cols-2">
              <div
                v-for="(code) in discountStore.codes"
                :key="code.id"
                class="relative group"
              >
                <div 
                  class="h-full bg-white/5 border border-white/10 rounded-lg p-6 hover:border-[#E3F450]/50 transition-all duration-300 flex flex-col"
                  :class="{ 'opacity-60': !code.is_active }"
                >
                  <!-- Status Badge -->
                  <div class="absolute top-4 right-4">
                    <Badge :class="code.is_active ? 'bg-[#E3F450]/20 text-[#E3F450] border-[#E3F450]/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'">
                      {{ code.is_active ? 'Activo' : 'Inactivo' }}
                    </Badge>
                  </div>

                  <!-- Icon & Value -->
                  <div class="flex items-start gap-4 mb-6">
                    <div class="p-3 rounded-lg bg-[#E3F450]/10 border border-[#E3F450]/20">
                      <Percent class="w-6 h-6 text-[#E3F450]" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-400 font-body mb-1">Valor del Descuento</p>
                      <p class="text-2xl font-bold text-white font-body">
                        {{ code.discount_type === 'percentage' ? code.value + '% OFF' : '$' + code.value + ' OFF' }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ code.applies_to_design_id ? 'En diseño específico' : 'En el total del pedido' }}
                      </p>
                      <p v-if="code.max_discount_amount" class="text-xs text-[#E3F450] mt-1">
                        Tope máximo: ${{ Number(code.max_discount_amount).toLocaleString('es-CL') }}
                      </p>
                    </div>
                  </div>

                  <!-- Code Display -->
                  <div class="bg-black/40 rounded-md p-3 border border-white/5 flex items-center justify-between mb-6 group-hover:border-white/10 transition-colors">
                    <code class="text-lg font-mono font-bold text-[#E3F450] tracking-wider">{{ code.code }}</code>
                    <button 
                      @click="copyCode(code.code)"
                      class="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                      title="Copiar código"
                    >
                      <Copy v-if="copiedCode !== code.code" class="w-4 h-4" />
                      <Check v-else class="w-4 h-4 text-green-500" />
                    </button>
                  </div>

                  <!-- Footer Info -->
                  <div class="mt-auto pt-4 border-t border-white/10 space-y-2 text-sm text-gray-400">
                    <div v-if="code.starts_at" class="flex items-center gap-2">
                      <Clock class="w-4 h-4" />
                      <span>Desde: {{ formatDate(code.starts_at) }}</span>
                    </div>
                    <div v-if="code.expires_at" class="flex items-center gap-2">
                      <AlertCircle class="w-4 h-4" />
                      <span>Vence: {{ formatDate(code.expires_at) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure fonts are applied if not global */
.font-head {
  font-family: 'Stack Sans Notch', sans-serif; /* Fallback to project default */
}
.font-body {
  font-family: 'Stack Sans Notch', sans-serif;
}
</style>
