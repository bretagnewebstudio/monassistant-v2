'use client'
import { useState, useEffect } from 'react'

export default function ModuleManager({ config, onConfigUpdate }) {
  const [availableModules, setAvailableModules] = useState([])
  const [currentModule, setCurrentModule] = useState('dashboard')
  const [configMode, setConfigMode] = useState(false)

  useEffect(() => {
    loadAvailableModules()
  }, [config])

  const loadAvailableModules = async () => {
    try {
      const response = await fetch(`/api/modules?sector=${config.sector}`)
      const data = await response.json()
      setAvailableModules(data.modules || [])
    } catch (error) {
      console.error('Erreur chargement modules:', error)
    }
  }

  const addModule = async (moduleName) => {
    const newModules = [...config.enabledModules, moduleName]
    await updateClientConfig({ enabledModules: newModules })
  }

  const removeModule = async (moduleName) => {
    const newModules = config.enabledModules.filter(m => m !== moduleName)
    await updateClientConfig({ enabledModules: newModules })
    
    if (currentModule === moduleName) {
      setCurrentModule('dashboard')
    }
  }

  const updateClientConfig = async (updates) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          site: window.location.search.split('site=')[1]?.split('&')[0] || 'demo',
          updates 
        })
      })
      
      if (response.ok) {
        const newConfig = { ...config, ...updates }
        onConfigUpdate(newConfig)
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error)
    }
  }

  return (
    <div className="module-manager">
      {/* Header */}
      <div className="manager-header">
        <h1>{config.businessName}</h1>
        <div className="header-actions">
          <button 
            className={`config-btn ${configMode ? 'active' : ''}`}
            onClick={() => setConfigMode(!configMode)}
          >
            ⚙️ Configurer Modules
          </button>
        </div>
      </div>

      <div className="manager-body">
        {/* Sidebar Navigation */}
        <div className="sidebar">
          {configMode ? (
            // Mode Configuration
            <div className="config-panel">
              <h3>Configuration des Modules</h3>
              
              <div className="modules-active">
                <h4>Modules Actifs ({config.enabledModules.length})</h4>
                {config.enabledModules.map(moduleName => {
                  const moduleInfo = availableModules.find(m => m.name === moduleName)
                  return (
                    <div key={moduleName} className="module-item active">
                      <span className="module-icon">{moduleInfo?.icon || '📋'}</span>
                      <span className="module-name">{moduleName}</span>
                      <button 
                        className="remove-btn"
                        onClick={() => removeModule(moduleName)}
                        title="Supprimer ce module"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="modules-available">
                <h4>Modules Disponibles</h4>
                {availableModules
                  .filter(m => !config.enabledModules.includes(m.name))
                  .map(module => (
                    <div key={module.name} className="module-item available">
                      <span className="module-icon">{module.icon}</span>
                      <div className="module-info">
                        <span className="module-name">{module.name}</span>
                        <span className="module-desc">{module.description}</span>
                      </div>
                      <button 
                        className="add-btn"
                        onClick={() => addModule(module.name)}
                        title="Ajouter ce module"
                      >
                        +
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            // Mode Navigation normale
            <div className="navigation">
              <div 
                className={`nav-item ${currentModule === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentModule('dashboard')}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Tableau de bord</span>
              </div>
              
              {config.enabledModules.map(moduleName => {
                const moduleInfo = availableModules.find(m => m.name === moduleName)
                return (
                  <div 
                    key={moduleName}
                    className={`nav-item ${currentModule === moduleName ? 'active' : ''}`}
                    onClick={() => setCurrentModule(moduleName)}
                  >
                    <span className="nav-icon">{moduleInfo?.icon || '📋'}</span>
                    <span className="nav-text">{moduleName}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Contenu Principal */}
        <div className="main-content">
          {currentModule === 'dashboard' && (
            <DashboardContent config={config} />
          )}
          
          {currentModule !== 'dashboard' && (
            <ModuleContent moduleName={currentModule} config={config} />
          )}
        </div>
      </div>
    </div>
  )
}

// Composant Dashboard
function DashboardContent({ config }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Tableau de bord</h2>
        <p>Interface {config.sector} - {config.enabledModules.length} modules actifs</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-number">{config.enabledModules.length}</div>
            <div className="stat-label">Modules</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-number">{config.plan}</div>
            <div className="stat-label">Plan</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Modules Actifs</h3>
        <div className="modules-grid">
          {config.enabledModules.map(moduleName => (
            <div key={moduleName} className="module-card">
              <div className="module-icon">📋</div>
              <div className="module-name">{moduleName}</div>
              <button onClick={() => window.moduleManager?.setCurrentModule(moduleName)}>
                Ouvrir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Composant pour afficher le contenu d'un module
function ModuleContent({ moduleName, config }) {
  return (
    <div className="module-content">
      <div className="module-header">
        <h2>Module : {moduleName}</h2>
        <p>Configuration {config.sector}</p>
      </div>
      
      <div className="module-body">
        <div className="module-placeholder">
          <h3>Module {moduleName}</h3>
          <p>Interface du module {moduleName} pour {config.businessName}</p>
          <p>Secteur : {config.sector}</p>
          
          {/* Contenu spécifique selon le module */}
          {moduleName === 'produits' && config.sector === 'collection-pokemon' && (
            <div className="pokemon-products">
              <h4>Gestion Produits Pokemon</h4>
              <button className="btn-primary">+ Ajouter une carte</button>
              <button className="btn-primary">+ Ajouter une figurine</button>
              <div className="products-list">
                <p>Liste des produits Pokemon ici...</p>
              </div>
            </div>
          )}
          
          {moduleName === 'vehicules' && config.sector === 'garage' && (
            <div className="garage-vehicles">
              <h4>Gestion Véhicules</h4>
              <button className="btn-primary">+ Nouveau véhicule</button>
              <div className="vehicles-list">
                <p>Liste des véhicules ici...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
