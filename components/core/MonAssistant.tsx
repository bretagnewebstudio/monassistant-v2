'use client'
import { useState, useEffect } from 'react'
import ModuleManager from '@/components/ModuleManager'
import LoginModal from '@/components/LoginModal'

export default function MonAssistant({ clientConfig }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [config, setConfig] = useState(null)

  useEffect(() => {
    if (clientConfig) {
      setConfig(clientConfig)
    } else {
      // Si pas de config passée, détecter depuis l'URL
      loadConfigFromURL()
    }
  }, [clientConfig])

  const loadConfigFromURL = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const site = urlParams.get('site') || 'demo'
    
    try {
      const response = await fetch(`/api/clients?site=${site}`)
      const clientData = await response.json()
      setConfig(clientData)
    } catch (error) {
      console.error('Erreur chargement config:', error)
      // Configuration par défaut
      setConfig({
        businessName: 'Site Demo',
        sector: 'garage',
        enabledModules: ['vehicules', 'services'],
        credentials: { username: 'test', password: 'test' }
      })
    }
  }

  if (!config) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement de la configuration...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50">
        <LoginModal 
          config={config}
          onAuthenticated={() => setIsAuthenticated(true)}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      <ModuleManager 
        config={config}
        onConfigUpdate={setConfig}
      />
    </div>
  )
}
