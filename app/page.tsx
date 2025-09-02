'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ModuleManager = dynamic(() => import('@/components/ModuleManager'), { ssr: false })
const LoginModal = dynamic(() => import('@/components/LoginModal'), { ssr: false })

export default function Home() {
  const [clientConfig, setClientConfig] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentModule, setCurrentModule] = useState('dashboard')
  const [availableModules, setAvailableModules] = useState([])

  useEffect(() => {
    // Détection automatique du site appelant
    const urlParams = new URLSearchParams(window.location.search)
    const site = urlParams.get('site') || extractSiteFromReferrer()
    const admin = urlParams.get('admin') === 'true'
    
    const config = getClientConfiguration(site)
    setClientConfig(config)
    loadAvailableModules(config.sector)
    
    // Si mode admin direct (depuis triple-clic)
    if (admin) {
      setCurrentModule('module-manager')
    }
  }, [])

  const extractSiteFromReferrer = () => {
    try {
      if (document.referrer) {
        const url = new URL(document.referrer)
        return url.hostname
      }
    } catch (e) {
      console.log('No referrer detected')
    }
    return 'demo'
  }

  const loadAvailableModules = async (sector) => {
    const modules = await fetch(`/api/modules?sector=${sector}`)
    const data = await modules.json()
    setAvailableModules(data.modules || [])
  }

  if (!clientConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Chargement de la configuration...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <LoginModal 
        config={clientConfig}
        onAuthenticated={() => setIsAuthenticated(true)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleManager 
        config={clientConfig}
        currentModule={currentModule}
        onModuleChange={setCurrentModule}
        availableModules={availableModules}
        onConfigUpdate={(newConfig) => setClientConfig(newConfig)}
      />
    </div>
  )
}

// Configuration des clients avec modules personnalisables
function getClientConfiguration(site) {
  const CLIENT_CONFIGS = {
    'johanna-pokemon-site.web.app': {
      id: 'johanna-pokemon',
      businessName: 'Johanna PokéCollection',
      sector: 'collection-pokemon',
      plan: 'standard',
      enabledModules: ['produits', 'avis-vinted', 'actualites', 'contact'],
      credentials: { username: 'johanna', password: 'pokemon2025' },
      customization: {
        primaryColor: '#ef4444',
        logo: '/images/pokemon-logo.png',
        theme: 'pokemon'
      },
      features: ['vinted-sync', 'collection-tracker', 'price-monitor']
    },
    
    'garage-martin.web.app': {
      id: 'garage-martin',
      businessName: 'Garage Martin',
      sector: 'garage',
      plan: 'basic',
      enabledModules: ['vehicules', 'services', 'rdv', 'avis-clients'],
      credentials: { username: 'martin', password: 'garage2025' },
      customization: {
        primaryColor: '#1e40af',
        logo: '/images/garage-logo.png',
        theme: 'automotive'
      },
      features: ['appointment-booking', 'invoice-generation']
    },

    'demo': {
      id: 'demo',
      businessName: 'Site Démo',
      sector: 'generic',
      plan: 'demo',
      enabledModules: ['dashboard', 'contact'],
      credentials: { username: 'test', password: 'test' },
      customization: {
        primaryColor: '#6b7280',
        theme: 'default'
      },
      features: []
    }
  }

  return CLIENT_CONFIGS[site] || CLIENT_CONFIGS['demo']
}
