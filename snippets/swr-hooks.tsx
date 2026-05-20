/**
 * SWR — Hafif, cache-first fetch hook'ları.
 */
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useResource<T>(url: string | null) {
  return useSWR<T>(url, fetcher, { revalidateOnFocus: false });
}

export async function patchResource<T>(url: string, body: Partial<T>) {
  await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  await mutate(url);
}
