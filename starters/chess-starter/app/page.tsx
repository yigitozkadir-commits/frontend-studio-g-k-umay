'use client'

import dynamic from 'next/dynamic'

const Game = dynamic(() => import('@/components/Game').then(mod => ({ default: mod.Game })), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            ♟️ Satranç Oyunu
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Timurlenko Satranç UI - Canlı 2 Oyunculu Oyun
          </p>
        </div>
        
        <Game />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">♙ Kurallar</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Standart satranç kuralları geçerlidir. Beyaz taş başlar.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">♖ Taşlar</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Piyon, At, Fil, Kale, Vezir ve Kral hamle ettirin.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">🎯 Hedef</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Rakibin Kralını Şah Matt (Checkmate) yapın!
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
