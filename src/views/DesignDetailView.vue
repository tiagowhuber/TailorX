<template>
  <div class="min-h-screen bg-black text-white"
    :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'top 600px center', backgroundRepeat: 'no-repeat' }">
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Loading State -->
    <div v-if="catalogStore.loading" class="flex justify-center items-center py-20 min-h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lime-400"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="catalogStore.error" class="text-center py-20 min-h-screen flex flex-col items-center justify-center">
      <p class="text-red-400 text-xl mb-4">{{ catalogStore.error }}</p>
      <button
        @click="loadDesign"
        class="px-6 py-3 bg-lime-400 text-black rounded-lg font-bold hover:bg-lime-300 transition-colors orbitron-variable"
        style="--orbitron-weight: 600;"
      >
        Reintentar
      </button>
    </div>

    <!-- Design Detail Content -->
    <main v-else-if="design" class="px-8 py-12 max-w-7xl mx-auto">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors orbitron-variable"
        style="--orbitron-weight: 500;"
      >
        <span class="text-2xl">←</span>
        <span>Volver al catálogo</span>
      </button>

      <!-- Design Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <!-- Image Section -->
        <div>
          <div class="relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-800">
            <img 
              v-if="design.image_url"
              :src="design.image_url" 
              :alt="design.name"
              class="w-full h-full object-cover"
            />
            <!-- Fallback for missing image -->
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-gray-500 text-9xl orbitron-variable" style="--orbitron-weight: 300;">?</span>
            </div>
            <!-- Inactive Badge -->
            <div v-if="!design.is_active" class="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">
              INACTIVO
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="space-y-8">
          <!-- Title and Price -->
          <div>
            <h1 class="text-4xl md:text-5xl font-black mb-4" style="font-family: 'Avenir Next', sans-serif;">
              {{ design.name }}
            </h1>
            <p class="text-3xl font-bold text-lime-400 orbitron-variable" style="--orbitron-weight: 700;">
              {{ formatPrice(design.base_price) }}
            </p>
          </div>

          <!-- Description -->
          <div v-if="design.description" class="space-y-2">
            <h2 class="text-xl font-bold orbitron-variable" style="--orbitron-weight: 600;">
              Descripción
            </h2>
            <p class="text-gray-300 leading-relaxed orbitron-variable" style="--orbitron-weight: 400;">
              {{ design.description }}
            </p>
          </div>

          <!-- FreeSewing Pattern Info -->
          <div v-if="design.freesewing_pattern" class="space-y-2">
            <h2 class="text-xl font-bold orbitron-variable" style="--orbitron-weight: 600;">
              Patrón Base
            </h2>
            <p class="text-gray-300 orbitron-variable" style="--orbitron-weight: 400;">
              {{ design.freesewing_pattern }}
            </p>
          </div>

          <!-- Required Measurements -->
          <div v-if="measurements.length > 0" class="space-y-4">
            <h2 class="text-xl font-bold orbitron-variable" style="--orbitron-weight: 600;">
              Medidas Requeridas
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div 
                v-for="measurement in measurements" 
                :key="measurement.id"
                class="px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <p class="font-semibold text-white orbitron-variable" style="--orbitron-weight: 500;">
                  {{ measurement.measurementType?.name }}
                </p>
                <p v-if="measurement.measurementType?.description" class="text-sm text-gray-400 mt-1">
                  {{ measurement.measurementType.description }}
                </p>
                <p class="text-xs text-lime-400 mt-1">
                  mm
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4 pt-4">
            <button
              @click="customizeDesign"
              class="w-full px-8 py-4 bg-lime-400 text-black rounded-lg font-bold hover:bg-lime-300 transition-colors orbitron-variable text-lg"
              style="--orbitron-weight: 700;"
              :disabled="!design.is_active"
              :class="!design.is_active ? 'opacity-50 cursor-not-allowed' : ''"
            >
              {{ design.is_active ? 'PERSONALIZAR DISEÑO' : 'DISEÑO NO DISPONIBLE' }}
            </button>
            
            <button
              v-if="design.is_active"
              @click="viewMeasurements"
              class="w-full px-8 py-4 bg-transparent border-2 border-lime-400 text-lime-400 rounded-lg font-bold hover:bg-lime-400/10 transition-colors orbitron-variable text-lg"
              style="--orbitron-weight: 600;"
            >
              VER MIS MEDIDAS
            </button>
          </div>

          <!-- Status Info -->
          <div class="pt-4 border-t border-gray-800">
            <p class="text-sm text-gray-500 orbitron-variable" style="--orbitron-weight: 400;">
              Cada prenda se fabrica a medida según tus medidas exactas.
            </p>
          </div>
        </div>
      </div>

      <!-- Additional Information Section -->
      <div class="border-t border-gray-800 pt-12">
        <h2 class="text-3xl font-black mb-8" style="font-family: 'Avenir Next', sans-serif;">
          ¿CÓMO FUNCIONA?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="space-y-4">
            <div class="w-16 h-16 rounded-full bg-lime-400/20 flex items-center justify-center">
              <span class="text-lime-400 text-2xl font-bold orbitron-variable" style="--orbitron-weight: 700;">1</span>
            </div>
            <h3 class="text-xl font-bold orbitron-variable" style="--orbitron-weight: 600;">
              Ingresa tus medidas
            </h3>
            <p class="text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">
              Proporciona tus medidas exactas o usa nuestra herramienta de medición asistida por IA.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="space-y-4">
            <div class="w-16 h-16 rounded-full bg-lime-400/20 flex items-center justify-center">
              <span class="text-lime-400 text-2xl font-bold orbitron-variable" style="--orbitron-weight: 700;">2</span>
            </div>
            <h3 class="text-xl font-bold orbitron-variable" style="--orbitron-weight: 600;">
              Personaliza el diseño
            </h3>
            <p class="text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">
              Elige tus opciones de personalización y visualiza el resultado.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="space-y-4">
            <div class="w-16 h-16 rounded-full bg-lime-400/20 flex items-center justify-center">
              <span class="text-lime-400 text-2xl font-bold orbitron-variable" style="--orbitron-weight: 700;">3</span>
            </div>
            <h3 class="text-xl font-bold orbitron-variable" style="--orbitron-weight: 600;">
              Recibe tu prenda
            </h3>
            <p class="text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">
              Tu prenda se fabrica a medida y se entrega directamente a tu puerta.
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Gradient Spotlight Effect -->
    <div class="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[1200px] h-[400px] bg-gradient-radial from-lime-400/20 via-yellow-300/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

    <!-- Pattern Generation Modal -->
    <PatternGenerationModal
      :is-open="modalOpen"
      :state="modalState"
      :message="modalMessage"
      :missing-measurements="modalMissingMeasurements"
      :on-close="handleModalClose"
      :on-view-pattern="handleViewPattern"
      :on-retry="handleRetryGeneration"
      :on-add-measurements="handleAddMeasurements"
      :allow-backdrop-close="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import PatternGenerationModal from '@/components/PatternGenerationModal.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useAuthStore } from '@/stores/auth'
import { usePatternsStore } from '@/stores/patterns'
import type { DesignMeasurement } from '@/types/design.types'
import bgImage from '@/assets/backgrounds/elemento-amarillo.png'

const catalogStore = useCatalogStore()
const authStore = useAuthStore()
const patternsStore = usePatternsStore()
const router = useRouter()
const route = useRoute()

const measurements = ref<DesignMeasurement[]>([])

// Modal state
const modalOpen = ref(false)
const modalState = ref<'generating' | 'success' | 'error' | 'missing-measurements'>('generating')
const modalMessage = ref('')
const modalMissingMeasurements = ref<Array<{
  id: number
  name: string
  freesewing_key: string
  unit: string
}>>([])
const generatedPatternId = ref<number | null>(null)

// Get design from store
const design = computed(() => catalogStore.selectedDesign)

onMounted(async () => {
  await loadDesign()
})

const loadDesign = async () => {
  const designId = parseInt(route.params.id as string)
  if (!designId) {
    router.push('/catalogo')
    return
  }

  const result = await catalogStore.fetchDesignById(designId)
  
  if (result.success) {
    // Load measurements for this design
    const measurementsResult = await catalogStore.fetchDesignMeasurements(designId)
    if (measurementsResult.success) {
      measurements.value = measurementsResult.data || []
    }
  }
}

const goBack = () => {
  router.push('/catalogo')
}

const customizeDesign = async () => {
  if (!design.value?.is_active) return
  
  // Check if user is logged in
  if (!authStore.user) {
    // Redirect to login with return URL
    router.push({ path: '/login', query: { redirect: `/catalogo/${design.value.id}` } })
    return
  }

  // Open modal and start generation
  modalOpen.value = true
  modalState.value = 'generating'
  modalMessage.value = 'Generando tu patrón personalizado...'

  // Generate the pattern
  const result = await patternsStore.generatePattern(authStore.user.id, design.value.id)

  if (result.success && result.data) {
    // Success!
    generatedPatternId.value = result.data.id
    modalState.value = 'success'
    modalMessage.value = `Tu patrón "${result.data.name}" ha sido generado exitosamente.`
  } else if (result.missing_measurements) {
    // Missing measurements
    modalState.value = 'missing-measurements'
    modalMessage.value = result.message || 'Faltan medidas requeridas para este diseño.'
    modalMissingMeasurements.value = result.missing_measurements
  } else {
    // Error
    modalState.value = 'error'
    modalMessage.value = result.message || 'Ocurrió un error al generar el patrón.'
  }
}

const handleModalClose = () => {
  modalOpen.value = false
  // Reset modal state after animation
  setTimeout(() => {
    modalState.value = 'generating'
    modalMessage.value = ''
    modalMissingMeasurements.value = []
    generatedPatternId.value = null
  }, 300)
}

const handleViewPattern = () => {
  if (generatedPatternId.value) {
    router.push(`/patrones/${generatedPatternId.value}`)
  }
  handleModalClose()
}

const handleRetryGeneration = () => {
  handleModalClose()
  // Retry after modal closes
  setTimeout(() => {
    customizeDesign()
  }, 400)
}

const handleAddMeasurements = () => {
  handleModalClose()
  // Navigate to measurements page
  router.push('/medidas')
}

const viewMeasurements = () => {
  // Check if user is logged in
  if (!authStore.user) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  router.push('/medidas')
}

// Format price as Chilean Peso
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price)
}
</script>

<style scoped>
/* Gradient radial utility */
.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}
</style>
