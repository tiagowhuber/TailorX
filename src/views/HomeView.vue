<template>
  <!-- Navigation Header - Outside scrollable content -->
  <NavigationBar />

  <div class="overflow-x-hidden">
    <div 
    class="min-h-screen bg-black text-white relative" 
    :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
  >
    <!-- Background spotlight effect -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-[#E3F450]/30 via-yellow-300/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
    <div class="absolute top-32 right-16 w-64 h-64 bg-gradient-radial from-[#E3F45080]/40 via-yellow-200/30 to-transparent rounded-full blur-2xl"></div>
    
    <!-- Main Content -->
    <main class="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8">
      <motion.div
        class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ type: 'spring', stiffness: 250, damping: 30 }"
      >
        <!-- Left Content -->
        <div class="space-y-6 sm:space-y-8">
          
          <!-- Main Heading -->
          <div class="space-y-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <img :src="elementoImg" alt="Elemento" class="w-24 h-24 sm:w-32 sm:h-32 md:w-45 md:h-60" />
            <h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight" style="font-family: 'Avenir Next', sans-serif;">
              DRESS<br>
              WITHOUT<br>
              WASTE
            </h2>
            
            <!-- CTA Button -->
            <div class="pt-6 sm:pt-8">
              <router-link v-if="authStore.isAuthenticated" to="/catalogo">
                <Button 
                  class="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity orbitron-variable"
                  style="--orbitron-weight: 700; background-color: #E3F450; color: black;"
                >
                  VER CATÁLOGO
                </Button>
              </router-link>
              <router-link v-else to="/crear-cuenta">
                <Button 
                  class="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity orbitron-variable"
                  style="--orbitron-weight: 700; background-color: #E3F450; color: black;"
                >
                  CREAR CUENTA
                </Button>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Right Content - Empty space for design balance -->
        <div class="hidden lg:block"></div>
      </motion.div>
    </main>
  </div>

  <!-- Yellow Dude Section -->
  <div 
    class="h-200 bg-black text-white relative" 
    :style="{ backgroundImage: `url(${yellowDude})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
  >
    <div class="absolute inset-0 flex items-center justify-center">
      <p class="text-4xl font-bold">video?</p>
    </div>
  </div>

  <!-- Dress as you Fit Section -->
  <div class="min-h-screen bg-black text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Section Header -->
      <motion.div
        class="text-left mb-12 sm:mb-16"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ type: 'spring', stiffness: 250, damping: 30 }"
      >
        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6" style="font-family: 'Avenir Next', sans-serif;">
          VISTE A TU<br>MEDIDA
        </h2>
        <p class="text-lg sm:text-xl md:text-2xl orbitron-variable" style="--orbitron-weight: 400;">
          PRODUCIMOS SOLO LO QUE SE USA. <span class="text-[#E3F450]">NADA MÁS.</span>
        </p>
      </motion.div>

      <!-- Icons Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 orbitron-variable" style="--orbitron-weight: 400;">
        <motion.div
          v-for="(icon, index) in [
            { src: createAccountIcon, title: 'CREA TU\nCUENTA' },
            { src: giveMeasurementsIcon, title: 'PROPORCIONA\nTUS MEDIDAS' },
            { src: hangingShirtIcon, title: 'SELECCIONA\nLA PRENDA' },
            { src: shirtPriceTagIcon, title: 'VÍSTELO' }
          ]"
          :key="index"
          class="flex flex-col items-center text-center"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ type: 'spring', stiffness: 200, damping: 25, delay: index * 0.1 }"
        >
          <div class="w-32 h-32 rounded-full flex items-center justify-center mb-4" style="background-color: #E3F450;">
            <img :src="icon.src" :alt="icon.title" class="w-30 h-30" />
          </div>
          <h3 class="text-lg font-bold uppercase">
            {{ icon.title }}
          </h3>
        </motion.div>
      </div>

      <!-- CTA Button -->
      <div class="text-center sm:text-left">
        <router-link v-if="authStore.isAuthenticated" to="/catalogo">
          <Button 
            class="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity orbitron-variable"
            style="--orbitron-weight: 700; background-color: #E3F450; color: black;"
          >
            VER CATÁLOGO
          </Button>
        </router-link>
        <router-link v-else to="/crear-cuenta">
          <Button 
            class="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity orbitron-variable"
            style="--orbitron-weight: 700; background-color: #E3F450; color: black;"
          >
            CREAR CUENTA
          </Button>
        </router-link>
      </div>
    </div>
  </div>

  <!-- Models Carousel -->
  <motion.div
    class="bg-black text-black px-4 sm:px-6 lg:px-8 -mt-15"
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ type: 'spring', stiffness: 250, damping: 30 }"
  >
    <div class="max-w-7xl mx-auto">
      <Carousel class="w-full">
        <CarouselContent>
          <CarouselItem v-for="(image, index) in modelImages" :key="index" class="basis-full sm:basis-1/2 lg:basis-1/3">
            <div class="p-1">
              <div class="relative overflow-hidden rounded-lg aspect-[3/4]">
                <img 
                  :src="image" 
                  :alt="`Model ${index + 1}`"
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div class="text-center sm:text-right py-4 sm:py-6">
        <router-link to="/catalogo">
          <Button 
            class="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity orbitron-variable"
            style="--orbitron-weight: 700; background-color: #E3F450; color: black;"
          >
            VER CATÁLOGO
          </Button>
        </router-link>
      </div>
    </div>
  </motion.div>

  <!-- World Section -->
  <div 
    class="min-h-screen bg-black text-white relative flex items-center justify-center py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8" 
    :style="{ backgroundImage: `url(${worldBg})`, backgroundSize: 'contain', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }"
  >
    <div class="max-w-6xl mx-auto w-full text-center relative z-10">
      <div class="max-w-2xl mx-auto">
        <!-- Yellow Highlight Text -->
        <div class="inline-block mb-4 sm:mb-6" style="background-color: #E3F450; color: black; padding: 0.5rem 1rem sm:padding: 0.5rem 1.5rem;">
          <p class="text-sm sm:text-lg md:text-xl font-bold uppercase orbitron-variable" style="--orbitron-weight: 600;">
            CADA AÑO SE FABRICAN MÁS DE
          </p>
        </div>
        
        <!-- Main Statistic -->
        <h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-6 sm:mb-8" style="font-family: 'Avenir Next', sans-serif; line-height: 1.1;">
          100 MIL<br>
          MILLONES DE<br>
          PRENDAS
        </h2>
        
        <!-- Black Box with Secondary Stat -->
        <div class="inline-block" style="background-color: rgba(0, 0, 0, 0.8); padding: 0.75rem 1.5rem sm:padding: 1rem 2rem;">
          <p class="text-base sm:text-xl md:text-2xl font-bold uppercase" style="color: #E3F450;">
            EL 40% TERMINA EN VERTEDEROS
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Last Section -->
  <div 
    class="min-h-screen bg-black text-white relative z-200 flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8" 
    :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'top 300px center', backgroundRepeat: 'no-repeat' }"
  >
    <!-- Gradient spotlight effect at bottom -->
    <div class="absolute bottom-0 right-1/4 w-[800px] h-[600px] bg-gradient-radial from-[#E3F450]/40 via-yellow-300/30 to-transparent rounded-full blur-3xl"></div>
    
    <div class="max-w-6xl mx-auto text-center relative z-200">
      <!-- Main Heading -->
      <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-8 sm:mb-12 leading-tight relative sm:top-[-140px]" style="font-family: 'Avenir Next', sans-serif;">
        VISTE INTELIGENTE,<br>
        VISTE
      </h2>
      
      <!-- Logo Section -->
      <div class="mb-12 sm:mb-16">
        <img :src="logoWhiteYellow" alt="TailorX Logo" class="mx-auto w-48 sm:w-64 md:w-80 relative sm:top-[-150px]" />
      </div>
      
      <!-- Footer Navigation -->
      <nav class="mb-6 sm:mb-8">
        <div class="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs sm:text-sm md:text-base orbitron-variable" style="--orbitron-weight: 400;">
          <a href="#" class="hover:text-[#E3F450] transition-colors uppercase whitespace-nowrap">POLÍTICAS DE ENTREGA</a>
          <span class="text-gray-500 hidden sm:inline">|</span>
          <a href="#" class="hover:text-[#E3F450] transition-colors uppercase">AYUDA</a>
          <span class="text-gray-500 hidden sm:inline">|</span>
          <a href="#" class="hover:text-[#E3F450] transition-colors uppercase">EXPERIENCIAS</a>
          <span class="text-gray-500 hidden sm:inline">|</span>
          <a href="#" class="hover:text-[#E3F450] transition-colors uppercase">CONTACTO</a>
        </div>
      </nav>
      
      <!-- Social Media Icons -->
      <div class="flex justify-center gap-3 sm:space-x-4">
        <a href="#" class="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <FacebookIcon />
        </a>
        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <TwitterIcon />
        </a>
        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <InstagramIcon />
        </a>
        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <WhatsAppIcon />
        </a>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import NavigationBar from '@/components/NavigationBar.vue'
import TwitterIcon from '@/components/icons/TwitterIcon.vue'
import FacebookIcon from '@/components/icons/FacebookIcon.vue'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon.vue'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'
import { motion } from 'motion-v' // Added motion-v import
import bgImage from '@/assets/backgrounds/elemento-amarillo.png'
import yellowDude from '@/assets/backgrounds/yellow-dude.jpg'
import elementoImg from '@/assets/elements/elemento.png'
import createAccountIcon from '@/assets/icons/4.svg'
import giveMeasurementsIcon from '@/assets/icons/2.svg'
import hangingShirtIcon from '@/assets/icons/1.svg'
import shirtPriceTagIcon from '@/assets/icons/3.svg'
import logoWhiteYellow from '@/assets/elements/logo-blanco-amarillo.png'
import modelImg1 from '@/assets/model-images/img1.jpg'
import modelImg2 from '@/assets/model-images/img2.jpg'
import modelImg3 from '@/assets/model-images/img3.jpg'
import modelImg4 from '@/assets/model-images/img4.jpg'
import modelImg5 from '@/assets/model-images/img5.jpg'
import worldBg from '@/assets/backgrounds/world-bg.png'

const authStore = useAuthStore()

const modelImages = [modelImg1, modelImg2, modelImg3, modelImg4, modelImg5]
</script>

<style scoped>
/* Add hover effect for buttons */
button:hover {
  background-color: #E3F450 !important;
  color: black !important;
}

/* Add hover effect for social media icons */
.w-6:hover, .w-12:hover {
  background-color: #E3F450 !important;
}
</style>