'use client';
import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <main className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-xl font-semibold mb-4">AI Chat</h1>
      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              <p className="text-xs font-semibold mb-1">{m.role}</p>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Mesaj yaz…"
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <button type="submit" disabled={isLoading} className="px-3 py-2 bg-black text-white rounded-md disabled:opacity-50">
          <Send size={16} />
        </button>
      </form>
    </main>
  );
}
