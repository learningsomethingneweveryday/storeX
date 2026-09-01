export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  additionalImages?: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  brand?: string;
  features?: string[];
  specs?: Record<string, string>;
  isFeatured?: boolean;
  isNew?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered';
  paymentMethod: 'Credit Card' | 'PayPal' | 'UPI / NetBanking' | 'Cash on Delivery';
  createdAt: string;
  estimatedDelivery: string;
}

export interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | 'newest' | 'name-asc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
}
