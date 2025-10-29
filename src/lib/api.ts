import axios from 'axios'
import type { 
  MeasurementType, 
  UserMeasurement, 
  BatchMeasurementRequest,
  BatchMeasurementResponse 
} from '@/types/measurements.types'
import type {
  //Design,
  DesignsResponse,
  DesignResponse,
  DesignMeasurementsResponse
} from '@/types/design.types'
import type {
  Pattern,
  GeneratePatternRequest,
  PatternsResponse,
  PatternResponse,
  UpdatePatternRequest
} from '@/types/pattern.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Measurement API functions
export const measurementsApi = {
  // Get all measurement types (public endpoint)
  getMeasurementTypes: async () => {
    const response = await api.get<{ success: boolean; data: MeasurementType[]; count: number }>('/measurement-types')
    return response.data
  },

  // Get user measurements
  getUserMeasurements: async (userId: number) => {
    const response = await api.get<{ success: boolean; data: UserMeasurement[]; count: number }>(`/user-measurements/user/${userId}`)
    return response.data
  },

  // Batch save measurements
  batchSaveMeasurements: async (data: BatchMeasurementRequest) => {
    const response = await api.post<BatchMeasurementResponse>('/user-measurements/batch', data)
    return response.data
  },

  // Delete single measurement
  deleteMeasurement: async (id: number) => {
    const response = await api.delete<{ success: boolean }>(`/user-measurements/${id}`)
    return response.data
  },
}

// Design API functions
export const designsApi = {
  // Get all designs (public endpoint)
  getDesigns: async () => {
    const response = await api.get<DesignsResponse>('/designs')
    return response.data
  },

  // Get only active designs (public endpoint)
  getActiveDesigns: async () => {
    const response = await api.get<DesignsResponse>('/designs/active')
    return response.data
  },

  // Get design by ID (public endpoint)
  getDesignById: async (id: number) => {
    const response = await api.get<DesignResponse>(`/designs/${id}`)
    return response.data
  },

  // Get required measurements for a design (public endpoint)
  getDesignMeasurements: async (id: number) => {
    const response = await api.get<DesignMeasurementsResponse>(`/designs/${id}/measurements`)
    return response.data
  },
}

// Pattern API functions
export const patternsApi = {
  // Generate a new pattern
  generatePattern: async (data: GeneratePatternRequest) => {
    const response = await api.post<PatternResponse>('/patterns/generate', data)
    return response.data
  },

  // Get user's patterns
  getUserPatterns: async (userId: number) => {
    const response = await api.get<PatternsResponse>(`/patterns/user/${userId}`)
    return response.data
  },

  // Get pattern by ID
  getPatternById: async (id: number) => {
    const response = await api.get<PatternResponse>(`/patterns/${id}`)
    return response.data
  },

  // Get pattern SVG
  getPatternSvg: async (id: number) => {
    const response = await api.get<string>(`/patterns/${id}/svg`, {
      headers: { 'Accept': 'image/svg+xml' }
    })
    return response.data
  },

  // Update pattern
  updatePattern: async (id: number, data: UpdatePatternRequest) => {
    const response = await api.put<PatternResponse>(`/patterns/${id}`, data)
    return response.data
  },

  // Finalize pattern
  finalizePattern: async (id: number) => {
    const response = await api.put<PatternResponse>(`/patterns/${id}/finalize`)
    return response.data
  },

  // Archive pattern
  archivePattern: async (id: number) => {
    const response = await api.put<PatternResponse>(`/patterns/${id}/archive`)
    return response.data
  },

  // Delete pattern
  deletePattern: async (id: number) => {
    const response = await api.delete<{ success: boolean }>(`/patterns/${id}`)
    return response.data
  },
}

export default api
