export interface PaymentRequest {
  cart: CartItemForPayment[];
  user_id: number;
  return_url: string;
  subtotal: number;
}

export interface CartItemForPayment {
  patternId: number;
  patternName: string;
  designId: number;
  designName: string;
  price: number;
  quantity: number;
  status: string;
  addedAt: string;
  imageUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  data?: {
    token: string;
    url: string;
    orderId: number;
  };
  message?: string;
  error?: string;
}

export interface PaymentConfirmationRequest {
  token: string;
}

export interface PaymentConfirmationResponse {
  success: boolean;
  data?: {
    buy_order: string;
    session_id: string;
    amount: number;
    status: string;
    response_code: number;
    accounting_date: string;
    transaction_date: string;
    vci: string;
    card_detail?: {
      card_number: string;
    };
    orderId: number;
    orderNumber: string;
  };
  message?: string;
  error?: string;
}

export interface PaymentStatus {
  orderId: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  totalAmount: number;
  createdAt: Date;
}

export interface PaymentStatusResponse {
  success: boolean;
  data?: PaymentStatus;
  message?: string;
  error?: string;
}
