export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function apiGet<T>(path: string, params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  const res = await fetch(`${API_BASE}${path}${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, body?: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export type Product = { _id: string; name: string; image?: string; category?: string; price: number };
export type CartItemInput = { productId: string; quantity: number };
export type CartResponse = { userId: string; items: { product: Product; quantity: number }[] };

export function fetchProducts(params: { category?: string; search?: string }) {
  return apiGet<{ products: Product[]; categories: string[] }>('/api/products', params as any);
}

console.log("fetchProducts",fetchProducts);


export function fetchCart(userId: string) {
  return apiGet<CartResponse>('/api/cart', { userId });
}

export function syncCart(userId: string, items: CartItemInput[]) {
  return apiPost<CartResponse>('/api/cart/sync', { userId, items });
}

export type AppointmentResponse = {
  id: string;
  invoiceNumber: string;
  serviceTotal: number;
  productTotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  finalTotal: number;
  items: { product: Product; quantity: number; unitPrice: number; total: number }[];
};

export function createAppointment(body: { userId: string; items: CartItemInput[]; serviceTotal: number; discount: number }) {
  return apiPost<AppointmentResponse>('/api/appointments', body);
}

export function previewAppointment(body: { items: CartItemInput[]; serviceTotal: number; discount: number }) {
  return apiPost<AppointmentResponse>('/api/appointments/preview', body);
}
