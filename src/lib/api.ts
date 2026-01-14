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
  //Pattern,
  GeneratePatternRequest,
  PatternsResponse,
  PatternResponse,
  UpdatePatternRequest
} from '@/types/pattern.types'
import type {
  PaymentRequest,
  PaymentResponse,
  PaymentConfirmationResponse,
  PaymentStatusResponse
} from '@/types/payment.types'
import type {
  CreateAddressRequest,
  UpdateAddressRequest,
  AddressResponse,
  AddressesResponse
} from '@/types/address.types'

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

  // Generate measurements from images (TailorVision)
  generateMeasurements: async (formData: FormData) => {
    const response = await api.post<{ 
      success: boolean; 
      message: string; 
      data: { 
        measurements: UserMeasurement[]; 
        raw_measurements: Record<string, number>;
        warnings?: string[];
        debug_images?: string[];
        debug_mask_front?: string;
        debug_mask_side?: string;
        debug_mask_arm?: string;
      } 
    }>('/tailor-vision/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
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

  // Unarchive pattern
  unarchivePattern: async (id: number) => {
    const response = await api.put<PatternResponse>(`/patterns/${id}/unarchive`)
    return response.data
  },

  // Export pattern to PLT
  exportPatternToPLT: async (id: number) => {
    const response = await api.post(`/patterns/${id}/export/plt`, {}, {
      responseType: 'blob'
    })
    
    // Extract filename from content-disposition header if available
    let filename = '';
    const disposition = response.headers['content-disposition'];
    /**
     * Regex explanation:
     * - matches "filename=" followed by optional whitespace
     * - captures the filename value which can be either:
     *   - quoted string: (['"]).*?\2
     *   - unquoted token: [^;\n]*
     */
    const filenameRegex = /filename\s*=\s*((['"])(.*?)\2|([^;\n]*))/; 
    
    if (disposition) {
      const matches = filenameRegex.exec(disposition);
      if (matches != null) {
        if (matches[3]) {
            filename = matches[3];
        } else if (matches[4]) {
            filename = matches[4];
        }
      }
    }

    // Fallback: Check content-type if filename extraction failed
    if (!filename) {
        const type = response.data.type;
        if (type === 'application/zip' || type === 'application/x-zip-compressed') {
             filename = 'pattern_set.zip';
        } else {
             filename = 'pattern.plt';
        }
    }

    return {
      data: response.data,
      filename
    }
  },

  // Delete pattern
  deletePattern: async (id: number) => {
    const response = await api.delete<{ success: boolean }>(`/patterns/${id}`)
    return response.data
  },

  // Get admin ordered patterns
  getOrderedPatterns: async () => {
    const response = await api.get<{ success: boolean; data: any[]; count: number }>('/patterns/ordered')
    return response.data
  },
}

// Payment API functions
export const paymentsApi = {
  // Create a new payment transaction
  createPayment: async (data: PaymentRequest) => {
    const response = await api.post<PaymentResponse>('/payments/create', data)
    return response.data
  },

  // Confirm payment status with token
  confirmPayment: async (token: string) => {
    const response = await api.put<PaymentConfirmationResponse>(`/payments/confirm/${token}`)
    return response.data
  },

  // Get payment status by order ID
  getPaymentStatus: async (orderId: number) => {
    const response = await api.get<PaymentStatusResponse>(`/payments/order/${orderId}`)
    return response.data
  },
}

// Order API functions
export const ordersApi = {
  // Get all orders (admin only)
  getAllOrders: async () => {
    const response = await api.get<{ success: boolean; data: any[]; count: number }>('/orders')
    return response.data
  },

  // Get user's orders
  getUserOrders: async (userId: number) => {
    const response = await api.get<{ success: boolean; data: any[]; count: number }>(`/orders/user/${userId}`)
    return response.data
  },

  // Get order by ID
  getOrderById: async (orderId: number) => {
    const response = await api.get<{ success: boolean; data: any }>(`/orders/${orderId}`)
    return response.data
  },
}

// Address API functions
export const addressesApi = {
  // Get user addresses
  getUserAddresses: async () => {
    const response = await api.get<AddressesResponse>('/user-addresses')
    return response.data
  },

  // Create address
  createAddress: async (data: CreateAddressRequest) => {
    const response = await api.post<AddressResponse>('/user-addresses', data)
    return response.data
  },

  // Update address
  updateAddress: async (id: number, data: UpdateAddressRequest) => {
    const response = await api.put<AddressResponse>(`/user-addresses/${id}`, data)
    return response.data
  },

  // Delete address
  deleteAddress: async (id: number) => {
    const response = await api.delete<{ success: boolean; message?: string }>(`/user-addresses/${id}`)
    return response.data
  },
}

export default api
