'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const MonAssistant = dynamic(() => import('@/components/core/MonAssistant'), {
  ssr: false
})

export default function Home() {
  const [showAssistant, setShowAssistant] = useState(false)
  
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">MonAssistant Pro V2</h1>
          <p className="text-xl mb-8">Système modulaire universel</p>
          <button 
            onClick={() => setShowAssistant(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all text-lg"
          >
            🚀 Démarrer MonAssistant
          </button>
        </div>
      </main>
      
      {showAssistant && <MonAssistant />}
    </>
  )
}
