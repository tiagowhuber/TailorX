<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MapPin, Phone, CreditCard, ChevronLeft, Plus, Loader2, Mail } from 'lucide-vue-next'
import NavigationBar from '@/components/NavigationBar.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { usePaymentStore } from '@/stores/payment'
import { useAddressesStore } from '@/stores/addresses'
import type { UserAddress } from '@/types/address.types'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const paymentStore = usePaymentStore()
const addressesStore = useAddressesStore()

// Selected address
const selectedAddressId = ref<number | null>(null)

// Contact info — pre-fill from user profile
const contactPhone = ref(authStore.user?.phone ?? '')
const rut = ref(authStore.user?.rut ?? '')

// Validation errors
const phoneError = ref('')
const rutError = ref('')
const addressError = ref('')
const generalError = ref('')

const processing = ref(false)

// Chilean RUT validation (modulo 11)
function validateRut(value: string): boolean {
  const cleaned = value.replace(/[.\-\s]/g, '').toUpperCase()
  if (!/^\d{7,8}[0-9K]$/.test(cleaned)) return false
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)
  let sum = 0
  let multiplier = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i)) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const remainder = 11 - (sum % 11)
  const expected = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder)
  return dv === expected
}

// Format RUT as user types (e.g. 12345678-9)
function formatRut(value: string): string {
  const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase()
  if (cleaned.length <= 1) return cleaned
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)
  return `${body}-${dv}`
}

function onRutInput(event: Event) {
  const input = event.target as HTMLInputElement
  const formatted = formatRut(input.value)
  rut.value = formatted
  rutError.value = ''
}

function onPhoneInput() {
  phoneError.value = ''
}

function validate(): boolean {
  let valid = true

  if (!selectedAddressId.value) {
    addressError.value = 'Selecciona una dirección de envío'
    valid = false
  } else {
    addressError.value = ''
  }

  if (!contactPhone.value.trim()) {
    phoneError.value = 'El teléfono de contacto es requerido'
    valid = false
  } else {
    phoneError.value = ''
  }

  if (!rut.value.trim()) {
    rutError.value = 'El RUT es requerido'
    valid = false
  } else if (!validateRut(rut.value)) {
    rutError.value = 'El RUT ingresado no es válido'
    valid = false
  } else {
    rutError.value = ''
  }

  return valid
}

const cartItems = computed(() => cartStore.cartItems)
const subtotal = computed(() => cartStore.totalAmount)
const discount = computed(() => cartStore.discountAmount)
const isFreeShipping = computed(() => cartStore.isFreeShipping)
const finalTotal = computed(() => cartStore.finalTotal)

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatAddress(addr: UserAddress): string {
  const parts = [addr.street_address]
  if (addr.apartment_unit) parts.push(addr.apartment_unit)
  parts.push(addr.comuna)
  parts.push(addr.region)
  return parts.join(', ')
}

function selectAddress(id: number) {
  selectedAddressId.value = id
  addressError.value = ''
}

async function proceedToPayment() {
  generalError.value = ''

  if (!validate()) return
  if (!authStore.user?.id) {
    router.push('/login')
    return
  }

  // Save phone/rut to profile silently if changed from stored value
  const profileUpdate: { phone?: string; rut?: string } = {}
  if (contactPhone.value.trim() !== (authStore.user.phone ?? '')) {
    profileUpdate.phone = contactPhone.value.trim()
  }
  if (rut.value.trim() !== (authStore.user.rut ?? '')) {
    profileUpdate.rut = rut.value.trim()
  }
  if (Object.keys(profileUpdate).length > 0) {
    await authStore.updateProfile(profileUpdate)
  }

  processing.value = true
  try {
    const response = await paymentStore.createPayment(
      cartStore.cartItems,
      authStore.user.id,
      cartStore.discountCode,
      undefined,
      {
        shipping_address_id: selectedAddressId.value!,
        contact_phone: contactPhone.value.trim(),
        rut: rut.value.trim(),
      }
    )

    if (response.success && response.data) {
      paymentStore.redirectToPayment(response.data.url, response.data.token)
    } else {
      generalError.value = response.message || 'Error al crear el pago. Por favor intenta nuevamente.'
    }
  } catch (err: any) {
    generalError.value = 'Error al procesar el pago. Por favor intenta nuevamente.'
  } finally {
    processing.value = false
  }
}

onMounted(async () => {
  // Redirect if cart is empty
  if (cartStore.itemCount === 0) {
    router.push('/carrito')
    return
  }

  await addressesStore.fetchAddresses()

  // Pre-select default address
  const defaultAddr = addressesStore.defaultAddress
  if (defaultAddr) {
    selectedAddressId.value = defaultAddr.id
  } else {
    const firstAddr = addressesStore.addresses[0]
    if (firstAddr) {
      selectedAddressId.value = firstAddr.id
    }
  }
})

// Watch for profile changes to keep fields in sync
watch(() => authStore.user?.phone, (newPhone) => {
  if (newPhone && !contactPhone.value) contactPhone.value = newPhone
})
watch(() => authStore.user?.rut, (newRut) => {
  if (newRut && !rut.value) rut.value = newRut
})
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <NavigationBar />

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          class="border-white/20 text-white hover:bg-white/10"
          @click="router.push('/carrito')"
        >
          <ChevronLeft class="h-4 w-4 mr-1 text-black" />
          <span class="text-black">Volver</span>
        </Button>
        <h1 class="text-2xl font-bold text-white">Finalizar Compra</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- LEFT COLUMN: Checkout form -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Dirección de Envío -->
          <Card class="bg-white/5 border-white/10">
            <CardHeader class="pb-2">
              <CardTitle class="flex items-center gap-2 text-base font-semibold text-white">
                <MapPin class="h-4 w-4 text-[#E3F450]" />
                Dirección de Envío
              </CardTitle>
              <p class="text-sm text-gray-400">Selecciona una de tus direcciones guardadas</p>
            </CardHeader>
            <CardContent class="space-y-3">
              <!-- Loading state -->
              <div v-if="addressesStore.loading" class="flex items-center gap-2 text-gray-400 py-4">
                <Loader2 class="h-4 w-4 animate-spin" />
                <span class="text-sm">Cargando direcciones...</span>
              </div>

              <!-- Address list -->
              <div
                v-else-if="addressesStore.addresses.length > 0"
                class="space-y-3"
              >
                <div
                  v-for="addr in addressesStore.addresses"
                  :key="addr.id"
                  class="relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors"
                  :class="selectedAddressId === addr.id
                    ? 'border-[#E3F450] bg-[#E3F450]/5'
                    : 'border-white/10 hover:border-white/30'"
                  @click="selectAddress(addr.id)"
                >
                  <!-- Radio indicator -->
                  <span
                    class="mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 transition-colors"
                    :class="selectedAddressId === addr.id
                      ? 'border-[#E3F450] bg-[#E3F450]'
                      : 'border-white/40'"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm text-white">
                      {{ addr.recipient_name || addr.street_address }}
                      <span
                        v-if="addr.is_default"
                        class="ml-2 text-xs bg-[#E3F450]/20 text-[#E3F450] rounded px-1.5 py-0.5"
                      >Principal</span>
                    </p>
                    <p class="text-gray-400 text-sm mt-0.5">{{ formatAddress(addr) }}</p>
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div v-else class="text-center py-4 text-gray-400 text-sm">
                No tienes direcciones guardadas. Agrega una para continuar.
              </div>

              <p v-if="addressError" class="text-red-400 text-xs mt-1">{{ addressError }}</p>

              <!-- Add new address button -->
              <Button
                variant="outline"
                class="w-full border-dashed border-white/20 text-white hover:bg-white/5 hover:border-white/40"
                @click="router.push('/mis-direcciones')"
              >
                <Plus class="h-4 w-4 mr-2" />
                <span class="text-black">Agregar Nueva Dirección</span>
              </Button>
            </CardContent>
          </Card>

          <!-- Email (read-only) -->
          <Card class="bg-white/5 border-white/10">
            <CardHeader class="pb-2">
              <CardTitle class="flex items-center gap-2 text-base font-semibold text-white">
                <Mail class="h-4 w-4 text-[#E3F450]" />
                Correo Electrónico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center gap-2 px-3 py-2 rounded-md bg-black/40 border border-white/10 text-gray-300">
                <Mail class="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span class="text-sm text-white">{{ authStore.user?.email }}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">El comprobante se enviará a este correo.</p>
            </CardContent>
          </Card>

          <!-- Teléfono de Contacto -->
          <Card class="bg-white/5 border-white/10">
            <CardHeader class="pb-2">
              <CardTitle class="flex items-center gap-2 text-base font-semibold text-white">
                <Phone class="h-4 w-4 text-[#E3F450]" />
                Teléfono de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="relative">
                <Phone class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  v-model="contactPhone"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  class="pl-9 bg-black/40 border-white/10 text-white placeholder-gray-500 focus:border-[#E3F450]"
                  :class="phoneError ? 'border-red-500' : ''"
                  @input="onPhoneInput"
                />
              </div>
              <p v-if="phoneError" class="text-red-400 text-xs mt-1">{{ phoneError }}</p>
              <p v-else class="text-xs text-gray-500 mt-1">Necesario para coordinar la entrega.</p>
            </CardContent>
          </Card>

          <!-- RUT -->
          <Card class="bg-white/5 border-white/10">
            <CardHeader class="pb-2">
              <CardTitle class="flex items-center gap-2 text-base font-semibold text-white">
                <CreditCard class="h-4 w-4 text-[#E3F450]" />
                RUT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="relative">
                <CreditCard class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  v-model="rut"
                  type="text"
                  placeholder="12345678-9"
                  maxlength="10"
                  class="pl-9 bg-black/40 border-white/10 text-white placeholder-gray-500 focus:border-[#E3F450]"
                  :class="rutError ? 'border-red-500' : ''"
                  @input="onRutInput"
                />
              </div>
              <p v-if="rutError" class="text-red-400 text-xs mt-1">{{ rutError }}</p>
              <p v-else class="text-xs text-gray-500 mt-1">Necesario para la boleta/factura.</p>
            </CardContent>
          </Card>

        </div>

        <!-- RIGHT COLUMN: Order summary -->
        <div class="lg:col-span-1">
          <div class="sticky top-6 space-y-4">
            <Card class="bg-white/5 border-white/10">
              <CardHeader class="pb-2">
                <CardTitle class="text-base font-semibold text-white">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <!-- Cart items -->
                <div class="space-y-3">
                  <div
                    v-for="item in cartItems"
                    :key="item.patternId"
                    class="flex gap-3"
                  >
                    <div class="h-14 w-14 flex-shrink-0 rounded-md bg-white/10 overflow-hidden">
                      <img
                        v-if="item.imageUrl"
                        :src="item.imageUrl"
                        :alt="item.designName"
                        class="h-full w-full object-cover"
                      />
                      <div v-else class="h-full w-full flex items-center justify-center text-gray-600 text-xs">
                        Sin imagen
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium leading-tight line-clamp-2 text-white">{{ item.patternName }}</p>
                      <p class="text-xs text-gray-400 mt-0.5">{{ item.quantity }} × {{ formatPrice(item.price) }}</p>
                    </div>
                    <p class="text-sm font-semibold flex-shrink-0 text-white">{{ formatPrice(item.price * item.quantity) }}</p>
                  </div>
                </div>

                <div class="border-t border-white/10 pt-3 space-y-2 text-sm">
                  <div class="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span class="text-white">{{ formatPrice(subtotal) }}</span>
                  </div>
                  <div v-if="discount > 0" class="flex justify-between text-[#E3F450]">
                    <span>Descuento</span>
                    <span>- {{ formatPrice(discount) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-300">
                    <span>Envío</span>
                    <span :class="isFreeShipping ? 'text-[#E3F450]' : 'text-white'">
                      {{ isFreeShipping ? 'Gratis' : 'Por definir' }}
                    </span>
                  </div>
                  <div class="flex justify-between font-bold text-base pt-1 border-t border-white/10">
                    <span class="text-white">Total</span>
                    <span class="text-white">{{ formatPrice(finalTotal) }}</span>
                  </div>
                </div>

                <p v-if="generalError" class="text-red-400 text-xs">{{ generalError }}</p>

                <Button
                  class="w-full bg-[#E3F450] text-black hover:bg-[#E3F450]/80 font-semibold"
                  :disabled="processing || addressesStore.loading"
                  @click="proceedToPayment"
                >
                  <Loader2 v-if="processing" class="h-4 w-4 mr-2 animate-spin" />
                  <span>{{ processing ? 'Procesando...' : 'Pagar Ahora' }}</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
