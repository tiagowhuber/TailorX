<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Navigation Header -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="relative pt-20 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Sidebar -->
          <AccountSidebar active-section="admin_patterns" />

          <!-- Main Content Area -->
          <main class="flex-1 min-w-0">
            <!-- Header -->
            <motion.div
              class="mb-8"
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ type: 'spring', stiffness: 250, damping: 30 }"
            >
              <div class="inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider mb-4 orbitron-variable" style="--orbitron-weight: 700; background-color: #E3F450; color: black;">
                Administración
              </div>
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h1 class="text-3xl md:text-4xl font-bold text-white mb-2" style="font-family: 'Avenir Next', sans-serif;">PATRONES DE PRODUCCIÓN</h1>
                  <p class="text-gray-400 text-sm orbitron-variable" style="--orbitron-weight: 400;">
                    Copias espejadas generadas automáticamente de las órdenes ({{ filteredPatterns.length }} items)
                  </p>
                </div>
              </div>
            </motion.div>

            <!-- Filters -->
            <div class="mb-6">
              <div class="flex gap-2 overflow-x-auto pb-2">
                <button 
                  @click="activeTab = 'all'" 
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                    activeTab === 'all' ? 'bg-white text-black border-white' : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
                  ]"
                >
                  Todos
                </button>
                <button 
                  @click="activeTab = 'finalized'" 
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                    activeTab === 'finalized' ? 'bg-white text-black border-white' : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
                  ]"
                >
                  Finalizados (Listos)
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-20">
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E3F450]"></div>
            </div>

            <!-- Empty State -->
            <motion.div
              v-else-if="filteredPatterns.length === 0"
              class="text-center py-20"
              :initial="{ opacity: 0, scale: 0.95 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ type: 'spring', stiffness: 200, damping: 25 }"
            >
              <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-white/5 border border-white/10 mb-6">
                <ScissorsLineDashed class="h-12 w-12 text-gray-500" />
              </div>
              <h3 class="text-2xl font-semibold text-gray-400 mb-2" style="font-family: 'Avenir Next', sans-serif;">
                No hay patrones de producción
              </h3>
            </motion.div>

            <!-- Patterns Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                v-for="(pattern, index) in filteredPatterns"
                :key="pattern.id"
                :initial="{ opacity: 0, y: 20 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: index * 0.05 }"
              >
                <div 
                    class="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all cursor-pointer group flex flex-col h-full"
                    @click="viewPattern(pattern.id)"
                >
                  <!-- Pattern Preview/Image -->
                   <div class="aspect-[4/3] bg-gray-800 relative overflow-hidden">
                    <img 
                      v-if="pattern.design?.image_url" 
                      :src="pattern.design.image_url" 
                      :alt="pattern.design?.name"
                      class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <FileText class="w-12 h-12 text-gray-600" />
                    </div>
                    
                    <!-- Status Badge -->
                    <div class="absolute top-3 right-3">
                      <Badge :class="getStatusClass(pattern.status)">
                        {{ getStatusLabel(pattern.status) }}
                      </Badge>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="p-5 flex-1 flex flex-col">
                    <h3 class="text-lg font-bold text-white mb-1 group-hover:text-[#E3F450] transition-colors line-clamp-2" :title="pattern.name">
                      {{ pattern.name }}
                    </h3>
                    <p class="text-sm text-gray-400 mb-4">{{ pattern.design?.name }}</p>
                    
                    <div class="mt-auto grid grid-cols-2 gap-3">
                       <Button 
                        @click.stop="downloadPattern(pattern)" 
                        variant="outline" 
                        size="sm"
                        class="w-full bg-black border-white/20 text-white hover:bg-white/10 hover:text-[#E3F450]"
                      >
                        <Download class="mr-2 h-3 w-3" /> Exportar PLT
                      </Button>
                      
                       <Button 
                        @click.stop="downloadSvg(pattern)" 
                        variant="ghost" 
                        size="sm"
                        class="w-full text-gray-400 hover:text-white"
                      >
                         SVG
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>
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
import { Download, ScissorsLineDashed, FileText } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NavigationBar from '@/components/NavigationBar.vue'
import AccountSidebar from '@/components/AccountSidebar.vue'
import { motion } from 'motion-v'
import type { Pattern } from '@/types/pattern.types'
import { patternsApi } from '@/lib/api'

const router = useRouter()
const authStore = useAuthStore()
const patternsStore = usePatternsStore()

const loading = ref(true)
const activeTab = ref<'all' | 'finalized'>('all')

const filteredPatterns = computed(() => {
  return activeTab.value === 'finalized' ? patternsStore.finalizedPatterns : patternsStore.patterns
})

const viewPattern = (id: number) => router.push({ name: 'pattern-view', params: { id } })

const downloadSvg = (pattern: Pattern) => {
  if (pattern.svg_data) {
    const blob = new Blob([pattern.svg_data], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${pattern.name}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

const downloadPattern = async (pattern: Pattern) => {
  try {
    const response = await patternsApi.exportPatternToPLT(pattern.id)
    const blob = new Blob([response.data], { type: 'application/octet-stream' }) // Or specific PLT mime type
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', response.filename || `pattern-${pattern.id}.plt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading pattern:', error)
    // Could add toast notification here
  }
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    draft: 'Borrador',
    finalized: 'Listo',
    archived: 'Archivado'
  }
  return map[status] || status
}

const getStatusClass = (status: string) => {
  if (status === 'finalized') return 'bg-green-500/20 text-green-300 border-green-500/30'
  if (status === 'archived') return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
}

onMounted(async () => {
    if (!authStore.user || authStore.user.role !== 'admin') {
        router.push('/')
        return
    }

    try {
        // Admin is user_id 1. Fetching "user patterns" for current user (admin) returns these admin copies.
        await patternsStore.fetchUserPatterns(authStore.user.id)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
@font-face {
  font-family: 'Stack Sans Notch';
  src: url('@/assets/fonts/Stack_Sans_Notch/static/StackSansNotch-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* Apply Stack Sans Notch font globally */
body, p, span, div, h1, h2, h3, button {
  font-family: 'Stack Sans Notch', sans-serif;
}
</style>
