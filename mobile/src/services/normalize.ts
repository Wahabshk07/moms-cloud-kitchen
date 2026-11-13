/**
 * The backend contract is still settling, so every response is normalised
 * into the app's own types. These helpers tolerate common shape variations:
 * Prisma Decimals serialised as strings, `{ data: ... }` envelopes, nested
 * relations, snake_case vs camelCase, etc.
 */
import { API_URL, DEFAULT_DELIVERY_FEE } from '@/constants';
import type {
  AppConfig,
  Category,
  DashboardStats,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  Role,
  User,
} from '@/types';

type Rec = Record<string, unknown>;

const isRec = (v: unknown): v is Rec => typeof v === 'object' && v !== null && !Array.isArray(v);

function str(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  return fallback;
}

function strOrNull(v: unknown): string | null {
  const s = str(v);
  return s ? s : null;
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  // Prisma Decimal serialised as object with toString/ d,e,s fields
  if (isRec(v) && typeof v.toString === 'function') {
    const n = Number(String(v));
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

/** Unwrap `{ data: x }` style envelopes. */
export function unwrap(json: unknown): unknown {
  if (isRec(json) && 'data' in json && Object.keys(json).length <= 3) return json.data;
  return json;
}

export function toList(json: unknown, keys: string[] = ['items', 'results']): unknown[] {
  const body = unwrap(json);
  if (Array.isArray(body)) return body;
  if (isRec(body)) {
    for (const k of keys) {
      const v = body[k];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

/** Turns relative upload paths into absolute URLs. */
export function resolveImageUrl(value: unknown): string | null {
  const s = strOrNull(value);
  if (!s) return null;
  if (/^(https?:|file:|data:|content:)/i.test(s)) {
    // Rewrite localhost URLs served by the API so emulators/devices can reach them.
    return s.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, API_URL);
  }
  return `${API_URL}${s.startsWith('/') ? '' : '/'}${s}`;
}

const ROLES: Role[] = ['ADMIN', 'CUSTOMER'];

export function normalizeUser(raw: unknown): User {
  const r = isRec(raw) ? raw : {};
  const roleText = str(r.role, 'CUSTOMER').toUpperCase() as Role;
  return {
    id: str(r.id ?? r._id),
    name: str(r.name ?? r.fullName, 'Guest'),
    email: strOrNull(r.email),
    phone: str(r.phone),
    address: strOrNull(r.address ?? r.defaultAddress),
    role: ROLES.includes(roleText) ? roleText : 'CUSTOMER',
    createdAt: strOrNull(r.createdAt) ?? undefined,
  };
}

export function normalizeCategory(raw: unknown): Category {
  const r = isRec(raw) ? raw : {};
  const count = isRec(r._count) ? num(r._count.products, NaN) : num(r.productCount, NaN);
  return {
    id: str(r.id ?? r._id),
    name: str(r.name, 'Untitled'),
    description: strOrNull(r.description),
    productCount: Number.isFinite(count) ? count : undefined,
  };
}

function normalizeIngredients(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v
      .map((i) => (isRec(i) ? str(i.name) : str(i)))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof v === 'string') {
    return v
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function normalizeProduct(raw: unknown): Product {
  const r = isRec(raw) ? raw : {};
  const category = isRec(r.category) ? normalizeCategory(r.category) : null;
  const categoryId = strOrNull(r.categoryId) ?? category?.id ?? null;
  return {
    id: str(r.id ?? r._id),
    name: str(r.name, 'Untitled'),
    description: strOrNull(r.description),
    price: num(r.price),
    imageUrl: resolveImageUrl(r.imageUrl ?? r.image ?? r.image_url),
    ingredients: normalizeIngredients(r.ingredients),
    isAvailable: bool(r.isAvailable ?? r.available, true),
    isFeatured: bool(r.isFeatured ?? r.featured, false),
    isPopular: bool(r.isPopular ?? r.popular, false),
    categoryId,
    category,
    createdAt: strOrNull(r.createdAt) ?? undefined,
  };
}

const STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

function normalizeStatus(v: unknown): OrderStatus {
  const s = str(v, 'PENDING').toUpperCase().replace(/[\s-]+/g, '_');
  if (s === 'COMPLETED') return 'DELIVERED';
  if (s === 'CANCELED') return 'CANCELLED';
  if (s === 'OUT_FOR_DELIVERY') return 'READY_FOR_DELIVERY';
  return STATUSES.includes(s as OrderStatus) ? (s as OrderStatus) : 'PENDING';
}

export function normalizeOrderItem(raw: unknown, index = 0): OrderItem {
  const r = isRec(raw) ? raw : {};
  const product = isRec(r.product) ? r.product : {};
  const unitPrice = num(r.unitPrice ?? r.price ?? product.price);
  const quantity = Math.max(1, Math.round(num(r.quantity, 1)));
  return {
    id: str(r.id ?? r._id, `item-${index}`),
    productId: str(r.productId ?? product.id),
    productName: str(r.productName ?? r.name ?? product.name, 'Item'),
    imageUrl: resolveImageUrl(r.productImage ?? r.imageUrl ?? r.image ?? product.imageUrl),
    unitPrice,
    quantity,
    lineTotal: num(r.totalPrice ?? r.lineTotal ?? r.total, unitPrice * quantity),
  };
}

export function normalizeOrder(raw: unknown): Order {
  const r = isRec(raw) ? raw : {};
  const items = (Array.isArray(r.items) ? r.items : Array.isArray(r.orderItems) ? r.orderItems : []).map(
    (it, i) => normalizeOrderItem(it, i),
  );
  const subtotal = num(r.subtotal, items.reduce((s, i) => s + i.lineTotal, 0));
  const deliveryFee = num(r.deliveryFee, DEFAULT_DELIVERY_FEE);
  const id = str(r.id ?? r._id);
  const user = isRec(r.user) ? r.user : {};
  return {
    id,
    orderNumber: str(r.orderNumber ?? r.number, id ? `#${id.slice(-6).toUpperCase()}` : '#—'),
    status: normalizeStatus(r.orderStatus ?? r.status),
    items,
    subtotal,
    deliveryFee,
    total: num(r.total ?? r.totalAmount, subtotal + deliveryFee),
    paymentMethod: 'COD',
    customerName: str(r.customerName ?? r.name ?? user.name, 'Customer'),
    phone: str(r.customerPhone ?? r.phone ?? user.phone),
    address: str(r.deliveryAddress ?? r.address),
    instructions: strOrNull(r.deliveryInstructions ?? r.instructions ?? r.notes),
    userId: strOrNull(r.userId ?? user.id),
    createdAt: str(r.createdAt, new Date().toISOString()),
    updatedAt: strOrNull(r.updatedAt) ?? undefined,
  };
}

export function normalizeDashboard(raw: unknown): DashboardStats {
  const r = (isRec(unwrap(raw)) ? unwrap(raw) : {}) as Rec;
  const counts = isRec(r.ordersByStatus) ? r.ordersByStatus : isRec(r.counts) ? r.counts : {};
  const pending = num(r.pendingOrders ?? r.pending ?? counts.PENDING);
  const confirmed = num(r.confirmedOrders ?? r.confirmed ?? counts.CONFIRMED);
  const preparing = num(r.preparingOrders ?? r.preparing ?? counts.PREPARING);
  const completed = num(r.completedOrders ?? r.completed ?? r.deliveredOrders ?? counts.DELIVERED);
  const recent = Array.isArray(r.recentOrders) ? r.recentOrders.map(normalizeOrder) : [];
  const performanceRaw = Array.isArray(r.performance) ? r.performance : [];
  return {
    totalOrders: num(r.totalOrders ?? r.total ?? r.orderCount, pending + confirmed + completed),
    pendingOrders: pending,
    confirmedOrders: confirmed,
    preparingOrders: preparing,
    completedOrders: completed,
    menuItemCount: num(
      r.menuItemCount ?? r.totalMenuItems ?? r.totalProducts ?? r.productCount ?? r.menuItems,
    ),
    recentOrders: recent,
    totalRevenue: num(r.totalRevenue ?? r.revenue),
    totalCustomers: num(r.totalCustomers ?? r.customers),
    activeCustomers: num(r.activeCustomers),
    performance: performanceRaw
      .filter(isRec)
      .map((p) => ({ date: str(p.date), value: num(p.value) })),
  };
}

export function normalizeConfig(raw: unknown): AppConfig {
  const r = (isRec(unwrap(raw)) ? unwrap(raw) : {}) as Rec;
  return { deliveryFee: num(r.deliveryFee ?? r.delivery_fee, DEFAULT_DELIVERY_FEE) };
}
