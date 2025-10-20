<template>
  <div class="min-h-screen bg-black text-white overflow-hidden relative">
    <!-- Background spotlight effect -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-lime-400/30 via-yellow-300/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
    <div class="absolute top-32 right-16 w-64 h-64 bg-gradient-radial from-lime-300/40 via-yellow-200/30 to-transparent rounded-full blur-2xl"></div>
    
    <!-- Navigation Header -->
    <header class="relative z-10 flex justify-between items-center px-8 py-6">
      <!-- Logo -->
      <div class="flex items-center">
        <h1 class="text-2xl font-bold tracking-widest">TAILORX</h1>
        <p class="text-xs text-gray-400 ml-4 tracking-wide">DRESS WITHOUT WASTE</p>
      </div>
      
      <!-- Navigation Menu -->
      <nav class="hidden md:flex space-x-8 text-sm font-medium">
        <a href="#" class="hover:text-lime-400 transition-colors">INICIO</a>
        <span class="text-gray-500">|</span>
        <a href="#" class="hover:text-lime-400 transition-colors">TAILORX</a>
        <span class="text-gray-500">|</span>
        <a href="#" class="hover:text-lime-400 transition-colors">START NOW</a>
        <span class="text-gray-500">|</span>
        <a href="#" class="hover:text-lime-400 transition-colors">CONTACTO</a>
      </nav>
      
      <!-- Social Media Icons -->
      <div class="flex space-x-3">
        <a href="#" class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
        </a>
        <a href="#" class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
          </svg>
        </a>
        <a href="#" class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.175 1.219-5.175s-.311-.623-.311-1.544c0-1.446.839-2.525 1.883-2.525.888 0 1.317.664 1.317 1.46 0 .888-.565 2.219-.856 3.449-.243 1.03.516 1.87 1.53 1.87 1.836 0 3.247-1.935 3.247-4.729 0-2.473-1.777-4.201-4.317-4.201-2.94 0-4.665 2.205-4.665 4.484 0 .887.341 1.838.769 2.357.084.101.096.19.071.294-.078.323-.252 1.011-.287 1.152-.045.184-.145.223-.334.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.29-1.156l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
          </svg>
        </a>
        <a href="#" class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors">
          <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-8">
      <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-8">
          <!-- Large X Design Element -->
          <div class="relative">
            <div class="text-8xl md:text-9xl font-thin text-gray-800/20 select-none">X</div>
            <div class="absolute inset-0 flex items-center">
              <div class="w-1 h-32 bg-white transform rotate-12 origin-bottom"></div>
            </div>
          </div>
          
          <!-- Main Heading -->
          <div class="space-y-4">
            <h2 class="text-5xl md:text-7xl font-bold leading-tight">
              DRESS<br>
              WITHOUT<br>
              WASTE
            </h2>
            
            <!-- CTA Buttons - shadcn-vue examples -->
            <div class="pt-8 space-y-4">
              <!-- Custom styled button (original style) -->
              <div>
                <button class="bg-lime-400 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:bg-lime-300 transition-colors duration-300 transform hover:scale-105">
                  CREAR CUENTA
                </button>
              </div>
              
              <!-- shadcn-vue Button Examples -->
              <div class="flex flex-wrap gap-3">
                <Button @click="handleClick">
                  Default Button
                </Button>
                
                <Button variant="destructive" @click="handleClick">
                  Destructive
                </Button>
                
                <Button variant="outline" @click="handleClick">
                  Outline
                </Button>
                
                <Button variant="secondary" @click="handleClick">
                  Secondary
                </Button>
                
                <Button variant="ghost" @click="handleClick">
                  Ghost
                </Button>
                
                <Button variant="link" @click="handleClick">
                  Link
                </Button>
              </div>
              
              <!-- Different sizes -->
              <div class="flex flex-wrap gap-3 items-center">
                <Button size="sm" @click="handleClick">
                  Small
                </Button>
                
                <Button size="default" @click="handleClick">
                  Default
                </Button>
                
                <Button size="lg" @click="handleClick">
                  Large
                </Button>
                
                <Button size="icon" @click="handleClick">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Content - Empty space for design balance -->
        <div class="hidden lg:block"></div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

const handleClick = () => {
  alert('Button clicked! 🎉')
}
</script>