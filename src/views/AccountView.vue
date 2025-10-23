<template>
  <div 
    class="min-h-screen bg-black text-white overflow-hidden relative" 
    :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'top 600px center', backgroundRepeat: 'no-repeat' }"
  >
    <!-- Background spotlight effect -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-lime-400/30 via-yellow-300/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-lime-400/20 via-yellow-300/10 to-transparent rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
    
    <!-- Navigation Header -->
    <header class="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-6">
      <!-- Logo -->
      <router-link to="/" class="flex items-center">
        <h1 class="text-2xl font-bold tracking-widest">TAILORX</h1>
        <p class="text-xs text-gray-400 ml-4 tracking-wide">DRESS WITHOUT WASTE</p>
      </router-link>
      
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

        <!-- Separator -->
        <Separator orientation="vertical" class="h-6 bg-white/30 mx-2" />
        
        <!-- Profile Dropdown -->
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
            <DropdownMenuItem @click="showEditProfile = true" class="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
              <Settings class="mr-2 h-4 w-4" />
              <span>Editar Perfil</span>
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
      </div>
    </header>

    <!-- Main Content - Account Dashboard -->
    <div class="relative z-10 w-full max-w-6xl mx-auto px-8 pt-32 pb-16">
      <Card class="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
        <CardHeader class="pb-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <Avatar class="h-16 w-16 border-2 border-[#E3F450]">
                <AvatarImage v-if="getProfilePictureUrl()" :src="getProfilePictureUrl()!" :alt="authStore.user?.first_name || 'User'" />
                <AvatarFallback class="bg-[#E3F450] text-black text-xl font-bold">
                  {{ getInitials() }}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle class="text-4xl font-black text-white mb-1">
                  MI CUENTA
                </CardTitle>
                <CardDescription class="text-gray-400 font-normal text-base">
                  Bienvenido, {{ authStore.user?.first_name }}
                </CardDescription>
              </div>
            </div>
            <Button 
              @click="handleLogout"
              class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold uppercase"
            >
              <LogOut class="mr-2 h-5 w-5" />
              Cerrar Sesión
            </Button>
          </div>
        </CardHeader>

        <Separator class="bg-white/20 mb-8" />

        <CardContent class="space-y-8">
          <!-- Account Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- User Information -->
            <Card class="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle class="text-2xl font-bold text-[#E3F450]">
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-3">
                <div>
                  <Label class="text-gray-400 text-sm">Email</Label>
                  <p class="text-white text-lg">{{ authStore.user?.email }}</p>
                </div>
                <div v-if="authStore.user?.first_name">
                  <Label class="text-gray-400 text-sm">Nombre</Label>
                  <p class="text-white text-lg">{{ authStore.user.first_name }} {{ authStore.user.last_name }}</p>
                </div>
                <div>
                  <Label class="text-gray-400 text-sm">Miembro desde</Label>
                  <p class="text-white text-lg">{{ formatDate(authStore.user?.created_at) }}</p>
                </div>
                <Separator class="bg-white/20 my-4" />
                <Button 
                  @click="showEditProfile = true"
                  class="w-full py-3 bg-[#E3F450] hover:opacity-90 text-black font-semibold uppercase"
                >
                  <Settings class="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            <!-- Quick Stats -->
            <Card class="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle class="text-2xl font-bold text-[#E3F450]">
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">Pedidos realizados</span>
                  <span class="text-2xl font-bold text-white">0</span>
                </div>
                <Separator class="bg-white/20" />
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">Prendas creadas</span>
                  <span class="text-2xl font-bold text-white">0</span>
                </div>
                <Separator class="bg-white/20" />
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">Medidas guardadas</span>
                  <span class="text-2xl font-bold text-white">0</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator class="bg-white/20" />

          <!-- Quick Actions -->
          <div>
            <h3 class="text-2xl font-bold text-white mb-4">Acciones Rápidas</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                class="bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                @click="router.push({ name: 'catalogo' })"
              >
                <CardHeader class="text-center">
                  <CardTitle class="text-xl font-bold text-white">Ver Catálogo</CardTitle>
                  <CardDescription class="text-gray-400 text-sm">Explora nuestras prendas</CardDescription>
                </CardHeader>
              </Card>
              
              <Card class="bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                <CardHeader class="text-center">
                  <CardTitle class="text-xl font-bold text-white">Mis Medidas</CardTitle>
                  <CardDescription class="text-gray-400 text-sm">Gestionar medidas</CardDescription>
                </CardHeader>
              </Card>
              
              <Card class="bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                <CardHeader class="text-center">
                  <CardTitle class="text-xl font-bold text-white">Mis Pedidos</CardTitle>
                  <CardDescription class="text-gray-400 text-sm">Ver historial</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfile" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 max-w-md w-full mx-4">
        <h3 class="text-2xl font-bold mb-6">Editar Perfil</h3>
        
        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          <!-- Profile Picture Section -->
          <div class="space-y-3">
            <Label class="text-white font-medium">Foto de Perfil</Label>
            <div class="flex items-center gap-4">
              <Avatar class="h-20 w-20 border-2 border-[#E3F450]">
                <AvatarImage 
                  v-if="previewUrl || getProfilePictureUrl()" 
                  :src="previewUrl || getProfilePictureUrl()!" 
                  :alt="authStore.user?.first_name || 'User'" 
                />
                <AvatarFallback class="bg-[#E3F450] text-black text-xl font-bold">
                  {{ getInitials() }}
                </AvatarFallback>
              </Avatar>
              <div class="flex flex-col gap-2 flex-1">
                <div class="flex gap-2">
                  <Button
                    type="button"
                    @click="() => ($refs.fileInput as HTMLInputElement)?.click()"
                    class="flex-1 py-2 bg-[#E3F450] hover:opacity-90 text-black font-semibold uppercase text-sm"
                  >
                    <Upload class="mr-2 h-4 w-4" />
                    Subir
                  </Button>
                  <Button
                    v-if="authStore.user?.profile_picture_url"
                    type="button"
                    @click="handleDeleteProfilePicture"
                    :disabled="isUploading"
                    class="py-2 px-3 bg-red-500 hover:bg-red-600 text-white font-semibold"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  @change="handleFileSelect"
                  class="hidden"
                />
                <p class="text-xs text-gray-400">JPEG, PNG o WebP (máx. 2MB)</p>
              </div>
            </div>
            <p v-if="uploadError" class="text-red-400 text-sm">{{ uploadError }}</p>
          </div>

          <Separator class="bg-white/20" />

          <div class="space-y-2">
            <Label for="firstName" class="text-white font-medium">
              Nombre
            </Label>
            <Input 
              id="firstName"
              v-model="editForm.first_name"
              type="text"
              class="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>

          <div class="space-y-2">
            <Label for="lastName" class="text-white font-medium">
              Apellido
            </Label>
            <Input 
              id="lastName"
              v-model="editForm.last_name"
              type="text"
              class="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>

          <div v-if="editError" class="text-red-400 text-sm text-center">
            {{ editError }}
          </div>

          <div class="flex gap-4">
            <Button 
              type="button"
              @click="() => { showEditProfile = false; resetEditModal() }"
              class="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold uppercase"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              :disabled="isUpdating"
              class="flex-1 py-3 bg-[#E3F450] hover:opacity-90 text-black font-semibold uppercase"
            >
              {{ isUpdating ? 'Guardando...' : 'Guardar' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User as UserIcon, LogOut, Settings, ShoppingBag, Upload, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import bgImage from '@/assets/backgrounds/elemento-amarillo.png'

const router = useRouter()
const authStore = useAuthStore()

const showEditProfile = ref(false)
const editError = ref('')
const isUpdating = ref(false)
const uploadError = ref('')
const isUploading = ref(false)
const previewUrl = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const editForm = ref({
  first_name: authStore.user?.first_name || '',
  last_name: authStore.user?.last_name || '',
})

const getInitials = () => {
  const firstName = authStore.user?.first_name || '';
  const lastName = authStore.user?.last_name || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
};

const getProfilePictureUrl = () => {
  if (!authStore.user?.profile_picture_url) return null
  // If it's a Google URL, use it directly; otherwise prepend API base URL
  if (authStore.user.profile_picture_url.startsWith('http')) {
    return authStore.user.profile_picture_url
  }
  return `http://localhost:3000${authStore.user.profile_picture_url}`
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleUpdateProfile = async () => {
  editError.value = ''
  isUpdating.value = true

  try {
    // Update profile data (name)
    const result = await authStore.updateProfile(editForm.value)
    
    if (!result.success) {
      editError.value = result.message || 'Error al actualizar el perfil'
      return
    }

    // Upload profile picture if selected
    if (selectedFile.value) {
      const uploadResult = await authStore.uploadProfilePicture(selectedFile.value)
      if (!uploadResult.success) {
        editError.value = uploadResult.message || 'Error al subir la imagen'
        return
      }
    }

    // Success - close modal and reset
    showEditProfile.value = false
    selectedFile.value = null
    previewUrl.value = null
  } catch (err) {
    editError.value = 'Error al actualizar el perfil'
  } finally {
    isUpdating.value = false
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Validate file type
  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
    uploadError.value = 'Solo se permiten imágenes JPEG, PNG o WebP'
    return
  }

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = 'La imagen no debe superar los 2MB'
    return
  }

  selectedFile.value = file
  uploadError.value = ''

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleDeleteProfilePicture = async () => {
  isUploading.value = true
  uploadError.value = ''

  try {
    const result = await authStore.deleteProfilePicture()
    if (!result.success) {
      uploadError.value = result.message || 'Error al eliminar la imagen'
    }
  } catch (err) {
    uploadError.value = 'Error al eliminar la imagen'
  } finally {
    isUploading.value = false
  }
}

const resetEditModal = () => {
  editForm.value = {
    first_name: authStore.user?.first_name || '',
    last_name: authStore.user?.last_name || '',
  }
  selectedFile.value = null
  previewUrl.value = null
  editError.value = ''
  uploadError.value = ''
}

// Redirect if not authenticated
if (!authStore.isAuthenticated) {
  router.push('/login')
}
</script>

<style scoped>
/* Gradient radial utility */
.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}

/* Custom input styles */
:deep(.bg-white\/10) {
  backdrop-filter: blur(8px);
}

:deep(input:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(227, 244, 80, 0.2);
}
</style>
