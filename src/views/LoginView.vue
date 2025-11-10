<template>
  <div 
    class="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center" 
    :style="{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'top 600px center', backgroundRepeat: 'no-repeat' }"
  >
    <!-- Background spotlight effect -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-[#E3F450]/30 via-yellow-300/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-[#E3F450]/20 via-yellow-300/10 to-transparent rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
    
    <!-- Navigation Header -->
    <header class="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-6">
      <!-- Logo -->
      <router-link to="/" class="flex items-center">
        <h1 class="text-2xl font-bold tracking-widest">TAILORX</h1>
        <p class="text-xs text-gray-400 ml-4 tracking-wide">DRESS WITHOUT WASTE</p>
      </router-link>
      
      <!-- Social Media Icons -->
      <div class="flex space-x-3">
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <TwitterSmallIcon />
        </a>
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <FacebookSmallIcon />
        </a>
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <InstagramSmallIcon />
        </a>
        <a href="#" class="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-[#E3F450] transition-colors">
          <WhatsAppSmallIcon />
        </a>
      </div>
    </header>

    <!-- Main Content - Login Form -->
    <div class="relative z-10 w-full max-w-xl px-8">
      <div class="bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10 shadow-2xl">
        <!-- Form Header -->
        <div class="text-center mb-8">
          <h2 class="text-4xl font-black mb-2">
            INICIAR SESIÓN
          </h2>
          <p class="text-gray-400 font-normal">
            Bienvenido de nuevo a TailorX
          </p>
        </div>

        <!-- Google Sign In Button -->
        <div id="google-signin-button-login" class="w-full flex justify-center"></div>
        
        <!-- Fallback button if Google library doesn't load -->
        <Button 
          v-if="!isGoogleLoaded"
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
              O INICIA SESIÓN CON EMAIL
            </span>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
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
              placeholder="Tu contraseña"
              required
              class="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#E3F450] focus:ring-[#E3F450]"
            />
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="form.rememberMe"
                class="w-4 h-4 rounded border-white/20 bg-white/10 text-[#E3F450] focus:ring-[#E3F450] focus:ring-offset-0"
              />
              <span class="text-sm text-gray-400 font-normal">Recordarme</span>
            </label>
            <a href="#" class="text-sm text-[#E3F450] hover:underline font-normal">
              ¿Olvidaste tu contraseña?
            </a>
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
            {{ isSubmitting || authStore.loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN' }}
          </Button>
        </form>

        <!-- Create Account Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-400 font-normal">
            ¿No tienes una cuenta? 
            <router-link to="/crear-cuenta" class="text-[#E3F450] hover:underline font-semibold">
              Crear cuenta
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useGoogleSignIn } from '@/composables/useGoogleSignIn'
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
const { isGoogleLoaded, renderGoogleButton } = useGoogleSignIn()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const errorMessage = ref('')
const isSubmitting = ref(false)

onMounted(() => {
  // Render Google button when library is loaded
  const checkInterval = setInterval(() => {
    if (isGoogleLoaded.value) {
      renderGoogleButton('google-signin-button-login', handleGoogleSignIn, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
      })
      clearInterval(checkInterval)
    }
  }, 100)

  setTimeout(() => clearInterval(checkInterval), 5000)
})

const handleGoogleSignIn = async (credential: string) => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const result = await authStore.signInWithGoogle(credential) as { success: boolean; message?: string }
    
    if (result.success) {
      router.push('/')
    } else {
      errorMessage.value = result.message || 'Error al iniciar sesión con Google'
    }
  } catch (err) {
    errorMessage.value = 'Error al procesar Google Sign-In'
  } finally {
    isSubmitting.value = false
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  // Validate form
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  isSubmitting.value = true

  const result = await authStore.login({
    email: form.value.email,
    password: form.value.password
  })

  isSubmitting.value = false

  if (result.success) {
    // Redirect to home or dashboard
    router.push('/')
  } else {
    errorMessage.value = result.message || 'Error al iniciar sesión'
  }
}

const signInWithGoogle = async () => {
  errorMessage.value = ''
  // This fallback shouldn't be needed if Google button renders properly
  errorMessage.value = 'Por favor usa el botón de Google que aparece arriba'
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

/* Custom checkbox styles */
:deep(input[type="checkbox"]) {
  cursor: pointer;
}

:deep(input[type="checkbox"]:checked) {
  background-color: #E3F450;
  border-color: #E3F450;
}
</style>
