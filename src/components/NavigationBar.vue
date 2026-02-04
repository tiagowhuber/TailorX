<template>
  <motion.header
    ref="headerRef"
    class="sticky top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10"
    :animate="headerAnimate"
    :transition="headerTransition"
  >
    <!-- Logo -->
    <router-link to="/" class="flex items-center flex-shrink-0">
      <img 
        src="@/assets/elements/logo-blanco.png" 
        alt="TailorX Logo"
        :style="{
          height: `clamp(1.75rem, ${2.5 - scrollProgress * 0.5}rem, 2.5rem)`,
          transition: 'height 0.1s ease-out'
        }"
        class="max-h-10 w-auto"
      />
    </router-link>
    
    <!-- Desktop Navigation Menu -->
    <nav class="hidden md:flex text-base font-medium items-end">
      <div class="flex space-x-8">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.id"
          :to="tab.to"
          class="nav-link"
          :class="{ active: activeTabId === tab.id }"
        >
          <span class="relative px-2 py-1 inline-block">
            {{ tab.title }}
            <motion.div
              v-if="activeTabId === tab.id"
              layout-id="nav-underline"
              class="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#E3F450] rounded"
              :transition="underlineTransition"
            />
          </span>
        </RouterLink>
      </div>
    </nav>
    
    <!-- Right Side: Social Icons, Cart & Profile -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Social Media Icons - Hidden on mobile, visible on tablet+ -->
      <div class="hidden sm:flex items-center gap-2">
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <TwitterSmallIcon />
        </a>
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <FacebookSmallIcon />
        </a>
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <InstagramSmallIcon />
        </a>
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <WhatsAppSmallIcon />
        </a>
      </div>

      <!-- Cart Icon (only when authenticated and has items) -->
      <template v-if="authStore.isAuthenticated && cartStore.itemCount > 0">
        <Separator orientation="vertical" class="hidden sm:block h-6 bg-white/30 mx-1" />
        
        <router-link 
          to="/carrito" 
          class="relative min-w-[2.75rem] h-11 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors active:scale-95"
        >
          <ShoppingCart class="w-5 h-5 text-white" />
          <Badge 
            v-if="cartStore.itemCount > 0" 
            class="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center px-1.5 bg-[#E3F450] text-black font-bold text-xs border border-black"
          >
            {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
          </Badge>
        </router-link>
      </template>

      <!-- Profile Dropdown (only when authenticated) -->
      <template v-if="authStore.isAuthenticated">
        <Separator orientation="vertical" class="hidden sm:block h-6 bg-white/30 mx-1" />

        <!-- Desktop/Tablet: show dropdown; Mobile: show inert avatar button -->
        <div>
          <DropdownMenu v-if="!isMobile">
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="relative h-11 w-11 rounded-full hover:bg-white/10 p-0 active:scale-95 transition-transform">
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
              <DropdownMenuItem @click="router.push({ name: 'measurements' })" class="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                <RulerDimensionLine class="mr-2 h-4 w-4" />
                <span>Mis Medidas</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="router.push({ name: 'patterns' })" class="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                <Scissors class="mr-2 h-4 w-4" />
                <span>Mis Patrones</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="router.push({ name: 'orders' })" class="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                <BaggageClaim class="mr-2 h-4 w-4" />
                <span>Mis Pedidos</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator class="bg-white/20" />
              <DropdownMenuItem @click="handleLogout" class="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- On mobile, clicking avatar does nothing -->
          <Button
            v-else
            variant="ghost"
            class="relative h-11 w-11 rounded-full hover:bg-white/10 p-0 active:scale-95 transition-transform"
            @click.stop.prevent
            aria-hidden="true"
          >
            <Avatar class="h-10 w-10 border-2 border-[#E3F450]/50 transition-colors">
              <AvatarImage v-if="getProfilePictureUrl()" :src="getProfilePictureUrl()!" :alt="authStore.user?.first_name || 'User'" />
              <AvatarFallback class="bg-[#E3F450] text-black font-bold text-sm">
                {{ getInitials() }}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </template>

      <!-- Mobile Menu Button (always visible on mobile, hidden on desktop) -->
      <button
        @click="toggleMobileMenu"
        class="md:hidden min-w-[2.75rem] h-11 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors active:scale-95 ml-2"
        aria-label="Toggle navigation menu"
        :aria-expanded="isMobileMenuOpen"
      >
        <Menu v-if="!isMobileMenuOpen" class="w-6 h-6 text-white" />
        <X v-else class="w-6 h-6 text-white" />
      </button>
    </div>
  </motion.header>

  <!-- Mobile Navigation Drawer -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
        @click="closeMobileMenu"
        aria-hidden="true"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <motion.nav
        v-if="isMobileMenuOpen"
        class="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-black border-l border-white/10 z-50 md:hidden overflow-y-auto"
        :initial="{ x: '100%' }"
        :animate="{ x: 0 }"
        :exit="{ x: '100%' }"
        :transition="{ type: 'spring', damping: 25, stiffness: 200 }"
      >
        <!-- Mobile Menu Header -->
        <div class="flex items-center justify-between p-4 border-b border-white/10">
          <img
            src="@/assets/elements/logo-blanco.png"
            alt="TailorX Logo"
            class="h-8"
          />
          <button
            @click="closeMobileMenu"
            class="min-w-[2.75rem] h-11 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X class="w-6 h-6 text-white" />
          </button>
        </div>

        <!-- Mobile Navigation Links -->
        <div class="p-4 space-y-2">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.id"
            :to="tab.to"
            @click="closeMobileMenu"
            :class="[
              'block px-4 py-3.5 rounded-lg text-base font-medium transition-all',
              activeTabId === tab.id
                ? 'bg-white text-black'
                : 'text-white hover:bg-white/5 active:bg-white/10'
            ]"
          >
            {{ tab.title }}
          </RouterLink>
        </div>

        <!-- Mobile Social Links -->
        <div class="px-4 py-6 border-t border-white/10">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Síguenos
          </p>
          <div class="flex gap-3">
            <a href="#" class="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors active:scale-95">
              <TwitterSmallIcon />
            </a>
            <a href="#" class="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors active:scale-95">
              <FacebookSmallIcon />
            </a>
            <a href="#" class="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors active:scale-95">
              <InstagramSmallIcon />
            </a>
            <a href="#" class="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors active:scale-95">
              <WhatsAppSmallIcon />
            </a>
          </div>
        </div>

        <!-- Mobile User Actions (if authenticated) -->
        <div v-if="authStore.isAuthenticated" class="px-4 pb-6 border-t border-white/10 pt-4">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Mi Cuenta
          </p>
          <div class="space-y-2">
            <button
              @click="navigateAndClose({ name: 'account' })"
              class="w-full flex items-center px-4 py-3.5 rounded-lg text-white hover:bg-white/5 active:bg-white/10 transition-colors text-left"
            >
              <UserIcon class="mr-3 h-5 w-5 text-[#E3F450]" />
              <span class="font-medium">Mi Cuenta</span>
            </button>
            <button
              @click="navigateAndClose({ name: 'measurements' })"
              class="w-full flex items-center px-4 py-3.5 rounded-lg text-white hover:bg-white/5 active:bg-white/10 transition-colors text-left"
            >
              <RulerDimensionLine class="mr-3 h-5 w-5 text-[#E3F450]" />
              <span class="font-medium">Mis Medidas</span>
            </button>
            <button
              @click="navigateAndClose({ name: 'patterns' })"
              class="w-full flex items-center px-4 py-3.5 rounded-lg text-white hover:bg-white/5 active:bg-white/10 transition-colors text-left"
            >
              <Scissors class="mr-3 h-5 w-5 text-[#E3F450]" />
              <span class="font-medium">Mis Patrones</span>
            </button>
            <button
              @click="navigateAndClose({ name: 'orders' })"
              class="w-full flex items-center px-4 py-3.5 rounded-lg text-white hover:bg-white/5 active:bg-white/10 transition-colors text-left"
            >
              <BaggageClaim class="mr-3 h-5 w-5 text-[#E3F450]" />
              <span class="font-medium">Mis Pedidos</span>
            </button>
            <button
              @click="handleMobileLogout"
              class="w-full flex items-center px-4 py-3.5 rounded-lg text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-colors text-left"
            >
              <LogOut class="mr-3 h-5 w-5" />
              <span class="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </motion.nav>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { User as UserIcon, LogOut, RulerDimensionLine, Scissors, ShoppingCart, BaggageClaim, Menu, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion-v'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import TwitterSmallIcon from '@/components/icons/TwitterSmallIcon.vue'
import FacebookSmallIcon from '@/components/icons/FacebookSmallIcon.vue'
import WhatsAppSmallIcon from '@/components/icons/WhatsAppSmallIcon.vue'
import InstagramSmallIcon from '@/components/icons/InstagramSmallIcon.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const headerRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const isMobileMenuOpen = ref(false)

// Reactive breakpoint check (mobile = <768px)
const isMobile = ref(window.innerWidth < 768)
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

let ticking = false

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Prevent body scroll when menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const navigateAndClose = (route: any) => {
  router.push(route)
  closeMobileMenu()
}

const handleMobileLogout = async () => {
  closeMobileMenu()
  await authStore.logout()
  router.push('/login')
}

const updateScrollProgress = () => {
  const scrollY = window.scrollY
  const maxScroll = 100 // Maximum scroll distance for full effect
  
  // Calculate progress from 0 to 1
  const progress = Math.min(scrollY / maxScroll, 1)
  
  // Apply easing function for smoother transition (ease-out cubic)
  scrollProgress.value = 1 - Math.pow(1 - progress, 3)
  
  ticking = false
}

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollProgress)
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  updateScrollProgress() // Initial calculation
  handleResize() // initialize
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  closeMobileMenu() // Cleanup mobile menu state
})

// Tabs config for the nav underline animation
const tabs = [
  { id: 'home', title: 'Inicio', to: '/' },
  { id: 'catalogo', title: 'Catálogo', to: '/catalogo' },
  { id: 'contacto', title: 'Contacto', to: '/#contacto' },
]

const activeTabId = computed(() => {
  const path = router.currentRoute.value.path
  if (path === '/catalogo') return 'catalogo'
  if (path === '/') return 'home'
  return tabs.find(t => t.to === path)?.id || 'home'
})

// motion-v animation configs
const headerAnimate = computed(() => ({
  paddingTop: `${1 - scrollProgress.value * 0.5}rem`,
  paddingBottom: `${1 - scrollProgress.value * 0.5}rem`,
  backdropFilter: scrollProgress.value > 0.1 ? `blur(${scrollProgress.value * 12}px)` : 'none',
  boxShadow: scrollProgress.value > 0.1 ? `0 10px 30px rgba(0, 0, 0, ${scrollProgress.value * 0.3})` : 'none',
}))

const headerTransition = { type: 'spring' as const, stiffness: 500, damping: 40 }
const underlineTransition = { type: 'spring' as const, stiffness: 700, damping: 35 }

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
@font-face {
  font-family: 'Stack Sans Notch';
  src: url('@/assets/fonts/Stack_Sans_Notch/static/StackSansNotch-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* Apply Stack Sans Notch font globally */
body {
  font-family: 'Stack Sans Notch', sans-serif;
}

/* Navigation links */
.nav-link {
  font-family: 'Stack Sans Notch', sans-serif;
  font-weight: 300; 
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.2s;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  position: relative;
  display: inline-block;
}

.nav-link:hover {
  color: rgba(255, 255, 255, 1);
}

.nav-link.active {
  color: rgba(255, 255, 255, 1);
}

/* Dropdown menu items */
.DropdownMenuItem {
  font-family: 'Stack Sans Notch', sans-serif;
  font-weight: 400; 
}

/* Dropdown menu content */
.DropdownMenuContent {
  font-family: 'Stack Sans Notch', sans-serif;
}
</style>
