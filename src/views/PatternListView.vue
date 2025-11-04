<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="relative pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Sidebar -->
          <AccountSidebar active-section="patterns" />

          <!-- Main Content Area -->
          <main class="flex-1 min-w-0">
            <!-- Header -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h1 class="text-3xl font-bold text-white">Mis Patrones</h1>
                  <p class="text-gray-400 text-sm mt-1">Administra todos tus patrones generados</p>
                </div>
              </div>
            </div>

            <!-- Tabs for Pattern Status -->
            <div class="mb-6">
              <div class="flex gap-2 overflow-x-auto pb-2">
                <button
                  @click="activeTab = 'all'"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border',
                    activeTab === 'all' 
                      ? 'bg-white text-black border-white' 
                      : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
                  ]"
                >
                  Todos ({{ patternsStore.patternCount }})
                </button>
                <button
                  @click="activeTab = 'draft'"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border',
                    activeTab === 'draft' 
                      ? 'bg-white text-black border-white' 
                      : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
                  ]"
                >
                  Borradores ({{ patternsStore.draftPatterns.length }})
                </button>
                <button
                  @click="activeTab = 'finalized'"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border',
                    activeTab === 'finalized' 
                      ? 'bg-white text-black border-white' 
                      : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
                  ]"
                >
                  Finalizados ({{ patternsStore.finalizedPatterns.length }})
                </button>
                <button
                  @click="activeTab = 'archived'"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border',
                    activeTab === 'archived' 
                      ? 'bg-white text-black border-white' 
                      : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
                  ]"
                >
                  Archivados ({{ patternsStore.archivedPatterns.length }})
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="patternsStore.loading" class="flex justify-center items-center py-20">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E3F450]"></div>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredPatterns.length === 0" class="text-center py-20">
              <FileText class="mx-auto h-16 w-16 text-gray-600 mb-4" />
              <h3 class="text-xl font-semibold text-gray-400 mb-2">
                {{ emptyStateMessage }}
              </h3>
              <p class="text-gray-500 mb-6">
                {{ emptyStateDescription }}
              </p>
              <Button
                @click="router.push({ name: 'catalogo' })"
                variant="outline"
                class="text-black hover:bg-white/80"
              >
                <Plus class="mr-2 h-4 w-4" />
                Generar mi Primer Patrón
              </Button>
            </div>

            <!-- Patterns Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                v-for="pattern in filteredPatterns"
                :key="pattern.id"
                class="bg-white/5 border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                @click="viewPattern(pattern.id)"
              >
                <CardHeader>
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <CardTitle class="text-lg font-semibold text-white group-hover:text-[#E3F450] transition-colors">
                        {{ pattern.name || `Patrón #${pattern.id}` }}
                      </CardTitle>
                      <CardDescription class="text-gray-400 text-sm mt-1">
                        {{ pattern.design?.name || 'Diseño' }}
                      </CardDescription>
                    </div>
                    <div class="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        @click.stop="openPatternMenu(pattern)"
                        class="text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <MoreVertical class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        pattern.status === 'draft' && 'bg-yellow-500/20 text-yellow-400',
                        pattern.status === 'finalized' && 'bg-green-500/20 text-green-400',
                        pattern.status === 'archived' && 'bg-gray-500/20 text-gray-400'
                      ]"
                    >
                      {{ getStatusLabel(pattern.status) }}
                    </span>
                  </div>
                  
                  <Separator class="bg-white/10" />
                  
                  <div class="space-y-2 text-sm">
                    <div class="flex items-center justify-between text-gray-400">
                      <span>Creado:</span>
                      <span class="text-white">{{ formatDate(pattern.created_at) }}</span>
                    </div>
                    <div v-if="pattern.updated_at && pattern.status === 'finalized'" class="flex items-center justify-between text-gray-400">
                      <span>Actualizado:</span>
                      <span class="text-white">{{ formatDate(pattern.updated_at) }}</span>
                    </div>
                  </div>

                  <div class="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click.stop="downloadPattern(pattern)"
                      :class="pattern.status === 'finalized' ? 'flex-1' : 'flex-1'"
                      class="bg-black border-white/20 text-white hover:bg-black/90"
                    >
                      <Download class="mr-2 h-3 w-3" />
                      Descargar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      @click.stop="viewPattern(pattern.id)"
                      :class="pattern.status === 'finalized' ? 'flex-1' : 'flex-1'"
                      class="border-[#E3F450] bg-black text-white hover:bg-black/90"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                  
                    <div class="flex justify-center gap-2">
                      <Button
                      v-if="!cartStore.isInCart(pattern.id)"
                      variant="outline"
                      size="sm"
                      @click.stop="addToCart(pattern)"
                      class="flex-1 bg-[#E3F450] border-[#E3F450] text-black hover:bg-[#E3F450]/80"
                      >
                      <ShoppingCart class="mr-2 h-3 w-3" />
                      Agregar al Carrito
                      </Button>
                      <Button
                      v-else-if="cartStore.isInCart(pattern.id)"
                      variant="outline"
                      size="sm"
                      @click.stop="viewCart"
                      class="flex-1 bg-[#E3F450] border-lime-400 text-black hover:bg-[#E3F450]/80"
                      >
                      <ShoppingCart class="mr-2 h-3 w-3" />
                      Ver Carrito
                      </Button>
                    </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Pattern Actions Menu Modal -->
    <div v-if="selectedPatternForMenu" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" @click="closePatternMenu">
      <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-sm w-full" @click.stop>
        <h3 class="text-xl font-bold mb-4">Acciones del Patrón</h3>
        
        <div class="space-y-2">
          <Button
            v-if="selectedPatternForMenu.status === 'draft'"
            @click="finalizeSelectedPattern"
            variant="outline"
            class="w-full justify-start border-white/20 text-black hover:bg-white/75"
          >
            <Check class="mr-2 h-4 w-4" />
            Finalizar Patrón
          </Button>
          
          <Button
            v-if="selectedPatternForMenu.status !== 'archived'"
            @click="archiveSelectedPattern"
            variant="outline"
            class="w-full justify-start border-white/20 text-black hover:bg-white/75"
          >
            <Archive class="mr-2 h-4 w-4" />
            Archivar Patrón
          </Button>
          
          <Button
            v-if="selectedPatternForMenu.status === 'archived'"
            @click="unarchiveSelectedPattern"
            variant="outline"
            class="w-full justify-start border-white/20 text-black hover:bg-white/75"
          >
            <ArchiveRestore class="mr-2 h-4 w-4" />
            Desarchivar Patrón
          </Button>
          
          <Button
            @click="downloadPattern(selectedPatternForMenu)"
            variant="outline"
            class="w-full justify-start border-white/20 text-black hover:bg-white/75"
          >
            <Download class="mr-2 h-4 w-4" />
            Descargar Patrón
          </Button>
          
          <Separator class="bg-white/10 my-2" />
          
          <Button
            @click="deleteSelectedPattern"
            variant="outline"
            class="w-full justify-start border-red-500/50 text-red-400 hover:bg-red-500/40"
          >
            <Trash2 class="mr-2 h-4 w-4" />
            Eliminar Patrón
          </Button>
          
          <Button
            @click="closePatternMenu"
            variant="outline"
            class="w-full justify-start border-white/20 text-black hover:bg-white/75 mt-4"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePatternsStore } from '@/stores/patterns'
import { useCartStore } from '@/stores/cart'
import { 
  Plus, 
  FileText, 
  Download, 
  MoreVertical, 
  Check, 
  Archive, 
  ArchiveRestore,
  Trash2,
  ShoppingCart
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import NavigationBar from '@/components/NavigationBar.vue'
import AccountSidebar from '@/components/AccountSidebar.vue'
import type { Pattern } from '@/types/pattern.types'

const router = useRouter()
const authStore = useAuthStore()
const patternsStore = usePatternsStore()
const cartStore = useCartStore()

const activeTab = ref<'all' | 'draft' | 'finalized' | 'archived'>('all')
const selectedPatternForMenu = ref<Pattern | null>(null)
const addingToCart = ref<Set<number>>(new Set())

// Computed
const filteredPatterns = computed(() => {
  switch (activeTab.value) {
    case 'draft':
      return patternsStore.draftPatterns
    case 'finalized':
      return patternsStore.finalizedPatterns
    case 'archived':
      return patternsStore.archivedPatterns
    default:
      return patternsStore.patterns
  }
})

const emptyStateMessage = computed(() => {
  switch (activeTab.value) {
    case 'draft':
      return 'No tienes borradores'
    case 'finalized':
      return 'No tienes patrones finalizados'
    case 'archived':
      return 'No tienes patrones archivados'
    default:
      return 'No tienes patrones aún'
  }
})

const emptyStateDescription = computed(() => {
  switch (activeTab.value) {
    case 'draft':
      return 'Los patrones en borrador aparecerán aquí'
    case 'finalized':
      return 'Finaliza tus patrones para verlos aquí'
    case 'archived':
      return 'Los patrones archivados aparecerán aquí'
    default:
      return 'Comienza generando tu primer patrón desde el catálogo'
  }
})

// Methods
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Borrador',
    finalized: 'Finalizado',
    archived: 'Archivado'
  }
  return labels[status] || status
}

const viewPattern = (patternId: number) => {
  router.push({ name: 'pattern-view', params: { id: patternId } })
}

const downloadPattern = (pattern: Pattern) => {
  if (pattern.svg_data) {
    // Create a blob from the SVG data and download it
    const blob = new Blob([pattern.svg_data], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${pattern.name || `patron-${pattern.id}`}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } else {
    alert('El patrón no tiene un archivo disponible para descargar')
  }
}

const openPatternMenu = (pattern: Pattern) => {
  selectedPatternForMenu.value = pattern
}

const closePatternMenu = () => {
  selectedPatternForMenu.value = null
}

const finalizeSelectedPattern = async () => {
  if (!selectedPatternForMenu.value) return
  
  const result = await patternsStore.finalizePattern(selectedPatternForMenu.value.id)
  if (result.success) {
    closePatternMenu()
  } else {
    alert(result.message || 'Error al finalizar el patrón')
  }
}

const archiveSelectedPattern = async () => {
  if (!selectedPatternForMenu.value) return
  
  const result = await patternsStore.archivePattern(selectedPatternForMenu.value.id)
  if (result.success) {
    closePatternMenu()
  } else {
    alert(result.message || 'Error al archivar el patrón')
  }
}

const unarchiveSelectedPattern = async () => {
  if (!selectedPatternForMenu.value) return
  
  const result = await patternsStore.unarchivePattern(selectedPatternForMenu.value.id)
  if (result.success) {
    closePatternMenu()
  } else {
    alert(result.message || 'Error al desarchivar el patrón')
  }
}

const deleteSelectedPattern = async () => {
  if (!selectedPatternForMenu.value) return
  
  const confirmed = confirm('¿Estás seguro de que quieres eliminar este patrón? Esta acción no se puede deshacer.')
  if (!confirmed) return
  
  const result = await patternsStore.deletePattern(selectedPatternForMenu.value.id)
  if (result.success) {
    closePatternMenu()
  } else {
    alert(result.message || 'Error al eliminar el patrón')
  }
}

const addToCart = async (pattern: Pattern) => {
  addingToCart.value.add(pattern.id)
  const result = await cartStore.addToCart(pattern)
  if (result.success) {
    // Show success feedback - could be replaced with a toast notification
    console.log(result.message)
  } else {
    alert(result.message)
    addingToCart.value.delete(pattern.id)
  }
}

const viewCart = () => {
  router.push({ name: 'cart' })
}

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated || !authStore.user) {
    router.push('/login')
    return
  }

  // Fetch user's patterns
  await patternsStore.fetchUserPatterns(authStore.user.id)
})
</script>

<style scoped>
/* Smooth scrollbar for horizontal tabs */
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
</style>
