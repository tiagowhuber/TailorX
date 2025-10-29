<template>
  <!-- Modal Overlay -->
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    @click.self="handleBackdropClick"
  >
    <!-- Modal Content -->
    <div class="bg-gray-900 rounded-lg shadow-2xl max-w-lg w-full mx-4 overflow-hidden border border-gray-800">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-800">
        <h2 class="text-2xl font-bold orbitron-variable" style="--orbitron-weight: 700;">
          {{ title }}
        </h2>
      </div>

      <!-- Body -->
      <div class="px-6 py-6">
        <!-- Generating Progress State -->
        <div v-if="state === 'generating'" class="text-center space-y-4">
          <div class="flex justify-center">
            <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lime-400"></div>
          </div>
          <p class="text-gray-300 orbitron-variable" style="--orbitron-weight: 400;">
            {{ message || 'Generando tu patrón personalizado...' }}
          </p>
          <p class="text-sm text-gray-500 orbitron-variable" style="--orbitron-weight: 300;">
            Esto puede tardar unos segundos
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="state === 'success'" class="space-y-4">
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-lime-400/20 flex items-center justify-center">
              <svg class="w-10 h-10 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <p class="text-center text-xl font-semibold text-white orbitron-variable" style="--orbitron-weight: 600;">
            ¡Patrón Generado!
          </p>
          <p class="text-center text-gray-300 orbitron-variable" style="--orbitron-weight: 400;">
            {{ message || 'Tu patrón personalizado ha sido creado exitosamente.' }}
          </p>
        </div>

        <!-- Error State -->
        <div v-else-if="state === 'error'" class="space-y-4">
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <p class="text-center text-xl font-semibold text-white orbitron-variable" style="--orbitron-weight: 600;">
            Error al Generar
          </p>
          <p class="text-center text-gray-300 orbitron-variable" style="--orbitron-weight: 400;">
            {{ message || 'Ocurrió un error al generar el patrón.' }}
          </p>
        </div>

        <!-- Missing Measurements State -->
        <div v-else-if="state === 'missing-measurements'" class="space-y-4">
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <svg class="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          <p class="text-center text-xl font-semibold text-white orbitron-variable" style="--orbitron-weight: 600;">
            Medidas Faltantes
          </p>
          <p class="text-center text-gray-300 mb-4 orbitron-variable" style="--orbitron-weight: 400;">
            Para generar este patrón, necesitas completar las siguientes medidas:
          </p>
          
          <!-- Missing Measurements List -->
          <div class="bg-gray-800/50 rounded-lg p-4 max-h-60 overflow-y-auto">
            <ul class="space-y-2">
              <li 
                v-for="measurement in missingMeasurements" 
                :key="measurement.id"
                class="flex items-start gap-3"
              >
                <div class="w-2 h-2 rounded-full bg-lime-400 mt-2 flex-shrink-0"></div>
                <div>
                  <p class="font-semibold text-white orbitron-variable" style="--orbitron-weight: 500;">
                    {{ measurement.name }}
                  </p>
                  <p class="text-sm text-gray-400">mm</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-800 flex gap-3 justify-end">
        <!-- Generating state buttons -->
        <template v-if="state === 'generating'">
          <!-- No buttons during generation -->
        </template>

        <!-- Success state buttons -->
        <template v-else-if="state === 'success'">
          <button
            @click="handleClose"
            class="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors orbitron-variable"
            style="--orbitron-weight: 500;"
          >
            Cerrar
          </button>
          <button
            v-if="onViewPattern"
            @click="handleViewPattern"
            class="px-6 py-2 bg-lime-400 text-black rounded-lg hover:bg-lime-300 transition-colors orbitron-variable"
            style="--orbitron-weight: 600;"
          >
            Ver Patrón
          </button>
        </template>

        <!-- Error state buttons -->
        <template v-else-if="state === 'error'">
          <button
            @click="handleClose"
            class="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors orbitron-variable"
            style="--orbitron-weight: 500;"
          >
            Cerrar
          </button>
          <button
            v-if="onRetry"
            @click="handleRetry"
            class="px-6 py-2 bg-lime-400 text-black rounded-lg hover:bg-lime-300 transition-colors orbitron-variable"
            style="--orbitron-weight: 600;"
          >
            Reintentar
          </button>
        </template>

        <!-- Missing measurements state buttons -->
        <template v-else-if="state === 'missing-measurements'">
          <button
            @click="handleClose"
            class="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors orbitron-variable"
            style="--orbitron-weight: 500;"
          >
            Cancelar
          </button>
          <button
            @click="handleAddMeasurements"
            class="px-6 py-2 bg-lime-400 text-black rounded-lg hover:bg-lime-300 transition-colors orbitron-variable"
            style="--orbitron-weight: 600;"
          >
            Agregar Medidas
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface MissingMeasurement {
  id: number
  name: string
  freesewing_key: string
  unit: string
}

interface Props {
  isOpen: boolean
  state: 'generating' | 'success' | 'error' | 'missing-measurements'
  message?: string
  missingMeasurements?: MissingMeasurement[]
  onClose?: () => void
  onViewPattern?: () => void
  onRetry?: () => void
  onAddMeasurements?: () => void
  allowBackdropClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowBackdropClose: false,
})

const title = computed(() => {
  switch (props.state) {
    case 'generating':
      return 'Generando Patrón'
    case 'success':
      return 'Éxito'
    case 'error':
      return 'Error'
    case 'missing-measurements':
      return 'Medidas Requeridas'
    default:
      return 'Patrón'
  }
})

const handleClose = () => {
  if (props.onClose) {
    props.onClose()
  }
}

const handleBackdropClick = () => {
  if (props.allowBackdropClose && props.state !== 'generating') {
    handleClose()
  }
}

const handleViewPattern = () => {
  if (props.onViewPattern) {
    props.onViewPattern()
  }
}

const handleRetry = () => {
  if (props.onRetry) {
    props.onRetry()
  }
}

const handleAddMeasurements = () => {
  if (props.onAddMeasurements) {
    props.onAddMeasurements()
  }
}
</script>

<style scoped>
/* Ensure modal is above everything */
.z-50 {
  z-index: 50;
}
</style>
