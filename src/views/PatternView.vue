<template>
  <div class="min-h-screen bg-black">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center space-y-4">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E3F450] mx-auto"></div>
          <p class="text-gray-300 orbitron-variable" style="--orbitron-weight: 400;">
            Cargando patrón...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <p class="text-xl text-white orbitron-variable" style="--orbitron-weight: 600;">
            Error al cargar el patrón
          </p>
          <p class="text-gray-400">{{ error }}</p>
          <button
            @click="router.push({ name: 'catalogo' })"
            class="px-6 py-2 bg-[#E3F450] text-black rounded-lg hover:bg-[#E3F45080] transition-colors orbitron-variable"
            style="--orbitron-weight: 600;"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>

      <!-- Pattern Display -->
      <div v-else-if="pattern" class="space-y-4 sm:space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <button
              @click="router.back()"
              class="text-[#E3F450] hover:text-[#E3F45080] flex items-center gap-2 mb-3 sm:mb-4 orbitron-variable text-sm sm:text-base"
              style="--orbitron-weight: 500;"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Volver
            </button>
            <h1 class="text-3xl sm:text-4xl font-bold text-white orbitron-variable mb-2" style="--orbitron-weight: 700;">
              {{ pattern.name }}
            </h1>
            <p class="text-sm sm:text-base text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">
              Diseño: {{ pattern.design?.name }}
            </p>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button
              v-if="!cartStore.isInCart(pattern.id)"
              @click="addToCart"
              class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#E3F450] text-black rounded-lg hover:bg-[#E3F450]/80 transition-colors orbitron-variable flex items-center justify-center gap-2 text-sm sm:text-base"
              style="--orbitron-weight: 600;"
            >
              <ShoppingCart class="w-4 h-4" />
              <span class="hidden sm:inline">Agregar al Carrito</span>
              <span class="sm:hidden">Carrito</span>
            </button>
            <button
              v-else-if="cartStore.isInCart(pattern.id)"
              @click="viewCart"
              class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#E3F450] text-black rounded-lg hover:bg-[#E3F450]/80 transition-colors orbitron-variable flex items-center justify-center gap-2 text-sm sm:text-base"
              style="--orbitron-weight: 600;"
            >
              <ShoppingCart class="w-4 h-4" />
              <span class="hidden sm:inline">Ver Carrito</span>
              <span class="sm:hidden">Ver</span>
            </button>
            <button
              @click="downloadSVG"
              class="px-3 sm:px-4 py-2 bg-[#E3F450] text-black rounded-lg hover:bg-[#E3F45080] transition-colors orbitron-variable text-sm sm:text-base whitespace-nowrap"
              style="--orbitron-weight: 600;"
            >
              <span class="hidden sm:inline">Descargar SVG</span>
              <span class="sm:hidden">SVG</span>
            </button>
          </div>
        </div>

        <!-- Pattern Info -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <p class="text-gray-400 text-sm orbitron-variable" style="--orbitron-weight: 400;">Estado</p>
            <p class="text-white text-lg font-semibold orbitron-variable capitalize" style="--orbitron-weight: 600;">
              {{ pattern.status }}
            </p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <p class="text-gray-400 text-sm orbitron-variable" style="--orbitron-weight: 400;">Tamaño</p>
            <p class="text-white text-lg font-semibold orbitron-variable" style="--orbitron-weight: 600;">
              {{ pattern.svg_size_kb }} KB
            </p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <p class="text-gray-400 text-sm orbitron-variable" style="--orbitron-weight: 400;">Creado</p>
            <p class="text-white text-lg font-semibold orbitron-variable" style="--orbitron-weight: 600;">
              {{ formatDate(pattern.created_at) }}
            </p>
          </div>
        </div>

        <!-- SVG Display -->
        <div class="bg-white rounded-lg p-8 overflow-auto" style="min-height: 600px;">
          <div v-html="pattern.svg_data" class="w-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePatternsStore } from '@/stores/patterns'
import { useCartStore } from '@/stores/cart'
import { ShoppingCart } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const patternsStore = usePatternsStore()
const cartStore = useCartStore()

const pattern = ref(patternsStore.selectedPattern)
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  const patternId = parseInt(route.params.id as string)
  
  if (!patternId || isNaN(patternId)) {
    error.value = 'ID de patrón inválido'
    return
  }

  loading.value = true
  const result = await patternsStore.fetchPatternById(patternId)
  
  if (result.success && result.data) {
    pattern.value = result.data
  } else {
    error.value = result.message || 'Error al cargar el patrón'
  }
  
  loading.value = false
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const downloadSVG = () => {
  if (!pattern.value?.svg_data) return

  const blob = new Blob([pattern.value.svg_data], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${pattern.value.name}.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const addToCart = async () => {
  if (!pattern.value) return
  
  const result = await cartStore.addToCart(pattern.value)
  if (result.success) {
    console.log(result.message)
  } else {
    alert(result.message)
  }
}

const viewCart = () => {
  router.push({ name: 'cart' })
}
</script>
