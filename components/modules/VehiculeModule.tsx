'use client'
import { useState, useEffect } from 'react'
import { useVehicles } from '@/lib/hooks/useVehicles'

import { Vehicle } from '@/lib/types'

export default function VehiculeModule() {
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle } = useVehicles()
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState<{
    marque: string
    modele: string
    annee: number
    km: number
    prix: number
    prix_achat: number
    carburant: string
    images: string[]
    description: string
    statut: 'En stock' | 'Réservé' | 'Vendu'
  }>({
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    km: 0,
    prix: 0,
    prix_achat: 0,
    carburant: 'Essence',
    images: [],
    description: '',
    statut: 'En stock'
  })
  const [imageUrl, setImageUrl] = useState('')

  const marques = [
    // Françaises
    'Peugeot', 'Renault', 'Citroën', 'DS', 'Alpine', 'Bugatti',
    // Allemandes
    'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Opel',
    // Italiennes
    'Fiat', 'Alfa Romeo', 'Ferrari', 'Lamborghini', 'Maserati',
    // Japonaises
    'Toyota', 'Honda', 'Nissan', 'Mazda', 'Mitsubishi', 'Suzuki', 'Subaru', 'Lexus',
    // Coréennes
    'Hyundai', 'Kia', 'Genesis',
    // Américaines
    'Ford', 'Chevrolet', 'Tesla', 'Jeep', 'Dodge', 'Cadillac',
    // Autres
    'Volvo', 'Škoda', 'SEAT', 'Mini', 'Land Rover', 'Jaguar', 'Dacia'
  ].sort()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleAddImageUrl = () => {
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }))
      setImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    if (!formData.marque || !formData.modele || !formData.prix) {
      alert('Veuillez remplir au minimum la marque, le modèle et le prix')
      return
    }
    
    try {
      await addVehicle(formData)
      setShowAddModal(false)
      // Reset form
      setFormData({
        marque: '',
        modele: '',
        annee: new Date().getFullYear(),
        km: 0,
        prix: 0,
        prix_achat: 0,
        carburant: 'Essence',
        images: [],
        description: '',
        statut: 'En stock'
      })
      alert('✅ Véhicule ajouté avec succès !')
    } catch (error) {
      alert('❌ Erreur lors de l\'ajout du véhicule')
    }
  }

  const getStatutColor = (statut: string) => {
    switch(statut) {
      case 'En stock': return 'bg-green-100 text-green-800'
      case 'Réservé': return 'bg-yellow-100 text-yellow-800'
      case 'Vendu': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">🚗 Véhicules d'Occasion</h2>
          <p className="text-gray-600 text-sm mt-1">{vehicles.length} véhicule(s) en stock</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Ajouter un véhicule
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-500">Chargement des véhicules...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🚗</div>
          <p className="text-gray-500 text-lg">Aucun véhicule en stock</p>
          <p className="text-sm text-gray-400 mt-2">Cliquez sur "+ Ajouter un véhicule" pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v: Vehicle) => (
            <div key={v.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden">
              {v.images.length > 0 ? (
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={v.images[0]} 
                    alt={`${v.marque} ${v.modele}`}
                    className="w-full h-full object-cover"
                  />
                  {v.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      +{v.images.length - 1} photos
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-6xl">🚗</span>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{v.marque} {v.modele}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatutColor(v.statut)}`}>
                    {v.statut}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p>📅 {v.annee} | 🔢 {v.km.toLocaleString()} km</p>
                  <p>⛽ {v.carburant}</p>
                  {v.description && (
                    <p className="text-xs italic">{v.description.substring(0, 50)}...</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-green-600 text-2xl font-bold">{v.prix.toLocaleString()}€</p>
                  <div className="grid gap-4">
                    <button 
                      onClick={() => updateVehicle(v.id!, { statut: v.statut === 'En stock' ? 'Vendu' : 'En stock' })}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      {v.statut === 'En stock' ? 'Marquer vendu' : 'Remettre en stock'}
                    </button>
                    <button 
                      onClick={() => deleteVehicle(v.id!)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 pb-4">
              <h3 className="text-2xl font-bold">🚗 Ajouter un véhicule</h3>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-2">Photos du véhicule</label>
                
                {/* Upload depuis PC */}
                <div className="mb-3">
                  <input 
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                
                {/* URL d'image */}
                <div className="flex gap-2 mb-3">
                  <input 
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Ou coller une URL d'image..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleAddImageUrl}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Ajouter URL
                  </button>
                </div>
                
                {/* Aperçu des images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt="" className="w-full h-20 object-cover rounded" />
                        <button 
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Marque et Modèle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Marque *</label>
                  <select 
                    value={formData.marque}
                    onChange={(e) => setFormData({...formData, marque: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner...</option>
                    {marques.map(marque => (
                      <option key={marque} value={marque}>{marque}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Modèle *</label>
                  <input 
                    type="text"
                    value={formData.modele}
                    onChange={(e) => setFormData({...formData, modele: e.target.value})}
                    placeholder="Ex: 208, Clio, Golf..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Année et Kilométrage */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Année</label>
                  <input 
                    type="number"
                    value={formData.annee}
                    onChange={(e) => setFormData({...formData, annee: parseInt(e.target.value)})}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Kilométrage</label>
                  <input 
                    type="number"
                    value={formData.km}
                    onChange={(e) => setFormData({...formData, km: parseInt(e.target.value)})}
                    placeholder="50000"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Prix et Carburant */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prix de vente (€) *</label>
                  <input 
                    type="number"
                    value={formData.prix}
                    onChange={(e) => setFormData({...formData, prix: parseInt(e.target.value)})}
                    placeholder="15000"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Carburant</label>
                  <select 
                    value={formData.carburant}
                    onChange={(e) => setFormData({...formData, carburant: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Essence</option>
                    <option>Diesel</option>
                    <option>Hybride</option>
                    <option>Électrique</option>
                    <option>GPL</option>
                    <option>E85</option>
                  </select>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Options, état, historique..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Statut */}
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select 
                  value={formData.statut}
                  onChange={(e) => setFormData({...formData, statut: e.target.value as 'En stock' | 'Réservé' | 'Vendu'})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="En stock">En stock</option>
                  <option value="Réservé">Réservé</option>
                  <option value="Vendu">Vendu</option>
                </select>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t p-6 pt-4">
              <div className="flex gap-3">
                <button 
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Enregistrer le véhicule
                </button>
                <button 
                  onClick={() => {
                    setShowAddModal(false)
                    setFormData({
                      marque: '',
                      modele: '',
                      annee: new Date().getFullYear(),
                      km: 0,
                      prix: 0,
                      prix_achat: 0,
                      carburant: 'Essence',
                      images: [],
                      description: '',
                      statut: 'En stock'
                    })
                  }}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
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
