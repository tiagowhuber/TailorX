<template>
  <div 
    class="min-h-screen bg-black text-white overflow-hidden relative" 
    :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
  >
    <!-- Background spotlight effect -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-lime-400/30 via-yellow-300/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
    <div class="absolute top-32 right-16 w-64 h-64 bg-gradient-radial from-lime-300/40 via-yellow-200/30 to-transparent rounded-full blur-2xl"></div>
    
    <!-- Navigation Header -->
    <header class="relative z-10 flex justify-between items-center px-8 py-6">
      <!-- Logo -->
      <div class="flex items-center">
        <h1 class="text-2xl font-bold tracking-widest">TAILORX</h1>
        <p class="text-xs text-gray-400 ml-4 tracking-wide">DRESS WITHOUT WASTE</p>
      </div>
      
      <!-- Navigation Menu -->
      <nav class="hidden md:flex space-x-12 text-lg font-semibold">
        <a href="#" class="hover:text-[#E3F450] transition-colors">INICIO</a>
        <span class="text-gray-500">|</span>
        <a href="#" class="hover:text-[#E3F450] transition-colors">TAILORX</a>
        <span class="text-gray-500">|</span>
        <a href="#" class="hover:text-[#E3F450] transition-colors">START NOW</a>
        <span class="text-gray-500">|</span>
        <a href="#" class="hover:text-[#E3F450] transition-colors">CONTACTO</a>
      </nav>
      
      <!-- Social Media Icons & Profile -->
      <div class="flex items-center space-x-3">
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

        <!-- Separator & Profile Dropdown (only when authenticated) -->
        <template v-if="authStore.isAuthenticated">
          <Separator orientation="vertical" class="h-6 bg-white/30 mx-2" />
          
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="relative h-10 w-10 rounded-full hover:bg-white/10 p-0">
                <Avatar class="h-10 w-10 border-2 border-[#E3F450]/50 hover:border-[#E3F450] transition-colors">
                  <AvatarImage v-if="getProfilePictureUrl()" :src="getProfilePictureUrl()!" :alt="authStore.user?.first_name || 'User'" />
                  <AvatarFallback class="bg-[#E3F450] text-black font-bold text-sm">
                    {{ getInitials() }}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56 bg-black/90 backdrop-blur-md border-white/20" align="end">
              <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium leading-none text-white">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</p>
                  <p class="text-xs leading-none text-gray-400">{{ authStore.user?.email }}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator class="bg-white/20" />
              <DropdownMenuItem @click="router.push({ name: 'account' })" class="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                <UserIcon class="mr-2 h-4 w-4" />
                <span>Mi Cuenta</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="router.push({ name: 'catalogo' })" class="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                <ShoppingBag class="mr-2 h-4 w-4" />
                <span>Catálogo</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator class="bg-white/20" />
              <DropdownMenuItem @click="handleLogout" class="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-8">
      <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-8">
          
          <!-- Main Heading -->
          <div class="space-y-4">
            <h2 class="text-5xl md:text-7xl font-black leading-tight" style="font-family: 'Avenir Next', sans-serif;">
              DRESS<br>
              WITHOUT<br>
              WASTE
            </h2>
            
            <!-- CTA Button -->
            <div v-if="!authStore.isAuthenticated" class="pt-8">
              <router-link to="/crear-cuenta">
                <Button 
                  class="px-8 py-6 text-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity orbitron-variable"
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
      </div>
    </main>
  </div>

  <!-- Yellow Dude Section -->
  <div 
    class="h-200 bg-black text-white overflow-hidden relative" 
    :style="{ backgroundImage: `url(${yellowDude})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
  >
    <div class="absolute inset-0 flex items-center justify-center">
      <p class="text-4xl font-bold">video?</p>
    </div>
  </div>

  <!-- Dress as you Fit Section -->
  <div class="min-h-screen bg-black text-white py-20 px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Section Header -->
      <div class="text-left mb-16">
        <h2 class="text-5xl md:text-6xl font-black mb-6" style="font-family: 'Avenir Next', sans-serif;">
          VISTE A TU<br>MEDIDA
        </h2>
        <p class="text-xl md:text-2xl orbitron-variable" style="--orbitron-weight: 400;">
          PRODUCIMOS SOLO LO QUE SE USA. <span class="text-[#E3F450]">NADA MÁS.</span>
        </p>
      </div>

      <!-- Icons Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 orbitron-variable" style="--orbitron-weight: 400;">
        <!-- Icon 1: Create Account -->
        <div class="flex flex-col items-center text-center orbitron-variable" style="--orbitron-weight: 400;">
          <div class="w-32 h-32 rounded-full flex items-center justify-center mb-4" style="background-color: #E3F450;">
            <img :src="createAccountIcon" alt="Crea tu cuenta" class="w-30 h-30" />
          </div>
          <h3 class="text-lg font-bold uppercase">
            CREA TU<br>CUENTA
          </h3>
        </div>

        <!-- Icon 2: Provide Measurements -->
        <div class="flex flex-col items-center text-center orbitron-variable" style="--orbitron-weight: 400;">
          <div class="w-32 h-32 rounded-full flex items-center justify-center mb-4" style="background-color: #E3F450;">
            <img :src="giveMeasurementsIcon" alt="Proporciona tus medidas" class="w-30 h-30" />
          </div>
          <h3 class="text-lg font-bold uppercase">
            PROPORCIONA<br>TUS MEDIDAS
          </h3>
        </div>

        <!-- Icon 3: Select Garment -->
        <div class="flex flex-col items-center text-center orbitron-variable" style="--orbitron-weight: 400;">
          <div class="w-32 h-32 rounded-full flex items-center justify-center mb-4" style="background-color: #E3F450;">
            <img :src="hangingShirtIcon" alt="Selecciona la prenda" class="w-30 h-30" />
          </div>
          <h3 class="text-lg font-bold uppercase">
            SELECCIONA<br>LA PRENDA
          </h3>
        </div>

        <!-- Icon 4: See It On You -->
        <div class="flex flex-col items-center text-center orbitron-variable" style="--orbitron-weight: 400;">
          <div class="w-32 h-32 rounded-full flex items-center justify-center mb-4" style="background-color: #E3F450;">
            <img :src="shirtPriceTagIcon" alt="Vístelo" class="w-30 h-30" />
          </div>
          <h3 class="text-lg font-bold uppercase">
            VÍSTELO
          </h3>
        </div>
      </div>

      <!-- CTA Button -->
      <div v-if="!authStore.isAuthenticated" class="text-left">
        <router-link to="/crear-cuenta">
          <Button 
            class="px-8 py-6 text-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity orbitron-variable"
            style="--orbitron-weight: 700; background-color: #E3F450; color: black;"
          >
            CREAR CUENTA
          </Button>
        </router-link>
      </div>
    </div>
  </div>

  <!-- Models Carousel -->
  <div class="bg-black text-black px-8 -mt-15">
    <div class="max-w-7xl mx-auto">
      <Carousel class="w-full">
        <CarouselContent>
          <CarouselItem v-for="(image, index) in modelImages" :key="index" class="md:basis-1/2 lg:basis-1/3">
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
      <div class="text-right py-6">
        <router-link to="/catalogo">
          <Button 
            class="px-8 py-6 text-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity orbitron-variable"
            style="--orbitron-weight: 700; background-color: #E3F450; color: black;"
          >
            VER CATÁLOGO
          </Button>
        </router-link>
      </div>
    </div>
  </div>

  <!-- World Section -->
  <div 
    class="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center py-120 px-8" 
    :style="{ backgroundImage: `url(${worldBg})`, backgroundSize: 'contain', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }"
  >
    <div class="max-w-6xl mx-auto w-full text-center relative z-10">
      <div class="max-w-2xl mx-auto">
        <!-- Yellow Highlight Text -->
        <div class="inline-block mb-6" style="background-color: #E3F450; color: black; padding: 0.5rem 1.5rem;">
          <p class="text-lg md:text-xl font-bold uppercase orbitron-variable" style="--orbitron-weight: 600;">
            CADA AÑO SE FABRICAN MÁS DE
          </p>
        </div>
        
        <!-- Main Statistic -->
        <h2 class="text-6xl md:text-8xl font-black mb-8" style="font-family: 'Avenir Next', sans-serif; line-height: 1.1;">
          100 MIL<br>
          MILLONES DE<br>
          PRENDAS
        </h2>
        
        <!-- Black Box with Secondary Stat -->
        <div class="inline-block" style="background-color: rgba(0, 0, 0, 0.8); padding: 1rem 2rem;">
          <p class="text-xl md:text-2xl font-bold uppercase" style="color: #E3F450;">
            EL 40% TERMINA EN VERTEDEROS
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Last Section -->
  <div 
    class="min-h-screen bg-black text-white overflow-hidden relative z-200 flex flex-col items-center justify-center py-20 px-8" 
    :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'top 300px center', backgroundRepeat: 'no-repeat' }"
  >
    <!-- Gradient spotlight effect at bottom -->
    <div class="absolute bottom-0 right-1/4 w-[800px] h-[600px] bg-gradient-radial from-lime-400/40 via-yellow-300/30 to-transparent rounded-full blur-3xl"></div>
    
    <div class="max-w-6xl mx-auto text-center relative z-200">
      <!-- Main Heading -->
      <h2 class="text-5xl md:text-7xl font-black mb-12 leading-tight relative top-[-140px]" style="font-family: 'Avenir Next', sans-serif;">
        VISTE INTELIGENTE,<br>
        VISTE
      </h2>
      
      <!-- Logo Section -->
      <div class="mb-16">
        <h1 class="text-6xl md:text-8xl font-black tracking-widest mb-2 relative top-[-150px]">
          TAILOR<span style="color: #E3F450;">X</span>
        </h1>
        <p class="text-sm md:text-base tracking-[0.3em] uppercase orbitron-variable relative top-[-150px]" style="--orbitron-weight: 400;">
          DRESS WITHOUT WASTE
        </p>
      </div>
      
      <!-- Footer Navigation -->
      <nav class="mb-8">
        <div class="flex flex-wrap justify-center items-center gap-4 text-sm md:text-base orbitron-variable" style="--orbitron-weight: 400;">
          <a href="#" class="hover:text-[#E3F450] transition-colors uppercase">POLÍTICAS DE ENTREGA</a>
          <span class="text-gray-500">|</span>
          <a href="#" class="hover:text-[#E3F450] transition-colors uppercase">AYUDA</a>
          <span class="text-gray-500">|</span>
          <a href="#" class="hover:text-[#E3F450] transition-colors uppercase">EXPERIENCIAS</a>
          <span class="text-gray-500">|</span>
          <a href="#" class="hover:text-[#E3F450] transition-colors uppercase">CONTACTO</a>
        </div>
      </nav>
      
      <!-- Social Media Icons -->
      <div class="flex justify-center space-x-4">
        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <FacebookIcon />
        </a>
        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <TwitterIcon />
        </a>
        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <InstagramIcon />
        </a>
        <a href="#" class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <WhatsAppIcon />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User as UserIcon, LogOut, ShoppingBag } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import TwitterIcon from '@/components/icons/TwitterIcon.vue'
import FacebookIcon from '@/components/icons/FacebookIcon.vue'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon.vue'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'
import TwitterSmallIcon from '@/components/icons/TwitterSmallIcon.vue'
import FacebookSmallIcon from '@/components/icons/FacebookSmallIcon.vue'
import WhatsAppSmallIcon from '@/components/icons/WhatsAppSmallIcon.vue'
import InstagramSmallIcon from '@/components/icons/InstagramSmallIcon.vue'
import bgImage from '@/assets/backgrounds/elemento-amarillo.png'
import yellowDude from '@/assets/backgrounds/yellow-dude.jpg'
import createAccountIcon from '@/assets/icons/create-account-icon.png'
import giveMeasurementsIcon from '@/assets/icons/give-us-measurments-icon.png'
import hangingShirtIcon from '@/assets/icons/hanging-shirt-icon.png'
import shirtPriceTagIcon from '@/assets/icons/shirt-price-tag-icon.png'
import modelImg1 from '@/assets/model-images/img1.jpg'
import modelImg2 from '@/assets/model-images/img2.jpg'
import modelImg3 from '@/assets/model-images/img3.jpg'
import modelImg4 from '@/assets/model-images/img4.jpg'
import modelImg5 from '@/assets/model-images/img5.jpg'
import worldBg from '@/assets/backgrounds/world-bg.png'

const router = useRouter()
const authStore = useAuthStore()

const modelImages = [modelImg1, modelImg2, modelImg3, modelImg4, modelImg5]

const getInitials = () => {
  const firstName = authStore.user?.first_name || '';
  const lastName = authStore.user?.last_name || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
}

const getProfilePictureUrl = () => {
  if (!authStore.user?.profile_picture_url) return null
  // If it's a Google URL, use it directly; otherwise prepend API base URL
  if (authStore.user.profile_picture_url.startsWith('http')) {
    return authStore.user.profile_picture_url
  }
  return `http://localhost:3000${authStore.user.profile_picture_url}`
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
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