<template>
  <div class="min-h-screen bg-black">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center space-y-4">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E3F450] mx-auto"></div>
          <p class="text-gray-300 " >
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
          <p class="text-xl text-white " >
            Error al cargar el patrón
          </p>
          <p class="text-gray-400">{{ error }}</p>
          <button
            @click="router.push({ name: 'catalogo' })"
            class="px-6 py-2 bg-[#E3F450] text-black rounded-lg hover:bg-[#E3F45080] transition-colors "
            
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
              class="text-[#E3F450] hover:text-[#E3F45080] flex items-center gap-2 mb-4 "
              
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Volver
            </button>
            <h1 class="text-4xl font-bold text-white mb-2" >
              {{ pattern.name }}
            </h1>
            <p class="text-gray-400 " >
              Diseño: {{ pattern.design?.name }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              v-if="!cartStore.isInCart(pattern.id)"
              @click="addToCart"
              class="px-4 py-2 bg-[#E3F450] text-black rounded-lg hover:bg-[#E3F450]/80 transition-colors flex items-center gap-2"
              
            >
              <ShoppingCart class="w-4 h-4" />
              Agregar al Carrito
            </button>
            <button
              v-else-if="cartStore.isInCart(pattern.id)"
              @click="viewCart"
              class="px-4 py-2 bg-[#E3F450] text-black rounded-lg hover:bg-[#E3F450]/80 transition-colors flex items-center gap-2"
              
            >
              <ShoppingCart class="w-4 h-4" />
              Ver Carrito
            </button>
            <button
              @click="downloadSVG"
              class="px-4 py-2 bg-[#E3F450] text-black rounded-lg hover:bg-[#E3F45080] transition-colors "
              
            >
              Descargar SVG
            </button>
          </div>
        </div>

        <!-- Pattern Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <p class="text-gray-400 text-sm " >Estado</p>
            <p class="text-white text-lg font-semibold capitalize" >
              {{ pattern.status }}
            </p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <p class="text-gray-400 text-sm " >Tamaño</p>
            <p class="text-white text-lg font-semibold " >
              {{ pattern.svg_size_kb }} KB
            </p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <p class="text-gray-400 text-sm " >Creado</p>
            <p class="text-white text-lg font-semibold " >
              {{ formatDate(pattern.created_at) }}
            </p>
          </div>
        </div>

        <!-- SVG Display -->
        <div
          ref="svgContainer"
          class="bg-white rounded-lg overflow-hidden relative select-none"
          style="height: 600px; cursor: grab;"
          :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel.prevent="onWheel"
        >
          <!-- Pan/Zoom canvas -->
          <div
            ref="svgCanvas"
            style="transform-origin: 0 0; will-change: transform;"
            :style="{ transform: `translate(${translateX}px, ${translateY}px) scale(${scale})` }"
            v-html="pattern.svg_data"
          ></div>

          <!-- Controls -->
          <div class="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
            <button
              @click.stop="zoomIn"
              class="w-9 h-9 bg-black/70 hover:bg-black text-white rounded-lg flex items-center justify-center text-lg font-bold leading-none"
              title="Zoom in"
            >+</button>
            <button
              @click.stop="zoomOut"
              class="w-9 h-9 bg-black/70 hover:bg-black text-white rounded-lg flex items-center justify-center text-lg font-bold leading-none"
              title="Zoom out"
            >−</button>
            <button
              @click.stop="fitView"
              class="w-9 h-9 bg-black/70 hover:bg-black text-white rounded-lg flex items-center justify-center"
              title="Fit"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
              </svg>
            </button>
          </div>

          <!-- Zoom level indicator -->
          <div class="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none">
            {{ Math.round(scale * 100) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
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

// Pan/Zoom state
const svgContainer = ref<HTMLElement | null>(null)
const svgCanvas = ref<HTMLElement | null>(null)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)

let dragStartX = 0
let dragStartY = 0
let dragStartTX = 0
let dragStartTY = 0
let activePointerId: number | null = null

const MIN_SCALE = 0.05
const MAX_SCALE = 10

function fitView() {
  if (!svgContainer.value || !svgCanvas.value) return
  const container = svgContainer.value
  const svgEl = svgCanvas.value.querySelector('svg')
  if (!svgEl) return

  let svgW = 0
  let svgH = 0

  const vb = svgEl.getAttribute('viewBox')
  if (vb) {
    const parts = vb.split(/[\s,]+/).map(Number)
    if (parts.length >= 4) {
      svgW = parts[2] ?? 0
      svgH = parts[3] ?? 0
    }
  }
  if (!svgW || !svgH) {
    svgW = svgEl.width?.baseVal?.value || svgEl.getBoundingClientRect().width
    svgH = svgEl.height?.baseVal?.value || svgEl.getBoundingClientRect().height
  }
  if (!svgW || !svgH) return

  const cW = container.clientWidth
  const cH = container.clientHeight
  const newScale = Math.min(cW / svgW, cH / svgH) * 0.95
  scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))
  translateX.value = (cW - svgW * scale.value) / 2
  translateY.value = (cH - svgH * scale.value) / 2
}

function applyZoom(newScale: number, originX: number, originY: number) {
  const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))
  // Adjust translate so the point under the cursor stays fixed
  translateX.value = originX - (originX - translateX.value) * (clamped / scale.value)
  translateY.value = originY - (originY - translateY.value) * (clamped / scale.value)
  scale.value = clamped
}

function onWheel(e: WheelEvent) {
  if (!svgContainer.value) return
  const rect = svgContainer.value.getBoundingClientRect()
  const originX = e.clientX - rect.left
  const originY = e.clientY - rect.top
  const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
  applyZoom(scale.value * factor, originX, originY)
}

function zoomIn() {
  if (!svgContainer.value) return
  const cW = svgContainer.value.clientWidth
  const cH = svgContainer.value.clientHeight
  applyZoom(scale.value * 1.25, cW / 2, cH / 2)
}

function zoomOut() {
  if (!svgContainer.value) return
  const cW = svgContainer.value.clientWidth
  const cH = svgContainer.value.clientHeight
  applyZoom(scale.value / 1.25, cW / 2, cH / 2)
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  isDragging.value = true
  activePointerId = e.pointerId
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  dragStartX = e.clientX
  dragStartY = e.clientY
  dragStartTX = translateX.value
  dragStartTY = translateY.value
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value || e.pointerId !== activePointerId) return
  translateX.value = dragStartTX + (e.clientX - dragStartX)
  translateY.value = dragStartTY + (e.clientY - dragStartY)
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerId !== activePointerId) return
  isDragging.value = false
  activePointerId = null
}

// Auto-fit when pattern loads
watch(pattern, async (val) => {
  if (val?.svg_data) {
    await nextTick()
    // Give browser a frame to render the injected SVG
    requestAnimationFrame(fitView)
  }
})

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
