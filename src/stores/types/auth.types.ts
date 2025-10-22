export interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  created_at?: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  first_name?: string
  last_name?: string
}
