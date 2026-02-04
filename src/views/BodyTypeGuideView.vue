<template>
  <!-- Navigation Header -->
  <NavigationBar />

  <div class="min-h-screen bg-black text-white relative overflow-hidden">
    <!-- Subtle spotlight background -->
    <div class="pointer-events-none absolute -top-24 left-1/3 w-[700px] h-[700px] bg-gradient-radial from-[#E3F450]/20 via-yellow-300/10 to-transparent rounded-full blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-0 right-1/4 w-[900px] h-[600px] bg-gradient-radial from-[#E3F450]/30 via-yellow-300/20 to-transparent rounded-full blur-3xl"></div>

    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      <!-- Header -->
      <motion.section
        class="space-y-3 sm:space-y-4"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ type: 'spring', stiffness: 250, damping: 30 }"
      >
        <div class="inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider orbitron-variable" style="--orbitron-weight: 700; background-color: #E3F450; color: black;">
          Guía de Estilos
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight" style="font-family: 'Avenir Next', sans-serif;">
          TIPOS DE CUERPO
        </h1>
        <p class="text-sm sm:text-base text-gray-300 max-w-3xl orbitron-variable" style="--orbitron-weight: 400;">
          Cada persona es única. Trabajamos a medida, para que la ropa se adapte a tu cuerpo… y no al revés. Explora los tipos corporales y recomendaciones para vestir mejor.
        </p>
      </motion.section>

      <!-- Main grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10">
        <!-- Left: types list -->
        <motion.aside
          class="lg:col-span-3 space-y-2 sm:space-y-3 order-1"
          :initial="{ opacity: 0, x: -20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ type: 'spring', stiffness: 200, damping: 25, delay: 0.05 }"
        >
          <button
            v-for="t in bodyTypes"
            :key="t.id"
            @click="selectType(t.id)"
            class="w-full text-left px-3 sm:px-4 py-3 sm:py-4 rounded-md border transition-colors orbitron-variable text-sm sm:text-base"
            :class="t.id === selectedId
              ? 'bg-[#E3F450] text-black border-[#E3F450]'
              : 'bg-white/5 text-white border-white/10 hover:bg-white/10'"
            style="--orbitron-weight: 600;"
          >
            <span class="uppercase font-semibold tracking-wide">{{ t.name }}</span>
          </button>
        </motion.aside>

        <!-- Center: single image -->
        <motion.section
          class="lg:col-span-5 bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center order-2 lg:order-2"
          :key="selectedId + '-images'"
          :initial="{ opacity: 0, scale: 0.98 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ type: 'spring', stiffness: 250, damping: 25 }"
        >
          <div class="w-full max-w-lg">
            <div class="w-full aspect-[3/4] overflow-hidden rounded-md bg-black">
              <img :src="current.image" :alt="current.name" class="w-full h-full object-contain" />
            </div>
          </div>
        </motion.section>

        <!-- Right: details and recommendations -->
        <motion.section
          class="lg:col-span-4 space-y-4 sm:space-y-6 order-3"
          :key="selectedId + '-details'"
          :initial="{ opacity: 0, x: 20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ type: 'spring', stiffness: 220, damping: 26 }"
        >
          <div class="space-y-2">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold orbitron-variable" style="--orbitron-weight: 700;">{{ current.name }}</h2>
            <p class="text-xs sm:text-sm text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">Características:</p>
            <ul class="list-disc list-inside text-sm sm:text-base text-gray-200 space-y-1 orbitron-variable" style="--orbitron-weight: 400;">
              <li v-for="(c, i) in current.characteristics" :key="i">{{ c }}</li>
            </ul>
          </div>

          <div class="space-y-3 sm:space-y-4">
            <h3 class="text-sm sm:text-base font-bold text-white orbitron-variable" style="--orbitron-weight: 600;">Recomendaciones de ropa</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="bg-white/5 border border-white/10 rounded-md p-4">
                <div class="mb-2 text-xs font-bold uppercase inline-flex px-2 py-1 rounded-full orbitron-variable" style="--orbitron-weight: 700; background-color: #E3F450; color: black;">Mujer</div>
                <ul class="list-disc list-inside text-gray-200 space-y-1 orbitron-variable" style="--orbitron-weight: 400;">
                  <li v-for="(r, i) in current.recommendations.women" :key="'w-'+i">{{ r }}</li>
                </ul>
              </div>
              <div class="bg-white/5 border border-white/10 rounded-md p-4">
                <div class="mb-2 text-xs font-bold uppercase inline-flex px-2 py-1 rounded-full orbitron-variable" style="--orbitron-weight: 700; background-color: #E3F450; color: black;">Hombre</div>
                <ul class="list-disc list-inside text-gray-200 space-y-1 orbitron-variable" style="--orbitron-weight: 400;">
                  <li v-for="(r, i) in current.recommendations.men" :key="'m-'+i">{{ r }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-400 orbitron-variable" style="--orbitron-weight: 400;">Evitar:</p>
            <ul class="list-disc list-inside text-gray-200 space-y-1 orbitron-variable" style="--orbitron-weight: 400;">
              <li v-for="(e, i) in current.avoid" :key="'e-'+i">{{ e }}</li>
            </ul>
          </div>
        </motion.section>
      </div>
    </main>
  </div>
  
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'
import { motion } from 'motion-v'

// Images (same silhouette used for both genders per body type)
import relojDeArenaImg from '@/assets/body-type-guides/reloj-de-arena.jpg'
import rectangularImg from '@/assets/body-type-guides/rectangular.jpg'
import trianguloImg from '@/assets/body-type-guides/triangulo.jpg'
import trianguloInvertidoImg from '@/assets/body-type-guides/triangulo-invertido.jpg'
import ovaladoImg from '@/assets/body-type-guides/ovalado.jpg'

type Recommendations = { women: string[]; men: string[] }
type BodyType = {
  id: string
  name: string
  image: string
  characteristics: string[]
  recommendations: Recommendations
  avoid: string[]
}

const bodyTypes = ref<BodyType[]>([
  {
    id: 'reloj-de-arena',
    name: 'RELOJ DE ARENA',
    image: relojDeArenaImg,
    characteristics: [
      'Hombros y caderas alineadas',
      'Cintura marcada',
    ],
    recommendations: {
      women: [
        'Siluetas entalladas que destaquen la cintura',
        'Vestidos cruzados, faldas lápiz, blusas ajustadas',
        'Cinturones para potenciar la figura',
      ],
      men: [
        'Camisas slim fit o entalladas (marcan la cintura sin ajustar demasiado el pecho)',
        'Chaquetas con ajuste en la cintura',
        'Pantalones rectos o tapered',
      ],
    },
    avoid: [
      'Ropa demasiado ajustada (puede verse rígido o incómodo)',
    ],
  },
  {
    id: 'rectangular',
    name: 'RECTANGULAR',
    image: rectangularImg,
    characteristics: [
      'Hombros, cintura y caderas con medidas similares',
    ],
    recommendations: {
      women: [
        'Prendas que creen curvas visuales',
        'Faldas con volumen, pantalones de corte recto o mom',
        'Blazers estructurados y vestidos con pinzas',
      ],
      men: [
        'Chaquetas bomber o varsity (dan volumen en hombros)',
        'Capas: camisa abierta + polera',
        'Pantalones slim o tapered (ajustados en tobillo)',
      ],
    },
    avoid: [
      'Ropa muy holgada (acentúa más lo recto)',
    ],
  },
  {
    id: 'triangulo',
    name: 'TRIÁNGULO (PERA)',
    image: trianguloImg,
    characteristics: [
      'Caderas más anchas que los hombros',
      'Cintura definida',
    ],
    recommendations: {
      women: [
        'Tops llamativos, colores claros en la parte superior',
        'Pantalones y faldas de tonos oscuros o lisos',
        'Blazers que amplíen visualmente los hombros',
      ],
      men: [
        'Chaquetas con hombros estructurados',
        'Poleras, camisas y chaquetas con colores más claros arriba',
        'Pantalones de corte recto o slim (evitar skinny porque marcan demasiado la cadera)',
      ],
    },
    avoid: [
      'Pantalones muy ajustados o con pinzas muy marcadas',
      'Estampados grandes en la parte inferior',
    ],
  },
  {
    id: 'triangulo-invertido',
    name: 'TRIÁNGULO INVERTIDO',
    image: trianguloInvertidoImg,
    characteristics: [
      'Hombros más anchos que caderas',
      'Piernas estilizadas',
    ],
    recommendations: {
      women: [
        'Pantalones con volumen (palazzo, flare, wide leg)',
        'Faldas en A para equilibrar la silueta',
        'Escotes en V para estilizar el torso',
      ],
      men: [
        'Pantalones rectos o wide/relajados',
        'Prendas superiores sin hombreras ni demasiadas capas',
        'Cuellos en V (ayudan a estilizar el torso)',
      ],
    },
    avoid: [
      'Poleras muy ajustadas (marcan demasiado los hombros)',
      'Cuellos altos (aumentan el volumen del pecho)',
    ],
  },
  {
    id: 'ovalado',
    name: 'OVALADO (MANZANA)',
    image: ovaladoImg,
    characteristics: [
      'Mayor volumen en la zona abdominal',
      'Piernas y busto pueden ser el punto fuerte',
    ],
    recommendations: {
      women: [
        'Prendas de líneas rectas, telas fluidas',
        'Blusas envolventes o escote en V para alargar',
        'Pantalones rectos o faldas debajo de la rodilla',
      ],
      men: [
        'Poleras y camisas en V o botones verticales',
        'Chaquetas sin acolchado y con caída recta',
        'Pantalones rectos o tailored (no ajustados)',
      ],
    },
    avoid: [
      'Estampados grandes y horizontales',
      'Poleras muy cortas (cortan visualmente el cuerpo)',
    ],
  },
])

const selectedId = ref<string>('reloj-de-arena')
const current = computed(() => bodyTypes.value.find(t => t.id === selectedId.value)!)
const selectType = (id: string) => { selectedId.value = id }
</script>

<style scoped>
@font-face {
  font-family: 'Stack Sans Notch';
  src: url('@/assets/fonts/Stack_Sans_Notch/static/StackSansNotch-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* Apply Stack Sans Notch font globally */
body {
  font-family: 'Stack Sans Notch', sans-serif;
}

/* Exclude specific headers */
h1, h2 {
  font-family: 'Avenir Next', sans-serif;
  font-weight: bold;
}

/* Button and label styles */
button, .label {
  font-family: 'Stack Sans Notch', sans-serif;
  font-weight: 600;
}

/* General text styles */
p, ul, li {
  font-family: 'Stack Sans Notch', sans-serif;
}

/* Specific styles for headers */
h1, h2, h3 {
  font-family: 'Stack Sans Notch', sans-serif;
  font-weight: bold;
}

/* Add pointer cursor to bodyTypes buttons */
button {
  cursor: pointer;
}

/* No extra styles; Tailwind handles layout */
</style>
