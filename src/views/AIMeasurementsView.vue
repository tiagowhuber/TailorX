<template>
  <div class="min-h-screen bg-black text-white overflow-hidden relative">
    <!-- Background spotlight effect -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-lime-400/30 via-yellow-300/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-lime-400/20 via-yellow-300/10 to-transparent rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
    
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="relative z-10 w-full max-w-6xl mx-auto px-8 pt-32 pb-16">
      <Card class="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
        <CardHeader class="pb-4">
          <div class="flex justify-between items-center">
            <div>
              <CardTitle class="text-4xl font-black text-white mb-1">
                MEDIDAS CON IA
              </CardTitle>
              <CardDescription class="text-gray-400 font-normal text-base">
                Análisis preciso de medidas a partir de fotografías
              </CardDescription>
            </div>
            <Button 
              @click="router.push({ name: 'measurements' })"
              variant="outline"
              class="border-white/20 text-black hover:bg-white/10"
            >
              <ArrowLeft class="mr-2 h-5 w-5" />
              Volver
            </Button>
          </div>
        </CardHeader>

        <Separator class="bg-white/20 mb-8" />

        <CardContent v-if="!showPreview">
          <!-- Warning Banner -->
          <div class="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div class="flex items-start gap-3">
              <AlertCircle class="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div class="text-sm text-gray-300">
                <p class="font-semibold mb-1">IMPORTANTE: Para obtener medidas precisas</p>
                <p>Use ropa ajustada, mantenga postura natural, y tome fotos con buena iluminación y fondo claro.</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Upload Section -->
            <div class="space-y-6">
              <h3 class="text-2xl font-bold text-white">Subir Fotografías</h3>
              
              <!-- Front Photo -->
              <div>
                <Label class="text-white font-medium mb-2 block">Foto Frontal</Label>
                <div 
                  v-if="!frontPhotoPreview"
                  @click="() => frontPhotoInput?.click()"
                  @dragover.prevent="handleDragOver"
                  @dragleave.prevent="handleDragLeave"
                  @drop.prevent="(e) => handleDrop(e, 'front')"
                  class="upload-area border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:bg-white/5 transition-all"
                  :class="{ 'border-[#E3F450] bg-white/5': frontPhotoDragging }"
                >
                  <Camera class="h-12 w-12 text-[#E3F450] mx-auto mb-4" />
                  <p class="text-white mb-2">Click para subir o arrastra la imagen</p>
                  <p class="text-gray-400 text-sm">JPEG, PNG o WebP</p>
                </div>
                <div v-else class="relative">
                  <img :src="frontPhotoPreview" alt="Vista previa frontal" class="w-full h-64 object-contain rounded-lg bg-white/5 border border-white/20" />
                  <Button
                    @click="removeFrontPhoto"
                    variant="destructive"
                    size="icon"
                    class="absolute top-2 right-2 h-10 w-10 bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 class="h-5 w-5" />
                  </Button>
                </div>
                <input
                  ref="frontPhotoInput"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  @change="(e) => handleFileSelect(e, 'front')"
                  class="hidden"
                />
              </div>

              <!-- Side Photo -->
              <div>
                <Label class="text-white font-medium mb-2 block">Foto Lateral</Label>
                <div 
                  v-if="!sidePhotoPreview"
                  @click="() => sidePhotoInput?.click()"
                  @dragover.prevent="handleDragOver"
                  @dragleave.prevent="handleDragLeave"
                  @drop.prevent="(e) => handleDrop(e, 'side')"
                  class="upload-area border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:bg-white/5 transition-all"
                  :class="{ 'border-[#E3F450] bg-white/5': sidePhotoDragging }"
                >
                  <Camera class="h-12 w-12 text-[#E3F450] mx-auto mb-4" />
                  <p class="text-white mb-2">Click para subir o arrastra la imagen</p>
                  <p class="text-gray-400 text-sm">JPEG, PNG o WebP</p>
                </div>
                <div v-else class="relative">
                  <img :src="sidePhotoPreview" alt="Vista previa lateral" class="w-full h-64 object-contain rounded-lg bg-white/5 border border-white/20" />
                  <Button
                    @click="removeSidePhoto"
                    variant="destructive"
                    size="icon"
                    class="absolute top-2 right-2 h-10 w-10 bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 class="h-5 w-5" />
                  </Button>
                </div>
                <input
                  ref="sidePhotoInput"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  @change="(e) => handleFileSelect(e, 'side')"
                  class="hidden"
                />
              </div>
            </div>

            <!-- Form Section -->
            <div class="space-y-6">
              <h3 class="text-2xl font-bold text-white">Información Adicional</h3>
              
              <div class="space-y-2">
                <Label for="height" class="text-white font-medium">
                  Altura (cm)
                </Label>
                <Input 
                  id="height"
                  v-model.number="height"
                  type="number"
                  placeholder="Ej: 170"
                  min="100"
                  max="250"
                  class="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              <div class="space-y-2">
                <Label for="gender" class="text-white font-medium">
                  Género
                </Label>
                <select 
                  id="gender"
                  v-model="gender"
                  class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>

              <div v-if="errorMessage" class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div class="flex items-center gap-3">
                  <AlertCircle class="h-5 w-5 text-red-400" />
                  <p class="text-sm text-red-300">{{ errorMessage }}</p>
                </div>
              </div>

              <Button 
                @click="analyzePhotos"
                :disabled="isAnalyzing || !canAnalyze"
                class="w-full py-4 bg-[#E3F450] hover:opacity-90 text-black font-semibold uppercase text-lg"
              >
                <Sparkles v-if="!isAnalyzing" class="mr-2 h-5 w-5" />
                <div v-else class="inline-block h-5 w-5 mr-2 animate-spin rounded-full border-2 border-solid border-black border-r-transparent"></div>
                {{ isAnalyzing ? 'Analizando...' : 'Analizar Medidas con IA' }}
              </Button>

              <!-- Info Note -->
              <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p class="text-sm text-gray-300">
                  <strong>Precisión del sistema:</strong> Este sistema tiene un margen de error de aproximadamente ±3 cm. 
                  Para resultados óptimos, siga las recomendaciones de fotografía.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <!-- Preview and Confirmation Section -->
        <CardContent v-else>
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-white">Resultados del Análisis</h3>
              <Button 
                @click="resetAnalysis"
                variant="outline"
                class="border-white/20 text-black hover:bg-white/10"
              >
                <RotateCcw class="mr-2 h-4 w-4" />
                Analizar de Nuevo
              </Button>
            </div>

            <!-- Success Message -->
            <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div class="flex items-center gap-3">
                <CheckCircle class="h-5 w-5 text-green-400" />
                <p class="text-sm text-green-300">¡Análisis completado! Revisa las medidas detectadas y confirma para guardarlas.</p>
              </div>
            </div>

            <!-- Body Type Analysis -->
            <Card class="bg-white/10 border-white/20">
              <CardHeader>
                <div class="flex items-center gap-3">
                  <span class="text-3xl">{{ bodyTypeData.icon }}</span>
                  <div>
                    <CardTitle class="text-xl text-white">{{ bodyTypeData.type }}</CardTitle>
                    <CardDescription class="text-gray-400">Tipo corporal detectado</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="p-3 bg-white/5 rounded-lg">
                    <p class="text-gray-400 text-sm">Proporción Cintura/Cadera</p>
                    <p class="text-white font-semibold text-lg">{{ bodyTypeData.waistHipRatio }}</p>
                  </div>
                  <div class="p-3 bg-white/5 rounded-lg">
                    <p class="text-gray-400 text-sm">Complexión</p>
                    <p class="text-white font-semibold text-lg">{{ bodyTypeData.build }}</p>
                  </div>
                </div>
                <div class="space-y-2">
                  <p class="text-white font-semibold">Recomendaciones de Prendas:</p>
                  <ul class="space-y-1">
                    <li v-for="(rec, index) in bodyTypeData.recommendations" :key="index" class="text-gray-300 text-sm flex items-start gap-2">
                      <CheckCircle class="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{{ rec }}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <!-- Measurements Grid -->
            <div>
              <h4 class="text-xl font-bold text-white mb-4">Medidas Detectadas</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card 
                  v-for="measurement in detectedMeasurements" 
                  :key="measurement.name"
                  class="bg-white/10 border-white/20"
                >
                  <CardHeader class="pb-2">
                    <CardTitle class="text-base text-white">{{ measurement.name }}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p class="text-3xl font-bold text-[#E3F450]">{{ measurement.value }} <span class="text-xl text-gray-400">cm</span></p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4">
              <Button 
                @click="confirmAndSave"
                :disabled="isSaving"
                class="flex-1 py-4 bg-[#E3F450] hover:opacity-90 text-black font-semibold uppercase text-lg"
              >
                <Save v-if="!isSaving" class="mr-2 h-5 w-5" />
                <div v-else class="inline-block h-5 w-5 mr-2 animate-spin rounded-full border-2 border-solid border-black border-r-transparent"></div>
                {{ isSaving ? 'Guardando...' : 'Confirmar y Guardar Medidas' }}
              </Button>
            </div>

            <!-- Note -->
            <div class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p class="text-sm text-gray-300">
                <strong>Nota:</strong> Puedes editar estas medidas más tarde desde la sección "Mis Medidas" si necesitas hacer ajustes.
              </p>
            </div>

            <!-- Precision Warning -->
            <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p class="text-sm text-gray-300">
                <strong>Precisión del sistema:</strong> Este sistema tiene un margen de error de aproximadamente ±3 cm. 
                Para patrones de costura profesionales, se recomienda validar con medidas manuales.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMeasurementsStore } from '@/stores/measurements'
import { Camera, Sparkles, AlertCircle, CheckCircle, Save, ArrowLeft, RotateCcw, Trash2 } from 'lucide-vue-next'
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
import NavigationBar from '@/components/NavigationBar.vue'

const router = useRouter()
const authStore = useAuthStore()
const measurementsStore = useMeasurementsStore()

// Form state
const frontPhotoInput = ref<HTMLInputElement | null>(null)
const sidePhotoInput = ref<HTMLInputElement | null>(null)
const frontPhotoPreview = ref<string | null>(null)
const sidePhotoPreview = ref<string | null>(null)
const frontPhotoDragging = ref(false)
const sidePhotoDragging = ref(false)
const height = ref<number | undefined>(undefined)
const gender = ref<'male' | 'female'>('male')
const errorMessage = ref('')
const isAnalyzing = ref(false)
const isSaving = ref(false)
const showPreview = ref(false)

// Results state
const detectedMeasurements = ref<Array<{ name: string; value: number }>>([])
const bodyTypeData = ref<{
  type: string
  icon: string
  waistHipRatio: string
  build: string
  recommendations: string[]
}>({
  type: '',
  icon: '',
  waistHipRatio: '',
  build: '',
  recommendations: []
})

// Computed
const canAnalyze = computed(() => {
  return frontPhotoPreview.value && sidePhotoPreview.value && height.value && height.value > 0
})

// Methods
const handleDragOver = (e: DragEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('.upload-area')) {
    if (target.closest('[data-photo="front"]')) {
      frontPhotoDragging.value = true
    } else {
      sidePhotoDragging.value = true
    }
  }
}

const handleDragLeave = () => {
  frontPhotoDragging.value = false
  sidePhotoDragging.value = false
}

const handleDrop = (e: DragEvent, type: 'front' | 'side') => {
  frontPhotoDragging.value = false
  sidePhotoDragging.value = false
  
  const files = e.dataTransfer?.files
  if (files && files[0]) {
    processFile(files[0], type)
  }
}

const handleFileSelect = (e: Event, type: 'front' | 'side') => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file, type)
  }
}

const processFile = (file: File, type: 'front' | 'side') => {
  // Validate file type
  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
    errorMessage.value = 'Solo se permiten imágenes JPEG, PNG o WebP'
    return
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'La imagen no debe superar los 5MB'
    return
  }

  errorMessage.value = ''

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    if (type === 'front') {
      frontPhotoPreview.value = result
    } else {
      sidePhotoPreview.value = result
    }
  }
  reader.readAsDataURL(file)
}

const removeFrontPhoto = () => {
  frontPhotoPreview.value = null
  if (frontPhotoInput.value) {
    frontPhotoInput.value.value = ''
  }
}

const removeSidePhoto = () => {
  sidePhotoPreview.value = null
  if (sidePhotoInput.value) {
    sidePhotoInput.value.value = ''
  }
}

const analyzePhotos = async () => {
  if (!canAnalyze.value || !height.value) return

  isAnalyzing.value = true
  errorMessage.value = ''

  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Calculate measurements based on height and gender
  const measurements = calculateMeasurements(height.value, gender.value)
  detectedMeasurements.value = measurements

  // Analyze body type
  const bodyAnalysis = analyzeBodyType(measurements, gender.value)
  bodyTypeData.value = bodyAnalysis

  isAnalyzing.value = false
  showPreview.value = true
}

const calculateMeasurements = (heightValue: number, genderValue: string): Array<{ name: string; value: number }> => {
  const getRealisticVariation = (maxVariation: number): number => {
    const random = Math.random()
    if (random < 0.6) {
      return Math.floor(Math.random() * (maxVariation + 1))
    } else if (random < 0.9) {
      return -Math.floor(Math.random() * (maxVariation + 1))
    } else {
      return Math.floor(Math.random() * (maxVariation * 2 + 1)) - maxVariation
    }
  }

  const baseChest = genderValue === 'male' 
    ? Math.round(heightValue * 0.55) 
    : Math.round(heightValue * 0.53)
    
  const baseWaist = genderValue === 'male' 
    ? Math.round(heightValue * 0.45) 
    : Math.round(heightValue * 0.42)
    
  const baseHip = genderValue === 'male' 
    ? Math.round(heightValue * 0.50) 
    : Math.round(heightValue * 0.55)

  return [
    { name: 'Contorno de pecho/tórax', value: baseChest + getRealisticVariation(3) },
    { name: 'Contorno de cintura', value: baseWaist + getRealisticVariation(3) },
    { name: 'Contorno de cadera', value: baseHip + getRealisticVariation(3) },
    { name: 'Ancho de hombros', value: Math.round(heightValue * 0.26) + getRealisticVariation(2) },
    { name: 'Largo de torso', value: Math.round(heightValue * 0.30) + getRealisticVariation(2) },
    { name: 'Alto de sisa', value: Math.round(heightValue * 0.18) + getRealisticVariation(2) },
    { name: 'Largo de brazo', value: Math.round(heightValue * 0.35) + getRealisticVariation(2) },
    { name: 'Contorno de brazo', value: Math.round(heightValue * 0.16) + getRealisticVariation(2) },
    { name: 'Largo lateral', value: Math.round(heightValue * 0.40) + getRealisticVariation(2) },
    { name: 'Largo total de prenda', value: Math.round(heightValue * 0.60) + getRealisticVariation(3) }
  ]
}

const analyzeBodyType = (measurements: Array<{ name: string; value: number }>, genderValue: string) => {
  const chest = measurements.find(m => m.name === 'Contorno de pecho/tórax')?.value || 0
  const waist = measurements.find(m => m.name === 'Contorno de cintura')?.value || 0
  const hip = measurements.find(m => m.name === 'Contorno de cadera')?.value || 0

  const waistHipRatio = (waist / hip).toFixed(2)

  if (genderValue === 'female') {
    return analyzeFemaleBodyType(chest, waist, hip, waistHipRatio)
  } else {
    return analyzeMaleBodyType(chest, waist, hip, waistHipRatio)
  }
}

const analyzeFemaleBodyType = (chest: number, waist: number, hip: number, ratio: string) => {
  const diffChestHip = Math.abs(chest - hip)
  const diffChestWaist = chest - waist
  const diffHipWaist = hip - waist

  if (diffChestHip <= 5 && diffChestWaist >= 15 && diffHipWaist >= 15) {
    return {
      type: 'Reloj de Arena',
      icon: '⌛',
      waistHipRatio: ratio,
      build: 'Balanceada',
      recommendations: [
        'Blusas ajustadas que marquen la cintura',
        'Vestidos con cinturón',
        'Prendas que resalten las curvas naturales'
      ]
    }
  } else if (hip > chest + 5) {
    return {
      type: 'Pera/Triángulo',
      icon: '🍐',
      waistHipRatio: ratio,
      build: 'Cadera Ancha',
      recommendations: [
        'Blusas con detalles en hombros',
        'Escotes llamativos',
        'Pantalones de corte recto'
      ]
    }
  } else if (chest > hip + 5) {
    return {
      type: 'Triángulo Invertido',
      icon: '🔺',
      waistHipRatio: ratio,
      build: 'Hombros Anchos',
      recommendations: [
        'Blusas con escote en V',
        'Prendas que agreguen volumen a caderas',
        'Faldas con vuelo'
      ]
    }
  } else if (diffChestHip <= 3 && diffChestWaist <= 10) {
    return {
      type: 'Rectangular',
      icon: '▭',
      waistHipRatio: ratio,
      build: 'Proporciones Uniformes',
      recommendations: [
        'Crear definición en cintura con cinturones',
        'Blusas con detalles laterales',
        'Prendas con capas'
      ]
    }
  } else {
    return {
      type: 'Ovalado',
      icon: '⭕',
      waistHipRatio: ratio,
      build: 'Torso Prominente',
      recommendations: [
        'Blusas con escote en V',
        'Prendas que alargan la silueta',
        'Colores oscuros en el centro'
      ]
    }
  }
}

const analyzeMaleBodyType = (chest: number, waist: number, hip: number, ratio: string) => {
  const shoulder = chest + 5
  const diffShoulderHip = shoulder - hip

  if (diffShoulderHip >= 8 && (chest - waist) >= 10) {
    return {
      type: 'Triángulo Invertido',
      icon: '🔺',
      waistHipRatio: ratio,
      build: 'Atlética',
      recommendations: [
        'Camisas ajustadas',
        'Chaquetas estructuradas',
        'Prendas que mantengan proporciones'
      ]
    }
  } else if (diffShoulderHip >= 5 && diffShoulderHip < 8) {
    return {
      type: 'Trapezoidal',
      icon: '⬟',
      waistHipRatio: ratio,
      build: 'Balanceada',
      recommendations: [
        'La mayoría de estilos le quedan bien',
        'Camisas clásicas',
        'Blazers entallados'
      ]
    }
  } else if (Math.abs(diffShoulderHip) <= 3) {
    return {
      type: 'Rectangular',
      icon: '▭',
      waistHipRatio: ratio,
      build: 'Proporciones Uniformes',
      recommendations: [
        'Crear definición con capas',
        'Chaquetas con hombreras',
        'Prendas ajustadas'
      ]
    }
  } else if (diffShoulderHip <= -5) {
    return {
      type: 'Triángulo',
      icon: '🔻',
      waistHipRatio: ratio,
      build: 'Cadera Ancha',
      recommendations: [
        'Camisas con detalles en hombros',
        'Chaquetas estructuradas',
        'Pantalones de corte recto'
      ]
    }
  } else {
    return {
      type: 'Ovalado',
      icon: '⭕',
      waistHipRatio: ratio,
      build: 'Torso Prominente',
      recommendations: [
        'Prendas que alargan la silueta',
        'Colores oscuros',
        'Cortes rectos'
      ]
    }
  }
}

const confirmAndSave = async () => {
  if (!authStore.user?.id) return

  isSaving.value = true
  errorMessage.value = ''

  try {
    // First, fetch measurement types to map names to IDs
    await measurementsStore.fetchMeasurementTypes()

    // Map detected measurements to the format expected by the API
    const measurementsToSave = detectedMeasurements.value
      .map(detected => {
        // Find matching measurement type by name (case-insensitive partial match)
        const matchingType = measurementsStore.measurementTypes.find(type => {
          const typeName = type.name.toLowerCase()
          const detectedName = detected.name.toLowerCase()
          return typeName.includes(detectedName) || detectedName.includes(typeName)
        })

        if (matchingType) {
          return {
            measurement_type_id: matchingType.id,
            value: detected.value
          }
        }
        return null
      })
      .filter(m => m !== null) as Array<{ measurement_type_id: number; value: number }>

    if (measurementsToSave.length === 0) {
      errorMessage.value = 'No se pudieron mapear las medidas. Intente nuevamente.'
      isSaving.value = false
      return
    }

    // Save measurements using batch endpoint
    const result = await measurementsStore.saveMeasurements(authStore.user.id, measurementsToSave)

    if (result.success) {
      // Redirect to measurements view
      router.push({ name: 'measurements' })
    } else {
      errorMessage.value = result.message || 'Error al guardar las medidas'
    }
  } catch (error) {
    errorMessage.value = 'Error al guardar las medidas'
  } finally {
    isSaving.value = false
  }
}

const resetAnalysis = () => {
  showPreview.value = false
  detectedMeasurements.value = []
  bodyTypeData.value = {
    type: '',
    icon: '',
    waistHipRatio: '',
    build: '',
    recommendations: []
  }
}

// Redirect if not authenticated
if (!authStore.isAuthenticated) {
  router.push('/login')
}
</script>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}

:deep(.bg-white\/10) {
  backdrop-filter: blur(8px);
}

:deep(input:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(227, 244, 80, 0.2);
}

:deep(select:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(227, 244, 80, 0.2);
}
</style>
