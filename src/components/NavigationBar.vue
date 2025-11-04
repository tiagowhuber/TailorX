<template>
  <motion.header
    ref="headerRef"
    class="sticky top-0 left-0 right-0 z-50 flex justify-between items-center px-8 bg-black border-b border-white/10"
    :animate="headerAnimate"
    :transition="headerTransition"
  >
    <!-- Logo -->
    <router-link to="/" class="flex items-center">
      <img 
        src="@/assets/elements/logo-blanco.png" 
        alt="TailorX Logo"
        :style="{
          height: `${2.5 - scrollProgress * 0.5}rem`,
          transition: 'height 0.1s ease-out'
        }"
      />
    </router-link>
    
    <!-- Navigation Menu -->
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
            <DropdownMenuItem @click="router.push({ name: 'measurements' })" class="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
              <Ruler class="mr-2 h-4 w-4" />
              <span>Mis Medidas</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="router.push({ name: 'patterns' })" class="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
              <FileText class="mr-2 h-4 w-4" />
              <span>Mis Patrones</span>
            </DropdownMenuItem>
            <!-- <DropdownMenuItem @click="router.push({ name: 'catalogo' })" class="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
              <ShoppingBag class="mr-2 h-4 w-4" />
              <span>Catálogo</span>
            </DropdownMenuItem> -->
            <DropdownMenuSeparator class="bg-white/20" />
            <DropdownMenuItem @click="handleLogout" class="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
              <LogOut class="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </div>
  </motion.header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User as UserIcon, LogOut, Ruler, FileText } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
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
const headerRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)

let ticking = false

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
  updateScrollProgress() // Initial calculation
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Tabs config for the nav underline animation
const tabs = [
  { id: 'home', title: 'Inicio', to: '/' },
  { id: 'tailorx', title: 'TailorX', to: '/#tailorx' },
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
.nav-link {
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
</style>
