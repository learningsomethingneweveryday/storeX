import { Product, User, Order, ApiResponse, FilterState } from '../types';

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(filters?: Partial<FilterState>): Promise<{ products: Product[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.minPrice !== undefined && filters.minPrice > 0) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined && filters.maxPrice < 1000) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.minRating !== undefined && filters.minRating > 0) params.append('rating', filters.minRating.toString());
    if (filters?.inStockOnly) params.append('inStock', 'true');
    if (filters?.sortBy) params.append('sort', filters.sortBy);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    const json = await res.json();
    return {
      products: json.data || [],
      total: json.total || 0
    };
  },

  async getProductById(id: string): Promise<Product & { related?: Product[] }> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('Product not found.');
      throw new Error('Unable to load product details.');
    }
    const json = await res.json();
    return json.data;
  },

  async getCategories(): Promise<Array<{ id: string; name: string; count: number; icon: string }>> {
    const res = await fetch(`${API_BASE}/products/categories`);
    if (!res.ok) throw new Error('Failed to load categories');
    const json = await res.json();
    return json.data || [];
  },

  // Auth
  async register(name: string, email: string, password: string, confirmPassword?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword })
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Registration failed.');
    }
    if (json.token) {
      localStorage.setItem('storex_token', json.token);
    }
    return { user: json.data, token: json.token };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Login failed.');
    }
    if (json.token) {
      localStorage.setItem('storex_token', json.token);
    }
    return { user: json.data, token: json.token };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('storex_token');
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  },

  async getMe(): Promise<User | null> {
    const token = localStorage.getItem('storex_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  // Orders
  async createOrder(orderData: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: any;
    paymentMethod: string;
    discount?: number;
    shippingFee?: number;
    customerEmail?: string;
  }): Promise<Order> {
    const token = localStorage.getItem('storex_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to place order.');
    }
    return json.data;
  },

  async getOrders(): Promise<Order[]> {
    const token = localStorage.getItem('storex_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/orders`, { headers });
    if (!res.ok) throw new Error('Failed to fetch orders.');
    const json = await res.json();
    return json.data || [];
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if (!res.ok) throw new Error('Order not found.');
    const json = await res.json();
    return json.data;
  },

  // System Health
  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  }
};
