// User and Auth Types
export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Listing Types
export interface Listing {
  id: string;
  name: string;
  location: string;
  price: number;
  pictures?: string[];
  owner_id: number;
  created_at: string;
  updated_at: string;
}

// Booking Types
export interface Booking {
  id: string;
  booked_listing: string;
  user_id: number;
  from: string;
  to: string;
  status: "pending" | "confirmed" | "failed";
  created_at: string;
  updated_at: string;
}

// Payment Types
export interface Payment {
  id: number;
  booking_id: string;
  amount: number;
  status: "pending" | "authorized" | "captured" | "failed" | "refunded";
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  idempotency_key: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// Payloads
export interface CreateBookingPayload {
  booked_listing: string;
  from: string;
  to: string;
  idempotency_key?: string;
}

export interface BookingWithPayment {
  booking: Booking;
  payment: Payment;
}

// API Response Types
export interface CreateBookingResponse {
  success: boolean;
  data: {
    booking: Booking;
    razorpay_key: string;
  };
  message: string;
}

export interface PaymentResponse {
  id: string;
  booking_id: string;
  amount: number;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  status: string;
  short_url?: string;
  created_at: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  data: PaymentResponse;
}

// API Types
export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
