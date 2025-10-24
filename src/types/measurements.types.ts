export interface MeasurementType {
  id: number
  name: string
  description?: string
  freesewing_key?: string
  created_at?: string
}

export interface UserMeasurement {
  id: number
  user_id: number
  measurement_type_id: number
  value: number
  created_at?: string
  updated_at?: string
  measurementType?: MeasurementType
}

export interface BatchMeasurementInput {
  measurement_type_id: number
  value: number
}

export interface BatchMeasurementRequest {
  user_id: number
  measurements: BatchMeasurementInput[]
}

export interface BatchMeasurementResponse {
  success: boolean
  data: {
    processed: number
    errorCount: number
    results: UserMeasurement[]
    errors: any[]
  }
}
