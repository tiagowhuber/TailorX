<template>
  <div 
    class="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center" 
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
      
      <!-- Social Media Icons -->
      <div class="flex space-x-3">
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
      </div>
    </header>

    <!-- Main Content - Create Account Form -->
    <div class="relative z-10 w-full max-w-xl px-8">
      <div class="bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10 shadow-2xl">
        <!-- Form Header -->
        <div class="text-center mb-8">
          <h2 class="text-4xl font-black mb-2">
            CREAR CUENTA
          </h2>
          <p class="text-gray-400 font-normal">
            Únete a la revolución de la moda sostenible
          </p>
        </div>

        <!-- Google Sign In Button -->
        <Button 
          @click="signInWithGoogle"
          class="w-full mb-6 bg-white hover:bg-gray-100 text-black font-semibold py-6 flex items-center justify-center gap-3"
        >
          <GoogleIcon />
          <span>CONTINUAR CON GOOGLE</span>
        </Button>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center top-[-35px]">
            <div class="w-full border-t border-white/20"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-transparent text-gray-400 font-normal">
              O CREA UNA CUENTA CON EMAIL
            </span>
          </div>
        </div>

        <!-- Create Account Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Name Field -->
          <div class="space-y-2">
            <Label for="name" class="text-white font-medium">
              Nombre completo
            </Label>
            <Input 
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Tu nombre"
              required
              class="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#E3F450] focus:ring-[#E3F450]"
            />
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email" class="text-white font-medium">
              Correo electrónico
            </Label>
            <Input 
              id="email"
              v-model="form.email"
              type="email"
              placeholder="tu@email.com"
              required
              class="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#E3F450] focus:ring-[#E3F450]"
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <Label for="password" class="text-white font-medium">
              Contraseña
            </Label>
            <Input 
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              required
              minlength="8"
              class="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#E3F450] focus:ring-[#E3F450]"
            />
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <Label for="confirmPassword" class="text-white font-medium">
              Confirmar contraseña
            </Label>
            <Input 
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirma tu contraseña"
              required
              class="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#E3F450] focus:ring-[#E3F450]"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-400 text-sm text-center font-normal">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <Button 
            type="submit"
            :disabled="isSubmitting || authStore.loading"
            class="w-full py-6 text-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
            style="background-color: #E3F450; color: black;"
          >
            {{ isSubmitting || authStore.loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA' }}
          </Button>
        </form>

        <!-- Sign In Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-400 font-normal">
            ¿Ya tienes una cuenta? 
            <router-link to="/login" class="text-[#E3F450] hover:underline font-semibold">
              Inicia sesión
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TwitterSmallIcon from '@/components/icons/TwitterSmallIcon.vue'
import FacebookSmallIcon from '@/components/icons/FacebookSmallIcon.vue'
import WhatsAppSmallIcon from '@/components/icons/WhatsAppSmallIcon.vue'
import InstagramSmallIcon from '@/components/icons/InstagramSmallIcon.vue'
import GoogleIcon from '@/components/icons/GoogleIcon.vue'
import bgImage from '@/assets/backgrounds/elemento-amarillo.png'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''
  
  // Validate passwords match
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  // Validate password length
  if (form.value.password.length < 8) {
    errorMessage.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  isSubmitting.value = true

  // Split name into first_name and last_name
  const nameParts = form.value.name.trim().split(' ')
  const first_name = nameParts[0] || ''
  const last_name = nameParts.slice(1).join(' ') || ''

  const result = await authStore.register({
    email: form.value.email,
    password: form.value.password,
    first_name,
    last_name
  })

  isSubmitting.value = false

  if (result.success) {
    // Redirect to home or dashboard
    router.push('/')
  } else {
    errorMessage.value = result.message || 'Error al crear la cuenta'
  }
}

const signInWithGoogle = async () => {
  errorMessage.value = ''
  const result = await authStore.signInWithGoogle()
  
  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message || 'Error al iniciar sesión con Google'
  }
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
