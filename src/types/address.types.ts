export interface UserAddress {
  id: number
  user_id: number
  recipient_name?: string
  street_address: string
  apartment_unit?: string
  comuna: string
  region: string
  is_default: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateAddressRequest {
  recipient_name?: string
  street_address: string
  apartment_unit?: string
  comuna: string
  region: string
  is_default: boolean
}

export interface UpdateAddressRequest {
  recipient_name?: string
  street_address?: string
  apartment_unit?: string
  comuna?: string
  region?: string
  is_default?: boolean
}

export interface AddressResponse {
  success: boolean
  data: UserAddress
  message?: string
}

export interface AddressesResponse {
  success: boolean
  data: UserAddress[]
  count: number
  message?: string
}
