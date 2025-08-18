'use client'
import { useEffect } from 'react'
import MonAssistant from '@/components/core/MonAssistant'

export default function EmbedPage() {
  useEffect(() => {
    // Communiquer avec le parent pour fermer
    const handleClose = () => {
      window.parent.postMessage('close-monassistant', '*')
    }
    
    // Ajouter un bouton de fermeture global
    window.addEventListener('close-assistant', handleClose)
    
    return () => {
      window.removeEventListener('close-assistant', handleClose)
    }
  }, [])
  
  return (
    <div className="w-full h-screen">
      <MonAssistant />
    </div>
  )
}
