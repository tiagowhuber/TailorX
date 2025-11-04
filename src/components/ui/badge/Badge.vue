<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
  class?: string
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
})

const badgeClasses = computed(() => {
  const variants = {
    default: 'bg-[#E3F450] text-black border-transparent hover:bg-[#E3F450]/80',
    secondary: 'bg-white/10 text-white border-transparent hover:bg-white/20',
    destructive: 'bg-red-500 text-white border-transparent hover:bg-red-500/80',
    outline: 'text-white border-white/20',
    success: 'bg-green-500/20 text-green-400 border-transparent',
    warning: 'bg-yellow-500/20 text-yellow-400 border-transparent',
  }

  return cn(
    'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#E3F450] focus:ring-offset-2',
    variants[props.variant],
    props.class
  )
})
</script>

<template>
  <div :class="badgeClasses">
    <slot />
  </div>
</template>
