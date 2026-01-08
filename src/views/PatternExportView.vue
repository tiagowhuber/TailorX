<template>
  <div class="min-h-screen bg-black">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center space-y-4">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E3F450] mx-auto"></div>
          <p class="text-gray-300 orbitron-variable" style="--orbitron-weight: 400;">
            Cargando información del patrón...
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
            Error
          </p>
          <p class="text-gray-400">{{ error }}</p>
          <button
            @click="router.back()"
            class="px-6 py-2 bg-[#E3F450] text-black rounded-lg hover:bg-[#E3F45080] transition-colors orbitron-variable"
            style="--orbitron-weight: 600;"
          >
            Volver
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else-if="pattern" class="max-w-2xl mx-auto space-y-8">
        <!-- Header -->
        <div>
          <button
            @click="router.back()"
            class="text-[#E3F450] hover:text-[#E3F45080] flex items-center gap-2 mb-4 orbitron-variable"
            style="--orbitron-weight: 500;"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Volver al Patrón
          </button>
          <h1 class="text-4xl font-bold text-white orbitron-variable mb-2" style="--orbitron-weight: 700;">
            Exportar Patrón
          </h1>
          <p class="text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">
            Generar archivo PLT para plotter
          </p>
        </div>

        <!-- Info Card -->
        <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-white/10 pb-4">
             <div>
               <h3 class="text-lg text-white font-semibold">{{ pattern.name }}</h3>
               <p class="text-sm text-gray-400">{{ pattern.design?.name }}</p>
             </div>
             <div class="px-3 py-1 rounded bg-[#E3F450]/20 text-[#E3F450] text-sm capitalize">
               {{ pattern.status === 'draft' ? 'Borrador' : (pattern.status === 'finalized' ? 'Finalizado' : pattern.status) }}
             </div>
          </div>
          
          <div class="space-y-2">
            <h4 class="text-white font-medium">Detalles de Exportación:</h4>
            <ul class="text-gray-300 text-sm space-y-1 list-disc list-inside">
               <li>Formato: PLT (HPGL)</li>
               <li>Dimensiones de Cama: 2500mm x 1300mm</li>
               <li>Unidades: Métrico (mm)</li>
               <li>Escala: 40 unidades/mm</li>
            </ul>
            <p class="text-xs text-gray-500 mt-2">
              Nota: El proceso puede tomar unos segundos. Se generará un archivo .plt o un .zip si hay múltiples camas.
            </p>
          </div>
        </div>

        <!-- Action Button -->
        <div class="flex justify-center pt-4">
          <button
            @click="handleDownload"
            :disabled="downloading"
            class="flex items-center gap-3 px-8 py-4 bg-[#E3F450] text-black text-lg rounded-xl hover:bg-[#E3F450]/90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-[#E3F450]/20"
          >
            <div v-if="downloading" class="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span class="orbitron-variable font-bold">{{ downloading ? 'Generando...' : 'Descargar PLT' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePatternsStore } from '@/stores/patterns'
import type { Pattern } from '@/types/pattern.types'

const route = useRoute()
const router = useRouter()
const patternsStore = usePatternsStore()

const pattern = ref<Pattern | null>(null)
const loading = ref(false)
const downloading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  const patternId = parseInt(route.params.id as string)
  
  if (!patternId || isNaN(patternId)) {
    error.value = 'ID de patrón inválido'
    return
  }

  // Use stored pattern if available and matches ID, otherwise fetch
  if (patternsStore.selectedPattern?.id === patternId) {
    pattern.value = patternsStore.selectedPattern
  } else {
    loading.value = true
    const result = await patternsStore.fetchPatternById(patternId)
    if (result.success && result.data) {
      pattern.value = result.data
    } else {
      error.value = result.message || 'Error al cargar el patrón'
    }
    loading.value = false
  }
})

const handleDownload = async () => {
  if (!pattern.value) return
  
  downloading.value = true
  const result = await patternsStore.downloadPatternPLT(pattern.value.id, pattern.value.name)
  downloading.value = false
  
  if (!result.success) {
    alert(result.message || 'Error al descargar el archivo')
  }
}
</script>
