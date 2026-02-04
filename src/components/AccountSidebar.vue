<template>
  <div>
    <!-- Mobile Navigation Bar (horizontal) -->
    <div v-if="activeSection !== 'cart'" class="lg:hidden mb-6 overflow-x-auto">
      <div class="flex gap-2 min-w-max pb-2">
        <button
          @click="router.push({ name: 'account' })"
          :class="[
            'px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap border min-w-[2.75rem] active:scale-95',
            activeSection === 'account'
              ? 'bg-white text-black border-white shadow-lg'
              : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
          ]"
        >
          General
        </button>
        <button
          @click="router.push({ name: 'measurements' })"
          :class="[
            'px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap border min-w-[2.75rem] active:scale-95',
            activeSection === 'measurements'
              ? 'bg-white text-black border-white shadow-lg'
              : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
          ]"
        >
          Mis Medidas
        </button>
        <button
          @click="router.push({ name: 'patterns' })"
          :class="[
            'px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap border min-w-[2.75rem] active:scale-95',
            activeSection === 'patterns'
              ? 'bg-white text-black border-white shadow-lg'
              : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
          ]"
        >
          Mis Patrones
        </button>
        <button
          @click="router.push({ name: 'orders' })"
          :class="[
            'px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap border min-w-[2.75rem] active:scale-95',
            activeSection === 'orders'
              ? 'bg-white text-black border-white shadow-lg'
              : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
          ]"
        >
          Mis Pedidos
        </button>
        <button
          v-if="activeSection === 'account'"
          @click="$emit('edit-profile')"
          class="px-4 py-3 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all whitespace-nowrap min-w-[2.75rem] active:scale-95"
        >
          Editar Perfil
        </button>
      </div>
    </div>

    <!-- Sidebar (Desktop) -->
    <aside class="hidden lg:block w-50 flex-shrink-0 lg:mt-5">
      <nav class="space-y-1">
        <button
          @click="router.push({ name: 'account' })"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border cursor-pointer',
            activeSection === 'account'
              ? 'bg-white text-black border-white shadow-lg'
              : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
          ]"
        >
          General
        </button>
        
        <Separator class="bg-white/10 my-4" />
        
        <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Acciones Rápidas
        </div>
        
        <button
          @click="router.push({ name: 'measurements' })"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border cursor-pointer',
            activeSection === 'measurements'
              ? 'bg-white text-black border-white shadow-lg'
              : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
          ]"
        >
          <RulerDimensionLine :class="['inline-block mr-2 h-4 w-4', activeSection === 'measurements' ? 'text-black' : 'text-[#E3F450]']" />
          Mis Medidas
        </button>
        
        <button
          @click="router.push({ name: 'patterns' })"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border cursor-pointer',
            activeSection === 'patterns'
              ? 'bg-white text-black border-white shadow-lg'
              : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
          ]"
        >
          <ScissorsLineDashed :class="['inline-block mr-2 h-4 w-4', activeSection === 'patterns' ? 'text-black' : 'text-[#E3F450]']" />
          Mis Patrones
        </button>
        
        <button
          @click="router.push({ name: 'orders' })"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border cursor-pointer',
            activeSection === 'orders'
              ? 'bg-white text-black border-white shadow-lg'
              : 'text-white border-white/20 hover:border-white/40 hover:bg-white/5'
          ]"
        >
          <BaggageClaim :class="['inline-block mr-2 h-4 w-4', activeSection === 'orders' ? 'text-black' : 'text-[#E3F450]']" />
          Mis Pedidos
        </button>
        
        <Separator class="bg-white/10 my-4" />
        
        <button
          v-if="activeSection === 'account'"
          @click="$emit('edit-profile')"
          class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer"
        >
          <Settings class="inline-block mr-2 h-4 w-4 text-[#E3F450]" />
          Editar Perfil
        </button>
        
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer"
        >
          <LogOut class="inline-block mr-2 h-4 w-4 text-[#E3F450]" />
          Cerrar Sesión
        </button>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { RulerDimensionLine, ScissorsLineDashed, Settings, LogOut, BaggageClaim } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'

interface Props {
  activeSection: 'account' | 'measurements' | 'patterns' | 'cart' | 'orders'
}

defineProps<Props>()
defineEmits<{
  'edit-profile': []
}>()

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
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

/* Sidebar buttons */
nav button {
  font-family: 'Stack Sans Notch', sans-serif;
}
</style>
