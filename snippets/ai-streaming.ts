/**
 * ai-streaming.ts — v4
 *
 * Vercel AI SDK ile App Router streaming endpoint + client tarafı useChat
 * best-practice: rate-limit, abort signal, hata yakalama.
 */

// ============================================================================
// app/api/chat/route.ts
// ============================================================================
/*
import { StreamingTextResponse, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { ratelimit } from '@/lib/ratelimit';

export const runtime = 'edge';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const { success } = await ratelimit.limit(ip);
  if (!success) return new Response('Too many requests', { status: 429 });

  const { messages } = await req.json();
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    temperature: 0.7,
    abortSignal: req.signal,
  });
  return result.toAIStreamResponse();
}
*/

// ============================================================================
// components/chat.tsx
// ============================================================================
/*
'use client';
import { useChat } from 'ai/react';
import { toast } from 'sonner';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, error } = useChat({
    api: '/api/chat',
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : ''}>
            <span className="inline-block rounded-lg bg-muted px-3 py-2">{m.content}</span>
          </div>
        ))}
        {error && <p className="text-red-600 text-sm">{error.message}</p>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 p-2 border-t">
        <input value={input} onChange={handleInputChange} className="flex-1 rounded border px-3 py-2" />
        {isLoading ? (
          <button type="button" onClick={stop} className="rounded bg-red-500 px-3 py-2 text-white">Dur</button>
        ) : (
          <button type="submit" className="rounded bg-primary px-3 py-2 text-primary-foreground">Gönder</button>
        )}
      </form>
    </div>
  );
}
*/

export const __doc__ = 'Bu dosya örnek snippet olarak verilmiştir. İçeriği projenize kopyalayın.';
