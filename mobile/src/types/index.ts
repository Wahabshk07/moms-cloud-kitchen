export type Role = 'ADMIN' | 'CUSTOMER';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'COD';

export interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  role: Role;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  ingredients: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  categoryId: string | null;
  category: Category | null;
  createdAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerName: string;
  phone: string;
  address: string;
  instructions: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string | null;
  unitPrice: number;
  quantity: number;
  isAvailable: boolean;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  preparingOrders: number;
  completedOrders: number;
  menuItemCount: number;
  recentOrders: Order[];
  totalRevenue: number;
  totalCustomers: number;
  activeCustomers: number;
  performance: Array<{ date: string; value: number }>;
}

export interface AppConfig {
  deliveryFee: number;
}

/* ---------- Request payloads ---------- */

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email?: string;
  password: string;
}

export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  ingredients: string[];
  isAvailable: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  categoryId: string | null;
}

export interface CategoryPayload {
  name: string;
  image?: string;
  isActive?: boolean;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  items: { productId: string; quantity: number }[];
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
}

export interface ProductQuery {
  categoryId?: string | null;
  search?: string;
  featured?: boolean;
  popular?: boolean;
  admin?: boolean;
}

export interface UploadFile {
  uri: string;
  name?: string | null;
  mimeType?: string | null;
}
