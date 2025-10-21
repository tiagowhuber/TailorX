<template>
  <div class="min-h-screen bg-black text-white"
  
    :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'top 600px center', backgroundRepeat: 'no-repeat' }">
    <!-- Navigation Header -->
    <header class="relative z-10 flex justify-between items-center px-8 py-6">
      <!-- Logo -->
      <div class="flex items-center">
        <h1 class="text-2xl font-bold tracking-widest">TAILORX</h1>
        <p class="text-xs text-gray-400 ml-4 tracking-wide">DRESS WITHOUT WASTE</p>
      </div>
      
      <!-- Navigation Menu -->
      <nav class="hidden md:flex space-x-12 text-lg font-semibold">
        <router-link to="/" class="hover:text-[#E3F450] transition-colors">INICIO</router-link>
        <span class="text-gray-500">|</span>
        <a href="#" class="hover:text-[#E3F450] transition-colors">TAILORX</a>
        <span class="text-gray-500">|</span>
        <a href="#" class="hover:text-[#E3F450] transition-colors">START NOW</a>
        <span class="text-gray-500">|</span>
        <a href="#" class="hover:text-[#E3F450] transition-colors">CONTACTO</a>
      </nav>
      
      <!-- Social Media Icons -->
      <div class="flex space-x-3">
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <TwitterSmallIcon />
        </a>
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <FacebookSmallIcon />
        </a>
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <InstagramSmallIcon />
        </a>
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <WhatsAppSmallIcon />
        </a>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-8 py-12 max-w-7xl mx-auto">
      <!-- Page Title -->
      <div class="mb-12">
        <h2 class="text-5xl md:text-6xl font-black mb-4" style="font-family: 'Avenir Next', sans-serif;">
          CATÁLOGO
        </h2>
        <p class="text-xl md:text-2xl orbitron-variable" style="--orbitron-weight: 400;">
          CADA DISEÑO SE ADAPTA A TI, NO AL REVÉS.
        </p>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Product Card 1 -->
        <div class="group cursor-pointer">
          <div class="relative overflow-hidden rounded-lg aspect-[3/4] mb-4 bg-gray-800">
            <img 
              :src="productImages[0]" 
              alt="Pantalón oversize"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <!-- Plus Icon Overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
              <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span class="text-white text-4xl font-light">+</span>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold orbitron-variable" style="--orbitron-weight: 600;">
              Pantalón oversize
            </h3>
            <p class="text-sm text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">
              3 colores
            </p>
            <!-- Color Options -->
            <div class="flex gap-2">
              <div class="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
              <div class="w-6 h-6 rounded-full bg-amber-700 border-2 border-transparent"></div>
              <div class="w-6 h-6 rounded-full bg-orange-400 border-2 border-transparent"></div>
            </div>
            <p class="text-lg font-bold orbitron-variable" style="--orbitron-weight: 600;">
              $24.990
            </p>
          </div>
        </div>

        <!-- Product Card 2 -->
        <div class="group cursor-pointer">
          <div class="relative overflow-hidden rounded-lg aspect-[3/4] mb-4 bg-gray-800">
            <img 
              :src="productImages[1]" 
              alt="Camisa Aplicaciones"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <!-- Plus Icon Overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
              <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span class="text-white text-4xl font-light">+</span>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold orbitron-variable" style="--orbitron-weight: 600;">
              Camisa Aplicaciones
            </h3>
            <p class="text-sm text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">
              5 colores
            </p>
            <!-- Color Options -->
            <div class="flex gap-2">
              <div class="w-6 h-6 rounded-full bg-cyan-300 border-2 border-white"></div>
              <div class="w-6 h-6 rounded-full bg-green-300 border-2 border-transparent"></div>
              <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-transparent"></div>
              <div class="w-6 h-6 rounded-full bg-gray-800 border-2 border-transparent"></div>
              <div class="w-6 h-6 rounded-full bg-purple-300 border-2 border-transparent"></div>
            </div>
            <p class="text-lg font-bold orbitron-variable" style="--orbitron-weight: 600;">
              $24.990
            </p>
          </div>
        </div>

        <!-- Product Card 3 -->
        <div class="group cursor-pointer">
          <div class="relative overflow-hidden rounded-lg aspect-[3/4] mb-4 bg-gray-800">
            <img 
              :src="productImages[2]" 
              alt="Blazer XX"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <!-- Plus Icon Overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
              <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span class="text-white text-4xl font-light">+</span>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold orbitron-variable" style="--orbitron-weight: 600;">
              Blazer XX
            </h3>
            <p class="text-sm text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">
              5 colores
            </p>
            <!-- Color Options -->
            <div class="flex gap-2">
              <div class="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
              <div class="w-6 h-6 rounded-full bg-gray-700 border-2 border-transparent"></div>
            </div>
            <p class="text-lg font-bold orbitron-variable" style="--orbitron-weight: 600;">
              $24.990
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Gradient Spotlight Effect -->
    <div class="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[1200px] h-[400px] bg-gradient-radial from-lime-400/20 via-yellow-300/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import TwitterSmallIcon from '@/components/icons/TwitterSmallIcon.vue'
import FacebookSmallIcon from '@/components/icons/FacebookSmallIcon.vue'
import WhatsAppSmallIcon from '@/components/icons/WhatsAppSmallIcon.vue'
import InstagramSmallIcon from '@/components/icons/InstagramSmallIcon.vue'
import bgImage from '@/assets/backgrounds/elemento-amarillo.png'

// Placeholder images - replace with actual product images
const productImages = [
  new URL('@/assets/model-images/img1.jpg', import.meta.url).href,
  new URL('@/assets/model-images/img2.jpg', import.meta.url).href,
  new URL('@/assets/model-images/img3.jpg', import.meta.url).href,
]
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
