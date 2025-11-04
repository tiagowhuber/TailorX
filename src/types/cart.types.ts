/**
 * Cart Types
 * Types for the shopping cart functionality
 */

export interface CartItem {
  patternId: number
  patternName: string
  designId: number
  designName: string
  price: number // Frozen price from design.base_price at add-to-cart time
  quantity: number
  status: 'draft' | 'finalized' | 'archived' // Pattern status at add time
  addedAt: string // ISO timestamp
  imageUrl?: string // Design image for display
}

export interface CartState {
  items: CartItem[]
  lastUpdated: string
}
