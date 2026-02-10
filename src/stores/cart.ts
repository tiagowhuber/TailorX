import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CartItem, CartState } from '@/types/cart.types'
import type { Pattern } from '@/types/pattern.types'
import { useCatalogStore } from '@/stores/catalog'
import { useDiscountCodesStore } from '@/stores/discountCodes'

const CART_STORAGE_KEY = 'tailorx_cart'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const loading = ref(false)
  const discountCode = ref<string | null>(null)
  const discountAmount = ref<number>(0)
  const isFreeShipping = ref(false)

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  // This is the subtotal
  const totalAmount = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })
  
  // This is the final total to pay
  const finalTotal = computed(() => {
    return Math.max(0, totalAmount.value - discountAmount.value)
  })

  const cartItems = computed(() => items.value)

  // Helper: Save to localStorage
  const saveToStorage = () => {
    try {
      const state: CartState = {
        items: items.value,
        lastUpdated: new Date().toISOString(),
      }
      // Note: we're not persisting discount code to avoid validation issues on reload
      // But we could if we re-validated on load
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }

  // Helper: Load from localStorage
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const state: CartState = JSON.parse(stored)
        items.value = state.items || []
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      localStorage.removeItem(CART_STORAGE_KEY)
      items.value = []
    }
  }

  // Helper: Find item index by pattern ID
  const findItemIndex = (patternId: number): number => {
    return items.value.findIndex((item) => item.patternId === patternId)
  }

  // Actions
  const applyDiscount = async (code: string) => {
    const discountStore = useDiscountCodesStore()
    const result = await discountStore.validateCode(code, items.value)
    
    if (result.success && result.data.isValid) {
      discountCode.value = code
      discountAmount.value = Number(result.data.discountAmount)
      isFreeShipping.value = !!result.data.isFreeShipping
      return { success: true, message: 'Código aplicado correctamente' }
    } else {
      discountCode.value = null
      discountAmount.value = 0
      isFreeShipping.value = false
      return { success: false, message: result.message || 'Código inválido' }
    }
  }

  const removeDiscount = () => {
    discountCode.value = null
    discountAmount.value = 0
    isFreeShipping.value = false
  }

  const addToCart = async (pattern: Pattern): Promise<{ success: boolean; message: string }> => {
    // Reset discount when modifying cart to ensure validity
    if(discountCode.value) removeDiscount()
    
    try {

      // Resolve design info (may be missing on pattern)
      let designId = pattern.design_id
      let designName: string | undefined = pattern.design?.name
      let basePrice: number | undefined = pattern.design?.base_price as unknown as number | undefined
      let imageUrl: string | undefined = (pattern as any).design?.image_url

      if (!designName || basePrice === undefined) {
        // Fallback: fetch design by id from catalog store
        const catalogStore = useCatalogStore()
        if (!designId) {
          return {
            success: false,
            message: 'El patrón no tiene un diseño asociado',
          }
        }
        const res = await catalogStore.fetchDesignById(designId)
        if (!res.success || !res.data) {
          return {
            success: false,
            message: 'No se pudo obtener el diseño asociado al patrón',
          }
        }
        designName = res.data.name
        basePrice = res.data.base_price
        imageUrl = res.data.image_url
        designId = res.data.id
      }

      // Check if item already exists in cart
      const existingIndex = findItemIndex(pattern.id)
      if (existingIndex !== -1) {
        const existingItem = items.value[existingIndex]
        if (existingItem) {
          existingItem.quantity += 1
          saveToStorage()
          return {
            success: true,
            message: `Cantidad actualizada en el carrito (${existingItem.quantity})`,
          }
        }
      }

      // Add new item
      const cartItem: CartItem = {
        patternId: pattern.id,
        patternName: pattern.name || `Patrón #${pattern.id}`,
        designId: designId!,
        designName: designName!,
        price: basePrice!, // Freeze price at add-to-cart time
        quantity: 1,
        status: pattern.status,
        addedAt: new Date().toISOString(),
        imageUrl,
      }

      items.value.push(cartItem)
      saveToStorage()

      return {
        success: true,
        message: 'Patrón agregado al carrito',
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return {
        success: false,
        message: 'Error al agregar al carrito',
      }
    }
  }

  const removeFromCart = (patternId: number): { success: boolean; message: string } => {
    try {
      const index = findItemIndex(patternId)
      if (index === -1) {
        return {
          success: false,
          message: 'Patrón no encontrado en el carrito',
        }
      }

      items.value.splice(index, 1)
      saveToStorage()

      return {
        success: true,
        message: 'Patrón eliminado del carrito',
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return {
        success: false,
        message: 'Error al eliminar del carrito',
      }
    }
  }

  const updateQuantity = (
    patternId: number,
    quantity: number
  ): { success: boolean; message: string } => {
    try {
      if (quantity < 1) {
        return removeFromCart(patternId)
      }

      const index = findItemIndex(patternId)
      if (index === -1) {
        return {
          success: false,
          message: 'Patrón no encontrado en el carrito',
        }
      }

      const item = items.value[index]
      if (item) {
        item.quantity = quantity
        saveToStorage()
      }

      return {
        success: true,
        message: 'Cantidad actualizada',
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      return {
        success: false,
        message: 'Error al actualizar cantidad',
      }
    }
  }

  const clearCart = (): { success: boolean; message: string } => {
    try {
      items.value = []
      localStorage.removeItem(CART_STORAGE_KEY)

      return {
        success: true,
        message: 'Carrito vaciado',
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return {
        success: false,
        message: 'Error al vaciar el carrito',
      }
    }
  }

  const isInCart = (patternId: number): boolean => {
    return findItemIndex(patternId) !== -1
  }

  const getItemQuantity = (patternId: number): number => {
    const index = findItemIndex(patternId)
    return index !== -1 && items.value[index] ? items.value[index]!.quantity : 0
  }

  // Initialize cart from localStorage
  const initializeCart = () => {
    loadFromStorage()
  }

  // Format price helper
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return {
    // State
    items,
    loading,
    // Getters
    itemCount,
    totalAmount,
    cartItems,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    initializeCart,
    formatPrice,
    // Discount
    discountCode,
    discountAmount,
    finalTotal,
    isFreeShipping,
    applyDiscount,
    removeDiscount
  }
})
