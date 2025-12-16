<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="relative pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Sidebar -->
          <AccountSidebar active-section="addresses" />

          <!-- Main Content Area -->
          <main class="flex-1 min-w-0">
            <!-- Header -->
            <motion.div
              class="mb-8 flex justify-between items-center"
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ type: 'spring', stiffness: 250, damping: 30 }"
            >
              <div>
                <h1 class="text-3xl font-bold text-white">MIS DIRECCIONES</h1>
                <p class="text-gray-400 text-sm mt-1">Administra tus direcciones de envío</p>
              </div>
              <Button 
                @click="showAddModal = true"
                class="bg-[#E3F450] text-black hover:bg-[#E3F450]/80"
              >
                <Plus class="mr-2 h-4 w-4" />
                Nueva Dirección
              </Button>
            </motion.div>

            <!-- Addresses List -->
            <motion.div
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ type: 'spring', stiffness: 200, damping: 25 }"
            >
              <div v-if="loading" class="flex justify-center py-12">
                <Loader2 class="h-8 w-8 animate-spin text-[#E3F450]" />
              </div>

              <div v-else-if="addresses.length === 0" class="text-center py-12 bg-white/5 rounded-lg border border-white/10">
                <MapPin class="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h3 class="text-lg font-medium text-white mb-2">No tienes direcciones guardadas</h3>
                <p class="text-gray-400 mb-6">Agrega una dirección para agilizar tus compras</p>
                <Button 
                  @click="showAddModal = true"
                  variant="outline"
                  class="border-white/20 text-black hover:bg-white/10"
                >
                  Agregar Dirección
                </Button>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card 
                  v-for="addr in addresses" 
                  :key="addr.id"
                  class="bg-white/5 border-white/10 relative group"
                >
                  <CardHeader>
                    <div class="flex justify-between items-start">
                      <CardTitle class="text-lg font-medium text-white flex items-center gap-2">
                        <MapPin class="h-4 w-4 text-[#E3F450]" />
                        {{ addr.recipient_name || 'Mi Dirección' }}
                      </CardTitle>
                      <Badge v-if="addr.is_default" class="bg-[#E3F450] text-black hover:bg-[#E3F450]">
                        Principal
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div class="space-y-1 text-gray-300">
                      <p>{{ addr.street_address }} {{ addr.apartment_unit }}</p>
                      <p>{{ addr.comuna }}, {{ addr.region }}</p>
                    </div>
                  </CardContent>
                  <CardFooter class="flex justify-end gap-2 pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      class="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      @click="confirmDelete(addr)"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>

    <!-- Add Address Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="bg-zinc-900 rounded-2xl p-8 border border-white/10 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-white">Nueva Dirección</h3>
          <Button variant="ghost" size="icon" @click="closeModal" class="text-gray-400 hover:text-white">
            <X class="h-5 w-5" />
          </Button>
        </div>
        
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="recipientName">Nombre del Destinatario (Opcional)</Label>
            <Input id="recipientName" v-model="recipientName" v-bind="recipientNameAttrs" class="bg-black/50 border-white/20 text-white" placeholder="Ej: Casa, Oficina, Juan Pérez" />
            <span class="text-xs text-red-500">{{ errors.recipientName }}</span>
          </div>

          <div class="space-y-2">
            <Label for="streetAddress">Dirección</Label>
            <Input id="streetAddress" v-model="streetAddress" v-bind="streetAddressAttrs" class="bg-black/50 border-white/20 text-white" placeholder="Av. Siempre Viva 123" />
            <span class="text-xs text-red-500">{{ errors.streetAddress }}</span>
          </div>

          <div class="space-y-2">
            <Label for="apartmentUnit">Depto / Unidad (Opcional)</Label>
            <Input id="apartmentUnit" v-model="apartmentUnit" v-bind="apartmentUnitAttrs" class="bg-black/50 border-white/20 text-white" placeholder="Depto 402" />
            <span class="text-xs text-red-500">{{ errors.apartmentUnit }}</span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="comuna">Comuna / Ciudad</Label>
              <Input id="comuna" v-model="comuna" v-bind="comunaAttrs" class="bg-black/50 border-white/20 text-white" placeholder="Santiago" />
              <span class="text-xs text-red-500">{{ errors.comuna }}</span>
            </div>
            <div class="space-y-2">
              <Label for="region">Región</Label>
              <Input id="region" v-model="region" v-bind="regionAttrs" class="bg-black/50 border-white/20 text-white" placeholder="Metropolitana" />
              <span class="text-xs text-red-500">{{ errors.region }}</span>
            </div>
          </div>

          <div class="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" 
              id="isDefault" 
              v-model="isDefault"
              class="rounded border-white/20 bg-black/50 text-[#E3F450] focus:ring-[#E3F450]"
            />
            <Label for="isDefault" class="cursor-pointer">Establecer como dirección principal</Label>
          </div>

          <div v-if="submitError" class="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">
            {{ submitError }}
          </div>

          <div class="flex gap-4 pt-4">
            <Button 
              type="button"
              variant="outline"
              @click="closeModal"
              class="flex-1 border-white/20 text-black hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              class="flex-1 bg-[#E3F450] text-black hover:bg-[#E3F450]/80"
              :disabled="isSubmitting"
            >
              <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              {{ isSubmitting ? 'Guardando...' : 'Guardar Dirección' }}
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <DialogContent class="bg-zinc-900 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>Eliminar Dirección</DialogTitle>
          <DialogDescription class="text-gray-400">
            ¿Estás seguro de que quieres eliminar esta dirección? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            @click="showDeleteDialog = false"
            variant="outline"
            class="border-white/20 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button
            @click="handleDelete"
            variant="destructive"
            class="bg-red-500 hover:bg-red-600"
            :disabled="isDeleting"
          >
            <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
            {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useAuthStore } from '@/stores/auth'
import { addressesApi } from '@/lib/api'
import type { UserAddress } from '@/types/address.types'
import { 
  MapPin, 
  Plus, 
  Loader2, 
  Trash2, 
  X 
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import NavigationBar from '@/components/NavigationBar.vue'
import AccountSidebar from '@/components/AccountSidebar.vue'
import { motion } from 'motion-v'

const router = useRouter()
const authStore = useAuthStore()

// State
const addresses = ref<UserAddress[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const showDeleteDialog = ref(false)
const addressToDelete = ref<UserAddress | null>(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const submitError = ref('')

// Form Schema
const addressSchema = toTypedSchema(z.object({
  recipientName: z.string().optional(),
  streetAddress: z.string().min(5, 'La dirección es muy corta'),
  apartmentUnit: z.string().optional(),
  comuna: z.string().min(2, 'Comuna requerida'),
  region: z.string().min(2, 'Región requerida'),
  isDefault: z.boolean(),
}))

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: addressSchema,
  initialValues: {
    isDefault: false
  }
})

const [recipientName, recipientNameAttrs] = defineField('recipientName')
const [streetAddress, streetAddressAttrs] = defineField('streetAddress')
const [apartmentUnit, apartmentUnitAttrs] = defineField('apartmentUnit')
const [comuna, comunaAttrs] = defineField('comuna')
const [region, regionAttrs] = defineField('region')
const [isDefault] = defineField('isDefault')

// Methods
const fetchAddresses = async () => {
  loading.value = true
  try {
    const response = await addressesApi.getUserAddresses()
    if (response.success) {
      addresses.value = response.data
    }
  } catch (error) {
    console.error('Error fetching addresses:', error)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  resetForm()
  submitError.value = ''
}

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  submitError.value = ''

  try {
    const response = await addressesApi.createAddress({
      recipient_name: values.recipientName,
      street_address: values.streetAddress,
      apartment_unit: values.apartmentUnit,
      comuna: values.comuna,
      region: values.region,
      is_default: values.isDefault,
    })

    if (response.success) {
      await fetchAddresses()
      closeModal()
    } else {
      submitError.value = response.message || 'Error al guardar la dirección'
    }
  } catch (error: any) {
    submitError.value = error.response?.data?.message || 'Error al guardar la dirección'
  } finally {
    isSubmitting.value = false
  }
})

const confirmDelete = (addr: UserAddress) => {
  addressToDelete.value = addr
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!addressToDelete.value) return

  isDeleting.value = true
  try {
    const response = await addressesApi.deleteAddress(addressToDelete.value.id)
    if (response.success) {
      addresses.value = addresses.value.filter(a => a.id !== addressToDelete.value?.id)
      showDeleteDialog.value = false
      addressToDelete.value = null
    }
  } catch (error) {
    console.error('Error deleting address:', error)
  } finally {
    isDeleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  fetchAddresses()
})
</script>

<style scoped>
/* Apply Stack Sans Notch globally except for h1 */
:deep(*) {
  font-family: 'Stack Sans Notch', sans-serif !important;
}

:deep(h1) {
  font-family: sans-serif !important;
}
</style>
