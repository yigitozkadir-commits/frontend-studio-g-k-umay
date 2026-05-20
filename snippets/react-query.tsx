/**
 * react-query.tsx — v4
 *
 * TanStack Query best-practice pattern: typed query + mutation + optimistic update.
 */
'use client';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// ---- Provider ----
export function QueryProvider({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

// ---- Typed query hook ----
export interface Todo { id: string; title: string; done: boolean; }

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async (): Promise<Todo[]> => {
      const r = await fetch('/api/todos'); if (!r.ok) throw new Error('failed');
      return r.json();
    },
  });
}

// ---- Optimistic mutation ----
export function useToggleTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/todos/${id}/toggle`, { method: 'POST' });
      if (!r.ok) throw new Error('failed');
      return r.json();
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['todos'] });
      const prev = qc.getQueryData<Todo[]>(['todos']);
      qc.setQueryData<Todo[]>(['todos'], (old) => old?.map((t) => t.id === id ? { ...t, done: !t.done } : t));
      return { prev };
    },
    onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(['todos'], ctx.prev); },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['todos'] }); },
  });
}
