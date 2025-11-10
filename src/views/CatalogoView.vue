<template>
  <div class="min-h-screen bg-black text-white"
    :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'top 600px center', backgroundRepeat: 'no-repeat' }">
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Main Content -->
    <main class="px-8 py-12 max-w-7xl mx-auto">
      <!-- Page Title -->
      <motion.div
        class="mb-12"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ type: 'spring', stiffness: 250, damping: 30 }"
      >
        <h2 class="text-5xl md:text-6xl font-black mb-4" style="font-family: 'Avenir Next', sans-serif;">
          CATÁLOGO
        </h2>
        <p class="text-xl md:text-2xl orbitron-variable" style="--orbitron-weight: 400;">
          CADA DISEÑO SE ADAPTA A TI, NO AL REVÉS.
        </p>
      </motion.div>

      <!-- Filter Toggle -->
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="catalogStore.toggleActiveFilter()"
            class="px-4 py-2 rounded-lg border-2 transition-all orbitron-variable"
            :class="catalogStore.showOnlyActive 
              ? 'border-[#E3F450] bg-[#E3F450]/10 text-[#E3F450]' 
              : 'border-gray-600 text-gray-400 hover:border-gray-400'"
            style="--orbitron-weight: 500;"
          >
            {{ catalogStore.showOnlyActive ? 'Solo Activos' : 'Todos los Diseños' }}
          </button>
          <p class="text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">
            {{ catalogStore.filteredDesigns.length }} diseño{{ catalogStore.filteredDesigns.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="catalogStore.loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E3F450]"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="catalogStore.error" class="text-center py-20">
        <p class="text-red-400 text-xl mb-4">{{ catalogStore.error }}</p>
        <button
          @click="loadDesigns"
          class="px-6 py-3 bg-[#E3F450] text-black rounded-lg font-bold hover:bg-[#E3F45080] transition-colors orbitron-variable"
          style="--orbitron-weight: 600;"
        >
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <motion.div
        v-else-if="catalogStore.filteredDesigns.length === 0"
        class="text-center py-20"
        :initial="{ opacity: 0, scale: 0.95 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ type: 'spring', stiffness: 200, damping: 25 }"
      >
        <p class="text-gray-400 text-xl orbitron-variable" style="--orbitron-weight: 400;">
          No hay diseños disponibles
        </p>
      </motion.div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Product Card -->
        <motion.div
          v-for="(design, index) in catalogStore.filteredDesigns"
          :key="design.id"
          class="group cursor-pointer"
          @click="goToDesign(design.id)"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ type: 'spring', stiffness: 200, damping: 25, delay: index * 0.05 }"
        >
          <div class="relative overflow-hidden rounded-lg aspect-[3/4] mb-4 bg-gray-800">
            <img 
              v-if="design.image_url"
              :src="design.image_url" 
              :alt="design.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <!-- Fallback for missing image -->
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-gray-500 text-6xl orbitron-variable" style="--orbitron-weight: 300;">?</span>
            </div>
            <!-- Plus Icon Overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
              <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span class="text-white text-4xl font-light">+</span>
              </div>
            </div>
            <!-- Inactive Badge -->
            <div v-if="!design.is_active" class="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              INACTIVO
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold orbitron-variable" style="--orbitron-weight: 600;">
              {{ design.name }}
            </h3>
            <p v-if="design.description" class="text-sm text-gray-400 orbitron-variable line-clamp-2" style="--orbitron-weight: 400;">
              {{ design.description }}
            </p>
            <p class="text-lg font-bold orbitron-variable" style="--orbitron-weight: 600;">
              {{ formatPrice(design.base_price) }}
            </p>
          </div>
        </motion.div>
      </div>
    </main>

    <!-- Gradient Spotlight Effect -->
    <div class="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[1200px] h-[400px] bg-gradient-radial from-[#E3F450]/20 via-yellow-300/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import { useCatalogStore } from '@/stores/catalog'
import bgImage from '@/assets/backgrounds/elemento-amarillo.png'
import { motion } from 'motion-v' // Added motion-v import

const catalogStore = useCatalogStore()
const router = useRouter()

// Load designs on component mount
onMounted(async () => {
  await loadDesigns()
})

const loadDesigns = async () => {
  await catalogStore.fetchDesigns()
}

const goToDesign = (id: number) => {
  router.push(`/catalogo/${id}`)
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
/* Add hover effect for social media icons */
.w-6:hover {
  background-color: #E3F450 !important;
}

/* Gradient radial utility */
.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}
</style>
