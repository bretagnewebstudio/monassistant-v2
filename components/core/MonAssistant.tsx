'use client'
import { useState, useEffect } from 'react'
import { moduleRegistry } from '@/lib/moduleRegistry'
import DashboardModule from '@/components/modules/DashboardModule'
import VehiculeModule from '@/components/modules/VehiculeModule'
import ServiceModule from '@/components/modules/ServiceModule'
import ActualitesModule from '@/components/modules/ActualitesModule'
import AvisModule from '@/components/modules/AvisModule'
import SocialModule from '@/components/modules/SocialModule'

export default function MonAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeModule, setActiveModule] = useState('dashboard')
  
  // Enregistrer les modules
  useEffect(() => {
    moduleRegistry.register({
      id: 'dashboard',
      name: 'Tableau de Bord',
      icon: '📊',
      component: DashboardModule,
      enabled: true
    })
    
    moduleRegistry.register({
      id: 'vehicules',
      name: 'Véhicules',
      icon: '🚗',
      component: VehiculeModule,
      enabled: true
    })
    
    moduleRegistry.register({
      id: 'services',
      name: 'Services',
      icon: '🔧',
      component: ServiceModule,
      enabled: true
    })
    
    moduleRegistry.register({
      id: 'actualites',
      name: 'Actualités',
      icon: '📰',
      component: ActualitesModule,
      enabled: true
    })

    moduleRegistry.register({
      id: 'avis',
      name: 'Avis',
      icon: '⭐',
      component: AvisModule,
      enabled: true
    })

    moduleRegistry.register({
      id: 'social',
      name: 'Réseaux',
      icon: '📱',
      component: SocialModule,
      enabled: true
    })
  }, [])
  
  const modules = moduleRegistry.getAll()
  const ActiveComponent = moduleRegistry.get(activeModule)?.component || DashboardModule
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 z-50"
      >
        💬 MonAssistant Pro
      </button>
    )
  }
  
  return (
    <div className="fixed inset-0 bg-white z-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">MonAssistant Pro</h2>
        </div>
        
        <nav className="p-4">
          {modules.map(module => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all flex items-center gap-3 ${
                activeModule === module.id 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{module.icon}</span>
              <span>{module.name}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => {
              setIsOpen(false)
              window.dispatchEvent(new Event('close-assistant'))
            }}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            ✕ Fermer
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <ActiveComponent />
      </div>
    </div>
  )
}
