'use client'
import { useState } from 'react'

interface Actualite {
  id: number
  titre: string
  contenu: string
  image: string
  date: string
  categorie: 'Promotion' | 'Nouveauté' | 'Info' | 'Événement'
  publie: boolean
}

export default function ActualitesModule() {
  const [actualites, setActualites] = useState<Actualite[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    image: '',
    categorie: 'Info' as const,
    publie: true
  })

  const handleSubmit = () => {
    const newActu: Actualite = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString('fr-FR')
    }
    setActualites([newActu, ...actualites])
    setShowAddModal(false)
    setFormData({ titre: '', contenu: '', image: '', categorie: 'Info', publie: true })
  }

  const getCategorieColor = (cat: string) => {
    switch(cat) {
      case 'Promotion': return 'bg-red-100 text-red-800'
      case 'Nouveauté': return 'bg-green-100 text-green-800'
      case 'Info': return 'bg-blue-100 text-blue-800'
      case 'Événement': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">📰 Actualités & Promotions</h2>
          <p className="text-gray-600 text-sm mt-1">{actualites.filter(a => a.publie).length} actualité(s) publiée(s)</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nouvelle actualité
        </button>
      </div>

      {actualites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📰</div>
          <p className="text-gray-500">Aucune actualité</p>
          <p className="text-sm text-gray-400 mt-2">Créez votre première actualité pour informer vos clients</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {actualites.map(actu => (
            <div key={actu.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex">
                {actu.image && (
                  <img src={actu.image} alt={actu.titre} className="w-48 h-32 object-cover" />
                )}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{actu.titre}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategorieColor(actu.categorie)}`}>
                          {actu.categorie}
                        </span>
                        <span className="text-gray-500 text-sm">{actu.date}</span>
                        {!actu.publie && <span className="text-orange-600 text-sm">⏸ Brouillon</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setActualites(actualites.map(a => 
                          a.id === actu.id ? {...a, publie: !a.publie} : a
                        ))}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {actu.publie ? 'Dépublier' : 'Publier'}
                      </button>
                      <button 
                        onClick={() => setActualites(actualites.filter(a => a.id !== actu.id))}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{actu.contenu.substring(0, 150)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">📰 Nouvelle actualité</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <input 
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                    placeholder="Ex: Promotion de printemps -20% !"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <select 
                    value={formData.categorie}
                    onChange={(e) => setFormData({...formData, categorie: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Info">ℹ️ Information</option>
                    <option value="Promotion">🏷️ Promotion</option>
                    <option value="Nouveauté">✨ Nouveauté</option>
                    <option value="Événement">🎉 Événement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image (URL)</label>
                  <input 
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contenu *</label>
                  <textarea 
                    value={formData.contenu}
                    onChange={(e) => setFormData({...formData, contenu: e.target.value})}
                    rows={6}
                    placeholder="Décrivez votre actualité..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={formData.publie}
                    onChange={(e) => setFormData({...formData, publie: e.target.checked})}
                    id="publier"
                    className="rounded"
                  />
                  <label htmlFor="publier" className="text-sm">Publier immédiatement</label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Créer l'actualité
                </button>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
