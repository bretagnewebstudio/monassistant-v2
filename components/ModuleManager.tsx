'use client'
import { useState, useEffect } from 'react'

interface ModuleManagerProps {
  config: any
  currentModule: string
  onModuleChange: (module: string) => void
  availableModules: any[]
  onConfigUpdate: (config: any) => void
}

export default function ModuleManager({ 
  config, 
  currentModule, 
  onModuleChange, 
  availableModules,
  onConfigUpdate 
}: ModuleManagerProps) {
  const [modules, setModules] = useState({})
  const [isConfigMode, setIsConfigMode] = useState(false)

  useEffect(() => {
    loadModules()
  }, [config.enabledModules])

  const loadModules = async () => {
    const loadedModules = {}
    
    for (const moduleName of config.enabledModules) {
      try {
        const ModuleComponent = await import(`../modules/${config.sector}/${moduleName}`)
        loadedModules[moduleName] = ModuleComponent.default
      } catch (error) {
        console.warn(`Module ${moduleName} not found, using generic`)
        const GenericModule = await import('../modules/generic/default')
        loadedModules[moduleName] = GenericModule.default
      }
    }
    
    setModules(loadedModules)
  }

  const addModule = async (moduleName) => {
    const newModules = [...config.enabledModules, moduleName]
    const newConfig = { ...config, enabledModules: newModules }
    
    // Sauvegarder la nouvelle configuration
    await saveClientConfig(config.id, newConfig)
    onConfigUpdate(newConfig)
  }

  const removeModule = async (moduleName) => {
    const newModules = config.enabledModules.filter(m => m !== moduleName)
    const newConfig = { ...config, enabledModules: newModules }
    
    await saveClientConfig(config.id, newConfig)
    onConfigUpdate(newConfig)
    
    // Si on supprime le module actuel, revenir au dashboard
    if (currentModule === moduleName) {
      onModuleChange('dashboard')
    }
  }

  const getModuleIcon = (moduleName) => {
    const icons = {
      dashboard: '📊',
      vehicules: '🚗',
      services: '🔧',
      rdv: '📅',
      produits: '🎴',
      'avis-vinted': '⭐',
      actualites: '📰',
      contact: '💬',
      menu: '🍽️',
      reservations: '📅',
      commandes: '🛒'
    }
    return icons[moduleName] || '📋'
  }

  return (
    <div className="admin-interface">
      {/* Header avec infos client */}
      <div className="admin-header" style={{ backgroundColor: config.customization.primaryColor }}>
        <div className="header-content">
          <h1>{config.businessName}</h1>
          <div className="header-badges">
            <span className="sector-badge">{config.sector}</span>
            <span className="plan-badge">{config.plan}</span>
            <span className="modules-count">{config.enabledModules.length} modules</span>
          </div>
          <div className="header-actions">
            <button 
              className={`config-toggle ${isConfigMode ? 'active' : ''}`}
              onClick={() => setIsConfigMode(!isConfigMode)}
            >
              ⚙️ Configuration
            </button>
          </div>
        </div>
      </div>

      <div className="admin-body">
        {/* Sidebar avec navigation modules */}
        <div className="admin-sidebar">
          {isConfigMode && (
            <div className="config-panel">
              <h3>Gestion des Modules</h3>
              
              <div className="modules-section">
                <h4>Modules Actifs ({config.enabledModules.length})</h4>
                <div className="active-modules">
                  {config.enabledModules.map(moduleName => (
                    <div key={moduleName} className="module-item active">
                      <span className="module-icon">{getModuleIcon(moduleName)}</span>
                      <span className="module-name">{moduleName}</span>
                      <button 
                        className="module-remove"
                        onClick={() => removeModule(moduleName)}
                        title="Supprimer ce module"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modules-section">
                <h4>Modules Disponibles</h4>
                <div className="available-modules">
                  {availableModules
                    .filter(m => !config.enabledModules.includes(m.name))
                    .map(module => (
                    <div key={module.name} className="module-item available">
                      <span className="module-icon">{getModuleIcon(module.name)}</span>
                      <span className="module-name">{module.name}</span>
                      <span className="module-description">{module.description}</span>
                      <button 
                        className="module-add"
                        onClick={() => addModule(module.name)}
                        title="Ajouter ce module"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isConfigMode && (
            <div className="navigation">
              <div 
                className={`nav-item ${currentModule === 'dashboard' ? 'active' : ''}`}
                onClick={() => onModuleChange('dashboard')}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Tableau de bord</span>
              </div>
              
              {config.enabledModules.map(moduleName => (
                <div 
                  key={moduleName}
                  className={`nav-item ${currentModule === moduleName ? 'active' : ''}`}
                  onClick={() => onModuleChange(moduleName)}
                >
                  <span className="nav-icon">{getModuleIcon(moduleName)}</span>
                  <span className="nav-text">{moduleName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="admin-main">
          {currentModule === 'dashboard' && (
            <DashboardModule config={config} modules={modules} />
          )}
          
          {currentModule !== 'dashboard' && modules[currentModule] && (
            <div className="module-content">
              {React.createElement(modules[currentModule], { config })}
            </div>
          )}
          
          {currentModule !== 'dashboard' && !modules[currentModule] && (
            <div className="module-placeholder">
              <h2>Module {currentModule} en cours de chargement...</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Composant Dashboard universel
function DashboardModule({ config, modules }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Tableau de bord - {config.businessName}</h2>
        <p>Interface d'administration {config.sector}</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{Object.keys(modules).length}</div>
            <div className="stat-label">Modules actifs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{config.plan}</div>
            <div className="stat-label">Plan actuel</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <div className="stat-number">{config.features.length}</div>
            <div className="stat-label">Fonctionnalités</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Actions Rapides</h3>
        <div className="actions-grid">
          {config.enabledModules.map(moduleName => (
            <button 
              key={moduleName}
              className="quick-action"
              onClick={() => window.parent.postMessage({ action: 'switchModule', module: moduleName }, '*')}
            >
              <span className="action-icon">{getModuleIcon(moduleName)}</span>
              <span className="action-text">Gérer {moduleName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Fonction de sauvegarde configuration
async function saveClientConfig(clientId, newConfig) {
  try {
    const response = await fetch('/api/clients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, config: newConfig })
    })
    return await response.json()
  } catch (error) {
    console.error('Erreur sauvegarde configuration:', error)
    throw error
  }
}
