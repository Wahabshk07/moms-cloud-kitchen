import { API_URL } from '@/constants';
import type {
  AppConfig,
  AuthSession,
  Category,
  CategoryPayload,
  CreateOrderPayload,
  DashboardStats,
  LoginPayload,
  Order,
  OrderStatus,
  Product,
  ProductPayload,
  ProductQuery,
  RegisterPayload,
  UpdateProfilePayload,
  UploadFile,
  User,
} from '@/types';
import { ApiError } from '@/utils/errors';
import {
  normalizeCategory,
  normalizeConfig,
  normalizeDashboard,
  normalizeOrder,
  normalizeProduct,
  normalizeUser,
  toList,
  unwrap,
} from './normalize';

/* ------------------------------------------------------------------ */
/* Core fetch wrapper                                                  */
/* ------------------------------------------------------------------ */

type TokenGetter = () => string | null;
type UnauthorizedHandler = () => void;

let getToken: TokenGetter = () => null;
let onUnauthorized: UnauthorizedHandler = () => undefined;

/** Called once by the auth store so the client stays decoupled from state. */
export function configureApi(opts: { getToken: TokenGetter; onUnauthorized: UnauthorizedHandler }) {
  getToken = opts.getToken;
  onUnauthorized = opts.onUnauthorized;
}

const REQUEST_TIMEOUT_MS = 15000;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  formData?: FormData;
  query?: Record<string, string | number | boolean | null | undefined>;
  /** Skip the global 401 → logout handling (e.g. login screen itself). */
  skipAuthHandling?: boolean;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  if (!query) return url;
  const params = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return params ? `${url}?${params}` : url;
}

function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const p = payload as { message?: unknown; error?: unknown };
    if (Array.isArray(p.message)) return p.message.map(String).join('\n');
    if (typeof p.message === 'string') return p.message;
    if (typeof p.error === 'string') return p.error;
  }
  return fallback;
}

async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData; // let fetch set the multipart boundary
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method: opts.method ?? 'GET',
      headers,
      body,
      signal: controller.signal,
    });
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError';
    throw new ApiError(
      aborted
        ? 'The server took too long to respond. Please try again.'
        : `Can't reach the server at ${API_URL}. Check your connection and API URL.`,
      0,
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }

  if (!res.ok) {
    if (res.status === 401 && !opts.skipAuthHandling && token) onUnauthorized();
    const fallback =
      res.status === 401
        ? 'Your session has expired. Please sign in again.'
        : res.status === 404
          ? 'We could not find what you were looking for.'
          : res.status >= 500
            ? 'The server ran into a problem. Please try again shortly.'
            : 'Request failed.';
    throw new ApiError(extractMessage(json, fallback), res.status, json);
  }

  return json as T;
}

/* ------------------------------------------------------------------ */
/* Typed endpoints                                                     */
/* ------------------------------------------------------------------ */

function parseSession(json: unknown): AuthSession {
  const body = (unwrap(json) ?? {}) as Record<string, unknown>;
  const token = [body.accessToken, body.access_token, body.token, body.jwt].find(
    (t): t is string => typeof t === 'string' && t.length > 0,
  );
  if (!token) throw new ApiError('The server did not return a session token.', 500, json);
  return { token, user: normalizeUser(body.user ?? body.profile) };
}

export const authApi = {
  login: async (payload: LoginPayload) =>
    parseSession(await request('/auth/login', { method: 'POST', body: payload, skipAuthHandling: true })),
  register: async (payload: RegisterPayload) => {
    const email = payload.email?.trim();
    const body = {
      name: payload.name.trim(),
      phone: payload.phone.trim().replace(/[\s-]/g, ''),
      password: payload.password,
      ...(email ? { email } : {}),
    };
    return parseSession(await request('/auth/register', { method: 'POST', body, skipAuthHandling: true }));
  },
};

export const usersApi = {
  me: async () => normalizeUser(unwrap(await request('/users/me'))),
  updateMe: async (payload: UpdateProfilePayload): Promise<User> => {
    const json = await request('/users/me', { method: 'PATCH', body: payload });
    return normalizeUser(unwrap(json));
  },
};

export const categoriesApi = {
  list: async (): Promise<Category[]> =>
    toList(await request('/categories'), ['items', 'categories']).map(normalizeCategory),
  listAdmin: async (): Promise<Category[]> =>
    toList(await request('/categories/admin/all'), ['items', 'categories']).map(normalizeCategory),
  create: async (payload: CategoryPayload) =>
    normalizeCategory(unwrap(await request('/categories', { method: 'POST', body: payload }))),
  update: async (id: string, payload: CategoryPayload) =>
    normalizeCategory(unwrap(await request(`/categories/${id}`, { method: 'PATCH', body: payload }))),
  remove: async (id: string) => {
    await request(`/categories/${id}`, { method: 'DELETE' });
  },
};

export const productsApi = {
  list: async (query: ProductQuery = {}): Promise<Product[]> => {
    const json = await request('/products', {
      query: {
        categoryId: query.categoryId ?? undefined,
        search: query.search?.trim() || undefined,
        featured: query.featured ? true : undefined,
        popular: query.popular ? true : undefined,
      },
    });
    return toList(json, ['items', 'products']).map(normalizeProduct);
  },
  listAdmin: async (query: ProductQuery = {}): Promise<Product[]> => {
    const json = await request('/products/admin/all', {
      query: {
        categoryId: query.categoryId ?? undefined,
        search: query.search?.trim() || undefined,
      },
    });
    return toList(json, ['items', 'products']).map(normalizeProduct);
  },
  get: async (id: string) => normalizeProduct(unwrap(await request(`/products/${id}`))),
  create: async (payload: ProductPayload) =>
    normalizeProduct(unwrap(await request('/products', { method: 'POST', body: payload }))),
  update: async (id: string, payload: Partial<ProductPayload>) =>
    normalizeProduct(unwrap(await request(`/products/${id}`, { method: 'PATCH', body: payload }))),
  remove: async (id: string) => {
    await request(`/products/${id}`, { method: 'DELETE' });
  },
};

export const ordersApi = {
  create: async (payload: CreateOrderPayload) =>
    normalizeOrder(unwrap(await request('/orders', { method: 'POST', body: payload }))),
  /** Customer: orders for the signed-in user. */
  mine: async (): Promise<Order[]> =>
    toList(await request('/orders/mine'), ['items', 'orders']).map(normalizeOrder),
  getMine: async (id: string) =>
    normalizeOrder(unwrap(await request(`/orders/mine/${id}`))),
  /** Admin: every order. */
  all: async (status?: OrderStatus | null): Promise<Order[]> => {
    const json = await request('/admin/orders', {
      query: { status: status ?? undefined, limit: 50 },
    });
    const body = unwrap(json) as { items?: unknown } | unknown;
    const list =
      body && typeof body === 'object' && Array.isArray((body as { items?: unknown }).items)
        ? (body as { items: unknown[] }).items
        : toList(json, ['items', 'orders']);
    return (list as unknown[]).map(normalizeOrder);
  },
  get: async (id: string) => normalizeOrder(unwrap(await request(`/admin/orders/${id}`))),
  updateStatus: async (id: string, status: OrderStatus, paymentStatus?: string) =>
    normalizeOrder(
      unwrap(
        await request(`/admin/orders/${id}/status`, {
          method: 'PATCH',
          body: { orderStatus: status, paymentStatus },
        }),
      ),
    ),
};

export const adminApi = {
  /**
   * GET /admin/dashboard. If the endpoint is not available yet (404/501) the stats
   * are derived from the orders + products lists so the screen stays useful.
   */
  dashboard: async (): Promise<DashboardStats> => {
    try {
      return normalizeDashboard(await request('/admin/dashboard'));
    } catch (e) {
      if (!(e instanceof ApiError) || (e.status !== 404 && e.status !== 501)) throw e;
      const [orders, products] = await Promise.all([ordersApi.all(), productsApi.list()]);
      const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;
      const sorted = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return {
        totalOrders: orders.length,
        pendingOrders: count('PENDING'),
        confirmedOrders: count('CONFIRMED'),
        preparingOrders: count('PREPARING'),
        completedOrders: count('DELIVERED'),
        menuItemCount: products.length,
        recentOrders: sorted.slice(0, 5),
        totalRevenue: orders.reduce((sum, o) => sum + (o.status === 'CANCELLED' ? 0 : o.total), 0),
        totalCustomers: new Set(orders.map((o) => o.userId).filter(Boolean)).size,
        activeCustomers: new Set(orders.map((o) => o.userId).filter(Boolean)).size,
        performance: [],
      };
    }
  },
};

export const configApi = {
  get: async (): Promise<AppConfig> => normalizeConfig(await request('/config')),
};

export const uploadApi = {
  /** Uploads an image (multipart, field name `file`) and returns its URL. */
  image: async (file: UploadFile): Promise<string> => {
    const name = file.name || file.uri.split('/').pop() || 'upload.jpg';
    const type = file.mimeType || 'image/jpeg';
    const form = new FormData();
    if (typeof document !== 'undefined') {
      // Web: fetch the blob from the picker URI.
      const blob = await (await fetch(file.uri)).blob();
      form.append('file', blob, name);
    } else {
      // React Native's FormData accepts { uri, name, type } descriptors.
      form.append('file', { uri: file.uri, name, type } as unknown as Blob);
    }
    const json = await request('/products/upload', { method: 'POST', formData: form });
    const body = (unwrap(json) ?? {}) as Record<string, unknown>;
    // Return the value as stored by the API (possibly relative); display code resolves it.
    const url = [body.url, body.imageUrl, body.path, body.location].find(
      (v): v is string => typeof v === 'string' && v.length > 0,
    );
    if (!url) throw new ApiError('Upload succeeded but no image URL was returned.', 500, json);
    return url;
  },
};

export const api = {
  auth: authApi,
  users: usersApi,
  categories: categoriesApi,
  products: productsApi,
  orders: ordersApi,
  admin: adminApi,
  config: configApi,
  upload: uploadApi,
};

export { API_URL };
