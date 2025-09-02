'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const MonAssistant = dynamic(() => import('@/components/core/MonAssistant'), {
  ssr: false
})

export default function EmbedPage() {
  const [clientConfig, setClientConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeEmbedConfig()
  }, [])

  const initializeEmbedConfig = async () => {
    try {
      // Détecter le site depuis l'URL ou le referrer
      const urlParams = new URLSearchParams(window.location.search)
      const site = urlParams.get('site') || extractSiteFromReferrer()
      
      // Charger la configuration depuis l'API
      let config
      try {
        const response = await fetch(`/api/clients?site=${site}`)
        if (response.ok) {
          config = await response.json()
        } else {
          config = getDefaultConfiguration(site)
        }
      } catch (error) {
        console.error('Erreur API clients:', error)
        config = getDefaultConfiguration(site)
      }
      
      setClientConfig(config)
    } catch (error) {
      console.error('Erreur initialisation embed:', error)
      setClientConfig(getDefaultConfiguration('demo'))
    } finally {
      setLoading(false)
    }
  }

  const extractSiteFromReferrer = () => {
    try {
      if (typeof window !== 'undefined' && document.referrer) {
        const url = new URL(document.referrer)
        return url.hostname
      }
    } catch (e) {
      console.log('No referrer detected')
    }
    return 'demo'
  }

  const getDefaultConfiguration = (site) => {
    const DEFAULT_CONFIGS = {
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
        features: ['vinted-sync', 'collection-tracker']
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
        features: ['appointment-booking']
      },

      'demo': {
        id: 'demo',
        businessName: 'Site Démo',
        sector: 'garage',
        plan: 'demo',
        enabledModules: ['vehicules', 'services'],
        credentials: { username: 'test', password: 'test' },
        customization: {
          primaryColor: '#6b7280',
          theme: 'default'
        },
        features: []
      }
    }
    
    return DEFAULT_CONFIGS[site] || DEFAULT_CONFIGS['demo']
  }

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Initialisation MonAssistant Pro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen">
      <MonAssistant clientConfig={clientConfig} />
    </div>
  )
}
