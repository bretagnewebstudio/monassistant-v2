// API pour récupérer les modules par secteur
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sector = searchParams.get('sector') || 'garage'

  const MODULES_LIBRARY = {
    'garage': [
      { name: 'vehicules', description: 'Gestion véhicules', icon: '🚗' },
      { name: 'services', description: 'Services garage', icon: '🔧' },
      { name: 'rdv', description: 'Rendez-vous', icon: '📅' },
      { name: 'devis', description: 'Devis clients', icon: '💰' },
      { name: 'factures', description: 'Facturation', icon: '🧾' }
    ],
    
    'collection-pokemon': [
      { name: 'produits', description: 'Produits Pokemon', icon: '🎴' },
      { name: 'avis-vinted', description: 'Avis Vinted', icon: '⭐' },
      { name: 'actualites', description: 'Actualités', icon: '📰' },
      { name: 'echanges', description: 'Échanges', icon: '🔄' },
      { name: 'collection', description: 'Ma collection', icon: '📚' }
    ]
  }

  const modules = MODULES_LIBRARY[sector] || MODULES_LIBRARY['garage']
  
  return Response.json({ modules })
}
