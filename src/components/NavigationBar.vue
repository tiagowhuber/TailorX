<template>
  <header class="relative z-10 flex justify-between items-center px-8 py-6">
    <!-- Logo -->
    <router-link to="/" class="flex items-center">
      <h1 class="text-2xl font-bold tracking-widest">TAILORX</h1>
      <p class="text-xs text-gray-400 ml-4 tracking-wide">DRESS WITHOUT WASTE</p>
    </router-link>
    
    <!-- Navigation Menu -->
    <nav class="hidden md:flex space-x-12 text-lg font-semibold">
      <router-link to="/" class="hover:text-[#E3F450] transition-colors">INICIO</router-link>
      <span class="text-gray-500">|</span>
      <a href="#" class="hover:text-[#E3F450] transition-colors">TAILORX</a>
      <span class="text-gray-500">|</span>
      <router-link to="/catalogo" class="hover:text-[#E3F450] transition-colors">CATÁLOGO</router-link>
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
import TwitterSmallIcon from '@/components/icons/TwitterSmallIcon.vue'
import FacebookSmallIcon from '@/components/icons/FacebookSmallIcon.vue'
import WhatsAppSmallIcon from '@/components/icons/WhatsAppSmallIcon.vue'
import InstagramSmallIcon from '@/components/icons/InstagramSmallIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

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
/* Ensure consistent styling */
</style>
