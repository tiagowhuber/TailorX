// Design types matching backend schema

export interface MeasurementType {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface DesignMeasurement {
  id: number
  design_id: number
  measurement_type_id: number
  is_required: boolean
  created_at?: string
  measurementType?: MeasurementType
}

export interface Design {
  id: number
  name: string
  description?: string
  freesewing_pattern?: string
  base_price: number
  image_url?: string
  default_settings?: Record<string, any>
  is_active: boolean
  created_at?: string
  updated_at?: string
  requiredMeasurements?: DesignMeasurement[]
}

// API Response types
export interface DesignsResponse {
  success: boolean
  data: Design[]
  count: number
}

export interface DesignResponse {
  success: boolean
  data: Design
}

export interface DesignMeasurementsResponse {
  success: boolean
  data: DesignMeasurement[]
  count: number
}
