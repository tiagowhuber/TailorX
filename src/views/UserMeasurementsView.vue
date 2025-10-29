<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="relative pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Mobile Navigation Bar (horizontal) -->
        <div class="lg:hidden mb-6 overflow-x-auto">
          <div class="flex gap-2 min-w-max pb-2">
            <button
              @click="router.push({ name: 'account' })"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              General
            </button>
            <button
              @click="router.push({ name: 'catalogo' })"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              Ver Catálogo
            </button>
            <button
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border',
                'bg-white text-black border-white'
              ]"
            >
              Mis Medidas
            </button>
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              Mis Pedidos
            </button>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Sidebar (Desktop) -->
          <aside class="hidden lg:block w-50 flex-shrink-0 lg:mt-5">
            <nav class="space-y-1">
              <button
                @click="router.push({ name: 'account' })"
                class="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors cursor-pointer"
              >
                General
              </button>
              
              <Separator class="bg-white/10 my-4" />
              
              <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Acciones Rápidas
              </div>
              
              <button
                :class="[
                  'w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border cursor-pointer',
                  'bg-white text-black border-white'
                ]"
              >
                <Ruler class="inline-block mr-2 h-4 w-4 text-black" />
                Mis Medidas
              </button>
              
              <button
                class="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ShoppingBag class="inline-block mr-2 h-4 w-4 text-[#E3F450]" />
                Mis Pedidos
              </button>
              
              <Separator class="bg-white/10 my-4" />
              
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut class="inline-block mr-2 h-4 w-4 text-[#E3F450]" />
                Cerrar Sesión
              </button>
            </nav>
          </aside>

          <!-- Main Content Area -->
          <main class="flex-1 min-w-0">
      <Card class="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
        <CardHeader class="pb-4">
          <div class="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle class="text-4xl font-black text-white mb-1">
                MIS MEDIDAS
              </CardTitle>
              <CardDescription class="text-gray-400 font-normal text-base">
                Gestiona tus medidas corporales para confección personalizada
              </CardDescription>
            </div>
            <div class="flex gap-3">
              <Button 
                @click="router.push({ name: 'ai-measurements' })"
                variant="outline"
                class="px-6 py-3 border-yellow-500/20 text-black hover:bg-white/30"
              >
                <Sparkles class="mr-2 h-5 w-5" />
                Obtener con IA
              </Button>
              <Button 
                v-if="!isEditMode"
                @click="enterEditMode"
                variant="outline"
                class="px-6 py-3 border-white/20 text-black hover:bg-white/30"
              >
                <Edit class="mr-2 h-5 w-5" />
                Editar
              </Button>
              <template v-else>
                <Button 
                  @click="cancelEdit"
                  variant="outline"
                  class="px-6 py-3 border-white/20 text-black hover:bg-white/30"
                >
                  <X class="mr-2 h-5 w-5" />
                  Cancelar
                </Button>
                <Button 
                  @click="handleSaveMeasurements"
                  :disabled="measurementsStore.loading || !hasChanges"
                  variant="outline"
                  class="px-6 py-3 border-white/20 text-black hover:bg-white/30"
                >
                  <Save class="mr-2 h-5 w-5" />
                  {{ measurementsStore.loading ? 'Guardando...' : 'Guardar Todo' }}
                </Button>
              </template>
            </div>
          </div>
        </CardHeader>

        <Separator class="bg-white/20 mb-8" />

        <CardContent>
          <!-- Loading State -->
          <div v-if="measurementsStore.loading && !measurementsStore.measurementTypes.length" class="text-center py-12">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
            <p class="mt-4 text-gray-400">Cargando medidas...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="measurementsStore.error && !measurementsStore.measurementTypes.length" class="text-center py-12">
            <p class="text-red-400">{{ measurementsStore.error }}</p>
            <Button 
              @click="loadData"
              variant="outline"
              class="mt-4 px-6 py-3 border-white/20 text-white hover:bg-white/10"
            >
              Reintentar
            </Button>
          </div>

          <!-- Measurements Grid -->
          <div v-else>
            <!-- Info Banner -->
            <div class="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div class="flex items-start gap-3">
                <AlertCircle class="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div class="text-sm text-gray-300">
                  <p class="font-semibold mb-1">Todas las medidas deben ingresarse en milímetros (mm)</p>
                  <p>Tus medidas son utilizadas para generar patrones personalizados de confección.</p>
                </div>
              </div>
            </div>

            <!-- Empty State / No Measurements Yet -->
            <div v-if="measurementsStore.userMeasurementsCount === 0 && measurementsStore.measurementTypesCount > 0" class="mb-6 text-center py-8 bg-white/5 border border-white/10 rounded-lg">
              <Ruler class="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p class="text-gray-400 text-base mb-4">Aún no tienes medidas guardadas</p>
              <Button 
                @click="router.push({ name: 'ai-measurements' })"
                variant="outline"
                class="px-8 py-3 border-white/20 text-white hover:bg-white/10"
              >
                <Sparkles class="mr-2 h-5 w-5" />
                Obtener con IA
              </Button>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="successMessage" class="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div class="flex items-center gap-3">
                <CheckCircle class="h-5 w-5 text-green-400" />
                <p class="text-sm text-green-300">{{ successMessage }}</p>
              </div>
            </div>

            <div v-if="measurementsStore.error && isEditMode" class="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div class="flex items-center gap-3">
                <AlertCircle class="h-5 w-5 text-red-400" />
                <p class="text-sm text-red-300">{{ measurementsStore.error }}</p>
              </div>
            </div>

            <!-- Measurements Stats -->
            <div v-if="measurementsStore.userMeasurementsCount > 0" class="mb-6 flex items-center justify-between">
              <p class="text-gray-400">
                {{ measurementsStore.userMeasurementsCount }} de {{ measurementsStore.measurementTypesCount }} medidas guardadas
              </p>
              <div v-if="hasChanges && isEditMode" class="text-yellow-400 text-sm flex items-center gap-2">
                <AlertCircle class="h-4 w-4" />
                Cambios sin guardar
              </div>
            </div>

            <!-- Measurements Grid -->
            <div v-if="measurementsStore.userMeasurementsCount > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card 
                v-for="type in measurementsStore.measurementTypes" 
                :key="type.id"
                class="bg-white/10 border-white/20 transition-all"
                :class="{ 'ring-2 ring-white': editedMeasurements[type.id] !== undefined && hasValueChanged(type.id) }"
              >
                <CardHeader class="pb-3">
                  <CardTitle class="text-lg font-bold text-white flex items-center justify-between">
                    {{ type.name }}
                    <Button
                      v-if="!isEditMode && getMeasurementValue(type.id) !== null"
                      @click="() => openDeleteDialog(type)"
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription v-if="type.description" class="text-gray-400 text-sm">
                    {{ type.description }}
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-2">
                  <div class="space-y-2">
                    <Label :for="`measure-${type.id}`" class="text-gray-300 text-sm">
                      Valor (mm)
                    </Label>
                    <div class="relative">
                      <Input 
                        :id="`measure-${type.id}`"
                        v-model.number="editedMeasurements[type.id]"
                        type="number"
                        step="0.01"
                        min="0"
                        max="9999.99"
                        :placeholder="isEditMode ? 'Ingrese medida' : 'No registrada'"
                        :disabled="!isEditMode"
                        :class="[
                          'bg-white/10 border-white/20 text-white placeholder:text-gray-500',
                          !isEditMode && 'cursor-not-allowed opacity-60',
                          getValidationError(type.id) && 'border-red-500 focus:ring-red-500'
                        ]"
                        @input="() => validateMeasurement(type.id)"
                      />
                      <span v-if="getMeasurementValue(type.id) !== null && !isEditMode" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        mm
                      </span>
                    </div>
                    
                    <!-- Inline Validation Error -->
                    <p v-if="getValidationError(type.id)" class="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle class="h-3 w-3" />
                      {{ getValidationError(type.id) }}
                    </p>

                    <!-- Last Updated -->
                    <p v-if="getLastUpdated(type.id) && !isEditMode" class="text-gray-500 text-xs">
                      Actualizado: {{ getLastUpdated(type.id) }}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Empty State - No Measurement Types -->
            <div v-if="measurementsStore.measurementTypesCount === 0" class="text-center py-12">
              <Ruler class="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p class="text-gray-400 text-lg">No hay tipos de medidas disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>
          </main>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent class="bg-gray-900 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle class="text-xl font-bold">Eliminar Medida</DialogTitle>
          <DialogDescription class="text-gray-400">
            ¿Estás seguro de que deseas eliminar la medida de <strong class="text-white">{{ measurementToDelete?.name }}</strong>?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="gap-2">
          <Button
            @click="showDeleteDialog = false"
            variant="outline"
            class="border-white/20 text-white hover:bg-white/5"
          >
            Cancelar
          </Button>
          <Button
            @click="confirmDelete"
            :disabled="measurementsStore.loading"
            variant="outline"
            class="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
          >
            <Trash2 class="mr-2 h-4 w-4" />
            {{ measurementsStore.loading ? 'Eliminando...' : 'Eliminar' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMeasurementsStore } from '@/stores/measurements'
import type { MeasurementType } from '@/types/measurements.types'
import { Edit, Save, X, Trash2, Ruler, CheckCircle, AlertCircle, Sparkles, ShoppingBag, LogOut } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

const router = useRouter()
const authStore = useAuthStore()
const measurementsStore = useMeasurementsStore()

const isEditMode = ref(false)
const editedMeasurements = reactive<Record<number, number | undefined>>({})
const originalMeasurements = reactive<Record<number, number | undefined>>({})
const validationErrors = reactive<Record<number, string>>({})
const successMessage = ref('')
const showDeleteDialog = ref(false)
const measurementToDelete = ref<MeasurementType | null>(null)

// Computed
const hasChanges = computed(() => {
  return Object.keys(editedMeasurements).some(key => {
    const typeId = Number(key)
    const edited = editedMeasurements[typeId]
    const original = originalMeasurements[typeId]
    
    // Consider undefined/null as no value
    const editedValue = edited ?? null
    const originalValue = original ?? null
    
    return editedValue !== originalValue
  })
})

// Methods
const loadData = async () => {
  if (!authStore.user?.id) {
    router.push('/login')
    return
  }

  await Promise.all([
    measurementsStore.fetchMeasurementTypes(),
    measurementsStore.fetchUserMeasurements(authStore.user.id)
  ])

  // Initialize edited measurements with current values
  initializeEditedMeasurements()
}

const initializeEditedMeasurements = () => {
  measurementsStore.measurementTypes.forEach(type => {
    const measurement = measurementsStore.getMeasurementByTypeId(type.id)
    const value = measurement?.value
    editedMeasurements[type.id] = value
    originalMeasurements[type.id] = value
  })
}

const getMeasurementValue = (typeId: number): number | null => {
  const value = editedMeasurements[typeId]
  return value !== undefined ? value : null
}

const getLastUpdated = (typeId: number): string | null => {
  const measurement = measurementsStore.getMeasurementByTypeId(typeId)
  if (!measurement?.updated_at) return null
  
  const date = new Date(measurement.updated_at)
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const validateMeasurement = (typeId: number) => {
  const value = editedMeasurements[typeId]
  
  // Clear error if empty (optional field)
  if (value === undefined || value === null || value === 0) {
    delete validationErrors[typeId]
    return true
  }

  // Validate range
  if (value < 0) {
    validationErrors[typeId] = 'El valor debe ser mayor a 0'
    return false
  }

  if (value > 9999.99) {
    validationErrors[typeId] = 'El valor no puede superar 9999.99'
    return false
  }

  // Valid
  delete validationErrors[typeId]
  return true
}

const getValidationError = (typeId: number): string | null => {
  return validationErrors[typeId] || null
}

const hasValueChanged = (typeId: number): boolean => {
  const edited = editedMeasurements[typeId]
  const original = originalMeasurements[typeId]
  
  const editedValue = edited ?? null
  const originalValue = original ?? null
  
  return editedValue !== originalValue
}

const enterEditMode = () => {
  isEditMode.value = true
  measurementsStore.clearError()
  successMessage.value = ''
}

const cancelEdit = () => {
  isEditMode.value = false
  // Reset to original values
  Object.keys(editedMeasurements).forEach(key => {
    const typeId = Number(key)
    editedMeasurements[typeId] = originalMeasurements[typeId]
    delete validationErrors[typeId]
  })
  measurementsStore.clearError()
}

const handleSaveMeasurements = async () => {
  if (!authStore.user?.id) return

  // Validate all measurements
  let hasErrors = false
  Object.keys(editedMeasurements).forEach(key => {
    const typeId = Number(key)
    if (!validateMeasurement(typeId)) {
      hasErrors = true
    }
  })

  if (hasErrors) {
    return
  }

  // Prepare measurements to save (only changed ones with values)
  const measurementsToSave = Object.keys(editedMeasurements)
    .map(key => {
      const typeId = Number(key)
      const value = editedMeasurements[typeId]
      
      // Only include if has value and changed
      if (value && value > 0 && hasValueChanged(typeId)) {
        return {
          measurement_type_id: typeId,
          value: Number(value)
        }
      }
      return null
    })
    .filter(m => m !== null) as { measurement_type_id: number; value: number }[]

  if (measurementsToSave.length === 0) {
    measurementsStore.error = 'No hay cambios para guardar'
    return
  }

  const result = await measurementsStore.saveMeasurements(authStore.user.id, measurementsToSave)

  if (result.success) {
    successMessage.value = `Se guardaron ${result.data?.processed || measurementsToSave.length} medidas correctamente`
    isEditMode.value = false
    
    // Update original measurements
    Object.keys(editedMeasurements).forEach(key => {
      const typeId = Number(key)
      originalMeasurements[typeId] = editedMeasurements[typeId]
    })

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  }
}

const openDeleteDialog = (type: MeasurementType) => {
  measurementToDelete.value = type
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (!measurementToDelete.value || !authStore.user?.id) return

  const measurement = measurementsStore.getMeasurementByTypeId(measurementToDelete.value.id)
  if (!measurement) return

  const result = await measurementsStore.deleteMeasurement(measurement.id, authStore.user.id)

  if (result.success) {
    const deletedTypeId = measurementToDelete.value.id
    const deletedTypeName = measurementToDelete.value.name
    
    successMessage.value = `Medida "${deletedTypeName}" eliminada correctamente`
    showDeleteDialog.value = false
    measurementToDelete.value = null
    
    // Update edited measurements
    delete editedMeasurements[deletedTypeId]
    delete originalMeasurements[deletedTypeId]

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Lifecycle
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  loadData()
})
</script>

<style scoped>
:deep(.bg-white\/10) {
  backdrop-filter: blur(8px);
}

:deep(.bg-white\/5) {
  backdrop-filter: blur(8px);
}

:deep(input:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

/* Hide number input spinners in Chrome/Safari */
:deep(input[type="number"]::-webkit-inner-spin-button),
:deep(input[type="number"]::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide number input spinners in Firefox */
:deep(input[type="number"]) {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
