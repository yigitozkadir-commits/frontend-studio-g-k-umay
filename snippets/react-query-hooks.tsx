/**
 * TanStack Query — Tipli fetch hook'ları.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useResource<T>(key: string, url: string) {
  return useQuery<T>({
    queryKey: [key],
    queryFn: async () => {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return r.json();
    },
    staleTime: 30_000
  });
}

export function useCreateResource<TIn, TOut>(key: string, url: string) {
  const qc = useQueryClient();
  return useMutation<TOut, Error, TIn>({
    mutationFn: async (input) => {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!r.ok) throw new Error(`${r.status}`);
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] })
  });
}
