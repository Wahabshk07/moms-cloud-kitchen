import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DEFAULT_DELIVERY_FEE } from '@/constants';
import { api } from '@/services/api';
import type {
  CategoryPayload,
  CreateOrderPayload,
  OrderStatus,
  ProductPayload,
  ProductQuery,
  UpdateProfilePayload,
} from '@/types';

export const queryKeys = {
  products: (q?: ProductQuery) => ['products', q ?? {}] as const,
  product: (id: string) => ['product', id] as const,
  categories: ['categories'] as const,
  myOrders: ['orders', 'mine'] as const,
  allOrders: (status?: OrderStatus | null) => ['orders', 'all', status ?? 'ALL'] as const,
  order: (id: string) => ['order', id] as const,
  dashboard: ['admin', 'dashboard'] as const,
  config: ['config'] as const,
};

/* ---------- Catalogue ---------- */

export function useProducts(query: ProductQuery = {}) {
  return useQuery({
    queryKey: queryKeys.products(query),
    queryFn: () => (query.admin ? api.products.listAdmin(query) : api.products.list(query)),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.product(id ?? ''),
    queryFn: () => api.products.get(id as string),
    enabled: !!id,
  });
}

export function useCategories(admin = false) {
  return useQuery({
    queryKey: [...queryKeys.categories, admin ? 'admin' : 'public'] as const,
    queryFn: () => (admin ? api.categories.listAdmin() : api.categories.list()),
  });
}

/** Delivery fee from the API config, falling back to the constant (50). */
export function useDeliveryFee() {
  const query = useQuery({
    queryKey: queryKeys.config,
    queryFn: api.config.get,
    staleTime: 5 * 60_000,
    retry: false,
  });
  return {
    deliveryFee: query.data?.deliveryFee ?? DEFAULT_DELIVERY_FEE,
    isFromApi: !!query.data,
  };
}

/* ---------- Orders ---------- */

export function useMyOrders() {
  return useQuery({ queryKey: queryKeys.myOrders, queryFn: api.orders.mine });
}

export function useMyOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', 'mine', id ?? ''] as const,
    queryFn: () => api.orders.getMine(id as string),
    enabled: !!id,
  });
}

export function useAllOrders(status?: OrderStatus | null) {
  return useQuery({ queryKey: queryKeys.allOrders(status), queryFn: () => api.orders.all(status) });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.order(id ?? ''),
    queryFn: () => api.orders.get(id as string),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => api.orders.create(payload),
    onSuccess: (order) => {
      qc.setQueryData(queryKeys.order(order.id), order);
      void qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: OrderStatus) => api.orders.updateStatus(id, status),
    onSuccess: (order) => {
      qc.setQueryData(queryKeys.order(id), order);
      void qc.invalidateQueries({ queryKey: ['orders'] });
      void qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

/* ---------- Profile ---------- */

export function useUpdateProfile() {
  return useMutation({ mutationFn: (payload: UpdateProfilePayload) => api.users.updateMe(payload) });
}

/* ---------- Admin ---------- */

export function useDashboard() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: api.admin.dashboard });
}

export function useSaveProduct(id?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) =>
      id ? api.products.update(id, payload) : api.products.create(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['products'] });
      if (id) void qc.invalidateQueries({ queryKey: queryKeys.product(id) });
      void qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.products.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['products'] });
      void qc.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useToggleAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      api.products.update(id, { isAvailable }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useSaveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: CategoryPayload }) =>
      id ? api.categories.update(id, payload) : api.categories.create(payload),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.categories }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.categories.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.categories });
      void qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
