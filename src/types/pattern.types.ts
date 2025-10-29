// Pattern types matching backend schema

import type { Design } from './design.types'

export interface Pattern {
  id: number
  user_id: number
  design_id: number
  name?: string
  measurements_used: Record<string, number>
  settings_used: Record<string, any>
  svg_data: string
  svg_size_kb?: number
  status: 'draft' | 'finalized' | 'archived'
  created_at?: string
  updated_at?: string
  design?: Design
  user?: {
    id: number
    email: string
    first_name?: string
    last_name?: string
  }
}

// Request types
export interface GeneratePatternRequest {
  user_id: number
  design_id: number
}

export interface UpdatePatternRequest {
  name?: string
  status?: 'draft' | 'finalized' | 'archived'
}

// Response types
export interface PatternsResponse {
  success: boolean
  data: Pattern[]
  count: number
}

export interface PatternResponse {
  success: boolean
  data: Pattern
  message?: string
}

export interface GeneratePatternErrorResponse {
  success: false
  message: string
  missing_measurements?: Array<{
    id: number
    name: string
    freesewing_key: string
    unit: string
  }>
}
