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
                    Patrones generados de órdenes confirmadas ({{ orderedPatterns.length }} items)
                  </p>
                </div>
              </div>
            </motion.div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-20">
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E3F450]"></div>
            </div>

            <!-- Empty State -->
            <motion.div
              v-else-if="orderedPatterns.length === 0"
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
                v-for="(item, index) in orderedPatterns"
                :key="item.id"
                :initial="{ opacity: 0, y: 20 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: index * 0.05 }"
              >
                <div 
                    class="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all group flex flex-col h-full"
                >
                  <!-- Pattern Preview/Image -->
                   <div class="aspect-[4/3] bg-gray-800 relative overflow-hidden">
                    <img 
                      v-if="item.pattern?.design?.image_url" 
                      :src="item.pattern.design.image_url" 
                      :alt="item.pattern.design?.name"
                      class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <FileText class="w-12 h-12 text-gray-600" />
                    </div>
                    
                    <!-- Order Badge -->
                    <div class="absolute top-3 right-3">
                      <Badge class="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {{ item.order?.order_number }}
                      </Badge>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="p-5 flex-1 flex flex-col">
                    <h3 class="text-lg font-bold text-white mb-1 group-hover:text-[#E3F450] transition-colors line-clamp-2">
                       {{ item.pattern?.name || 'Patrón sin nombre' }}
                    </h3>
                    <p class="text-sm text-gray-400 mb-4">{{ item.pattern?.design?.name }}</p>
                    
                    <div class="mt-auto grid grid-cols-2 gap-3">
                        <!-- Normal SVG -->
                       <Button 
                        @click="downloadSvg(item.svg_normal, `${item.pattern?.name}_normal.svg`)" 
                        variant="outline" 
                        size="sm"
                        class="w-full bg-black border-white/20 text-white hover:bg-white/10 hover:text-[#E3F450]"
                      >
                        <Download class="mr-2 h-3 w-3" /> Normal SVG
                      </Button>
                      
                       <!-- Mirrored SVG -->
                       <Button 
                        @click="downloadSvg(item.svg_mirrored, `${item.pattern?.name}_mirrored.svg`)" 
                        variant="ghost" 
                        size="sm"
                        class="w-full text-white bg-green-900/20 border border-green-500/30 hover:bg-green-900/40 hover:text-green-300"
                      >
                         <Download class="mr-2 h-3 w-3" /> Mirrored SVG
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

const router = useRouter()
const authStore = useAuthStore()
const patternsStore = usePatternsStore()

const loading = ref(true)

const orderedPatterns = computed(() => patternsStore.orderedPatterns)

const downloadSvg = (svgData: string | undefined, filename: string) => {
  if (svgData) {
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename.replace(/\s+/g, '_')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } else {
    // maybe toast here
  }
}

onMounted(async () => {
    if (!authStore.user || authStore.user.role !== 'admin') {
        router.push('/')
        return
    }

    try {
        await patternsStore.fetchOrderedPatterns()
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
