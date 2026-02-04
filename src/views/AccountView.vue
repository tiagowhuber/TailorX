<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Main Content - Account Dashboard with Sidebar -->
    <div class="relative pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Sidebar -->
          <AccountSidebar 
            active-section="account" 
            @edit-profile="showEditProfile = true"
          />

          <!-- Main Content Area -->
          <main class="flex-1 min-w-0">
            <!-- Header with Avatar -->
            <motion.div
              class="mb-6 sm:mb-8"
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ type: 'spring', stiffness: 250, damping: 30 }"
            >
              <div class="flex items-center gap-3 sm:gap-4 mb-2">
                <Avatar class="h-12 w-12 sm:h-16 sm:w-16 border-2 border-[#E3F450]">
                  <AvatarImage v-if="getProfilePictureUrl()" :src="getProfilePictureUrl()!" :alt="authStore.user?.first_name || 'User'" />
                  <AvatarFallback class="bg-white/10 text-white text-xl font-bold">
                    {{ getInitials() }}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 class="text-2xl sm:text-3xl font-bold text-white">CONFIGURACIÓN DE CUENTA</h1>
                  <p class="text-gray-400 text-xs sm:text-sm">Administra tu información personal</p>
                </div>
              </div>
            </motion.div>

            <!-- Account Information Card -->
            <motion.div
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ type: 'spring', stiffness: 200, damping: 25 }"
            >
              <Card class="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle class="text-lg font-medium text-white">Información Personal</CardTitle>
                </CardHeader>
                <CardContent class="space-y-6">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label class="text-gray-400 text-xs uppercase tracking-wider">Email</Label>
                      <p class="text-white text-base mt-1">{{ authStore.user?.email }}</p>
                    </div>
                    <div v-if="authStore.user?.first_name">
                      <Label class="text-gray-400 text-xs uppercase tracking-wider">Nombre Completo</Label>
                      <p class="text-white text-base mt-1">{{ authStore.user.first_name }} {{ authStore.user.last_name }}</p>
                    </div>
                  </div>
                  
                  <Separator class="bg-white/10" />
                  
                  <div>
                    <Label class="text-gray-400 text-xs uppercase tracking-wider">Miembro Desde</Label>
                    <p class="text-white text-base mt-1">{{ formatDate(authStore.user?.created_at) }}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfile" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Editar Perfil</h3>
        
        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          <!-- Profile Picture Section -->
          <div class="space-y-3">
            <Label class="text-white font-medium">Foto de Perfil</Label>
            <div class="flex items-center gap-4">
              <Avatar class="h-20 w-20 border-2 border-white/20">
                <AvatarImage 
                  v-if="previewUrl || getProfilePictureUrl()" 
                  :src="previewUrl || getProfilePictureUrl()!" 
                  :alt="authStore.user?.first_name || 'User'" 
                />
                <AvatarFallback class="bg-white/10 text-white text-xl font-bold">
                  {{ getInitials() }}
                </AvatarFallback>
              </Avatar>
              <div class="flex flex-col gap-2 flex-1">
                <div class="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    @click="() => ($refs.fileInput as HTMLInputElement)?.click()"
                    class="flex-1 py-2 border-white/20 text-black hover:bg-white/30 text-sm"
                  >
                    <Upload class="mr-2 h-4 w-4" />
                    Subir
                  </Button>
                  <Button
                    v-if="authStore.user?.profile_picture_url"
                    type="button"
                    variant="outline"
                    @click="handleDeleteProfilePicture"
                    :disabled="isUploading"
                    class="py-2 px-3 border-white/20 text-black hover:bg-red-500/30 hover:border-red-500/50"
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

          <Separator class="bg-white/10" />

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

          <div class="flex gap-4 pt-4">
            <Button 
              type="button"
              variant="outline"
              @click="() => { showEditProfile = false; resetEditModal() }"
              class="flex-1 py-3 border-white/20 text-black hover:bg-white/30"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              variant="outline"
              :disabled="isUpdating"
              class="flex-1 py-3 border-white/20 text-black hover:bg-white/30"
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
import { Upload, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import NavigationBar from '@/components/NavigationBar.vue'
import AccountSidebar from '@/components/AccountSidebar.vue'
import { motion } from 'motion-v' // Added motion-v import

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
/* Custom input styles */
:deep(.bg-white\/10) {
  backdrop-filter: blur(8px);
}

:deep(.bg-white\/5) {
  backdrop-filter: blur(8px);
}

:deep(input:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

/* Smooth scrollbar for mobile horizontal nav */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Apply Stack Sans Notch globally except for h1 */
:deep(*) {
  font-family: 'Stack Sans Notch', sans-serif !important;
}

:deep(h1) {
  font-family: sans-serif !important;
}
</style>
