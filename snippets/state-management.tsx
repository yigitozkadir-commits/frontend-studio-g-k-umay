// ============================================================
// AI Frontend Studio — Snippet Kütüphanesi
// Araç: pmndrs/zustand (id: 35) + TanStack/query (id: 36)
// ============================================================
"use client";

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ----------------------------------------------------------
// 1. ZUSTAND — GENEL UI STORE ŞABLONU
// ----------------------------------------------------------
interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: UIState["theme"]) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        theme: "system",
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
        setTheme: (theme) => set({ theme }),
      }),
      { name: "ui-store" }
    )
  )
);

// ----------------------------------------------------------
// 2. ZUSTAND — SEPETLİ E-TİCARET STORE
// ----------------------------------------------------------
interface CartItem { id: string; name: string; price: number; qty: number; }

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const exists = s.items.find((i) => i.id === item.id);
          if (exists) return { items: s.items.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) };
          return { items: [...s.items, { ...item, qty: 1 }] };
        }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, qty } : i) })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((acc, i) => acc + i.price * i.qty, 0),
    }),
    { name: "cart" }
  )
);

// ----------------------------------------------------------
// 3. TANSTACK QUERY — PROVIDER ŞABLONU
// ----------------------------------------------------------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 2, refetchOnWindowFocus: false },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

// ----------------------------------------------------------
// 4. TANSTACK QUERY — GENERIC CRUD HOOK'LARI
// ----------------------------------------------------------
export function useList<T>(key: string, fetcher: () => Promise<T[]>) {
  return useQuery({ queryKey: [key], queryFn: fetcher });
}

export function useCreate<T>(key: string, creator: (data: T) => Promise<T>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: creator,
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

export function useDelete(key: string, deleter: (id: string) => Promise<void>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleter,
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}
