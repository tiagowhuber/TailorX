<template>
  <div class="min-h-screen bg-black">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center space-y-4">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lime-400 mx-auto"></div>
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
            class="px-6 py-2 bg-lime-400 text-black rounded-lg hover:bg-lime-300 transition-colors orbitron-variable"
            style="--orbitron-weight: 600;"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>

      <!-- Pattern Display -->
      <div v-else-if="pattern" class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <button
              @click="router.back()"
              class="text-lime-400 hover:text-lime-300 flex items-center gap-2 mb-4 orbitron-variable"
              style="--orbitron-weight: 500;"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Volver
            </button>
            <h1 class="text-4xl font-bold text-white orbitron-variable mb-2" style="--orbitron-weight: 700;">
              {{ pattern.name }}
            </h1>
            <p class="text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">
              Diseño: {{ pattern.design?.name }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="downloadSVG"
              class="px-4 py-2 bg-lime-400 text-black rounded-lg hover:bg-lime-300 transition-colors orbitron-variable"
              style="--orbitron-weight: 600;"
            >
              Descargar SVG
            </button>
          </div>
        </div>

        <!-- Pattern Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

const route = useRoute()
const router = useRouter()
const patternsStore = usePatternsStore()

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
</script>
