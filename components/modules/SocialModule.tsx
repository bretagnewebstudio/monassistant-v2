'use client'
import { useState, useEffect } from 'react'

interface Post {
  id: number
  contenu: string
  reseaux: string[]
  type: 'vehicule' | 'promotion' | 'conseil' | 'avis' | 'actualite' | 'evenement'
  date: string
  statut: 'Brouillon' | 'Programmé' | 'Publié'
  hashtags?: string[]
  image?: string
}

interface ContentItem {
  id: string
  type: 'avis' | 'actualite' | 'vehicule' | 'promotion' | 'evenement'
  titre: string
  contenu: string
  date: string
  image?: string
  note?: number
  client?: string
  prix?: string
  selected?: boolean
}

export default function SocialModule() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showGenerator, setShowGenerator] = useState(false)
  const [showContentSelector, setShowContentSelector] = useState(false)
  const [generatorType, setGeneratorType] = useState<'vehicule' | 'promo' | 'conseil'>('vehicule')
  const [generatedContent, setGeneratedContent] = useState('')
  const [selectedItems, setSelectedItems] = useState<ContentItem[]>([])
  const [availableContent, setAvailableContent] = useState<ContentItem[]>([])

  const templates = {
    vehicule: {
      titre: "🚗 NOUVELLE ARRIVÉE",
      template: "🚗 NOUVELLE ARRIVÉE !\n\n[Marque] [Modèle] - [Année]\n✅ [Km] km\n⛽ [Carburant]\n💰 Seulement [Prix]€\n\n📞 Contactez-nous vite !\n#voitureoccasion #[marque] #garage"
    },
    promo: {
      titre: "🎯 PROMOTION",
      template: "🎯 PROMOTION EXCEPTIONNELLE !\n\n🔧 [Service] à -[%]% !\n📅 Valable jusqu'au [Date]\n\n✅ Prenez RDV maintenant\n📞 [Téléphone]\n\n#promotion #garage #entretien"
    },
    conseil: {
      titre: "💡 CONSEIL",
      template: "💡 CONSEIL DU JOUR\n\n[Titre]\n\n[Conseil détaillé]\n\n🔧 Besoin d'aide ? Nous sommes là !\n📞 Prenez RDV\n\n#conseilauto #entretien #garage"
    }
  }

  const generatePost = () => {
    const template = templates[generatorType].template
    setGeneratedContent(template)
  }

  const saveAsPost = (reseaux: string[] = ['Facebook']) => {
    const newPost: Post = {
      id: Date.now(),
      reseaux: reseaux,
      type: generatorType === 'vehicule' ? 'vehicule' : generatorType === 'promo' ? 'promotion' : 'conseil',
      contenu: generatedContent,
      statut: 'Publié',
      date: new Date().toLocaleDateString(),
      hashtags: extractHashtags(generatedContent)
    }
    setPosts([newPost, ...posts])
    setShowGenerator(false)
    setGeneratedContent('')
  }

  // Simuler la détection de contenu du site
  useEffect(() => {
    const mockContent: ContentItem[] = [
      {
        id: '1',
        type: 'avis',
        titre: 'Avis 5 étoiles de Marie Dupont',
        contenu: 'Service impeccable, équipe très professionnelle !',
        date: '15/01/2025',
        note: 5,
        client: 'Marie Dupont'
      },
      {
        id: '2',
        type: 'actualite',
        titre: 'Nouvelle promotion hiver',
        contenu: 'Révision complète à -30% jusqu\'au 28 février',
        date: '12/01/2025',
        prix: '89€'
      },
      {
        id: '3',
        type: 'vehicule',
        titre: 'Peugeot 308 - 2020',
        contenu: 'Excellent état, 45 000 km, essence',
        date: '10/01/2025',
        prix: '15 900€'
      },
      {
        id: '4',
        type: 'evenement',
        titre: 'Portes ouvertes',
        contenu: 'Venez découvrir nos nouveaux services le 25 janvier',
        date: '08/01/2025'
      }
    ]
    setAvailableContent(mockContent)
  }, [])

  const extractHashtags = (content: string): string[] => {
    const hashtags = content.match(/#\w+/g) || []
    return hashtags
  }

  const generateHashtags = (items: ContentItem[]): string[] => {
    const baseHashtags = ['#garage', '#automobile']
    const typeHashtags: { [key: string]: string[] } = {
      avis: ['#satisfaction', '#avis', '#service'],
      actualite: ['#promotion', '#offre', '#reduction'],
      vehicule: ['#voitureoccasion', '#vente', '#occasion'],
      evenement: ['#evenement', '#portesouvertes', '#rdv']
    }
    
    const additionalHashtags = items.flatMap(item => typeHashtags[item.type] || [])
    return [...new Set([...baseHashtags, ...additionalHashtags])]
  }

  const generatePostFromSelection = () => {
    if (selectedItems.length === 0) return
    
    let content = ''
    const hashtags = generateHashtags(selectedItems)
    
    selectedItems.forEach((item, index) => {
      switch (item.type) {
        case 'avis':
          content += `⭐ TÉMOIGNAGE CLIENT\n\n"${item.contenu}"\n- ${item.client} (${item.note}/5 étoiles)\n\n`
          break
        case 'actualite':
          content += `🎯 ${item.titre.toUpperCase()}\n\n${item.contenu}\n${item.prix ? `💰 À partir de ${item.prix}` : ''}\n\n`
          break
        case 'vehicule':
          content += `🚗 ${item.titre.toUpperCase()}\n\n${item.contenu}\n💰 ${item.prix}\n\n`
          break
        case 'evenement':
          content += `📅 ${item.titre.toUpperCase()}\n\n${item.contenu}\n\n`
          break
      }
    })
    
    content += '📞 Contactez-nous !\n\n'
    content += hashtags.join(' ')
    
    setGeneratedContent(content)
  }

  const getReseauColor = (reseau: string) => {
    switch(reseau) {
      case 'Facebook': return 'bg-blue-600'
      case 'Instagram': return 'bg-gradient-to-br from-purple-600 to-pink-600'
      case 'LinkedIn': return 'bg-blue-700'
      case 'Twitter': return 'bg-black'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">📱 Réseaux Sociaux</h2>
          <p className="text-gray-600 text-sm mt-1">{posts.filter(p => p.statut === 'Publié').length} posts publiés</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowContentSelector(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            🎯 Créer depuis le contenu
          </button>
          <button 
            onClick={() => setShowGenerator(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            🤖 Générateur manuel
          </button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <div className="text-2xl mb-1">📘</div>
          <div className="text-2xl font-bold">{posts.filter(p => p.reseaux.includes('Facebook')).length}</div>
          <div className="text-sm opacity-90">Facebook</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4 rounded-lg">
          <div className="text-2xl mb-1">📷</div>
          <div className="text-2xl font-bold">{posts.filter(p => p.reseaux.includes('Instagram')).length}</div>
          <div className="text-sm opacity-90">Instagram</div>
        </div>
        <div className="bg-blue-700 text-white p-4 rounded-lg">
          <div className="text-2xl mb-1">💼</div>
          <div className="text-2xl font-bold">{posts.filter(p => p.reseaux.includes('LinkedIn')).length}</div>
          <div className="text-sm opacity-90">LinkedIn</div>
        </div>
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="text-2xl mb-1">🐦</div>
          <div className="text-2xl font-bold">{posts.filter(p => p.reseaux.includes('Twitter')).length}</div>
          <div className="text-sm opacity-90">Twitter/X</div>
        </div>
      </div>

      {/* Liste des posts */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📱</div>
          <p className="text-gray-500">Aucun post créé</p>
          <p className="text-sm text-gray-400 mt-2">Utilisez le générateur pour créer vos premiers posts</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {post.reseaux.map(reseau => (
                      <span key={reseau} className={`text-white px-2 py-1 rounded text-xs font-semibold ${getReseauColor(reseau)}`}>
                        {reseau}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{post.type}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    post.statut === 'Publié' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.statut === 'Publié' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 text-sm hover:underline">Modifier</button>
                  <button className="text-green-600 text-sm hover:underline">Publier</button>
                  <button 
                    onClick={() => setPosts(posts.filter(p => p.id !== post.id))}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{post.contenu.substring(0, 200)}...</p>
            </div>
          ))}
        </div>
      )}

      {/* Générateur de posts */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">🤖 Générateur de posts</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Type de post</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setGeneratorType('vehicule')}
                    className={`p-3 rounded-lg border-2 ${generatorType === 'vehicule' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                  >
                    🚗 Véhicule
                  </button>
                  <button 
                    onClick={() => setGeneratorType('promo')}
                    className={`p-3 rounded-lg border-2 ${generatorType === 'promo' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                  >
                    🎯 Promotion
                  </button>
                  <button 
                    onClick={() => setGeneratorType('conseil')}
                    className={`p-3 rounded-lg border-2 ${generatorType === 'conseil' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                  >
                    💡 Conseil
                  </button>
                </div>
              </div>

              <button 
                onClick={generatePost}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold mb-4"
              >
                ✨ Générer le contenu
              </button>

              {generatedContent && (
                <>
                  <textarea 
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  />
                  
                  {/* Sélection des réseaux sociaux */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Publier sur :</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map(reseau => (
                        <label key={reseau} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                          <input 
                            type="checkbox" 
                            defaultChecked={reseau === 'Facebook'}
                            className="rounded"
                          />
                          <span className={`w-3 h-3 rounded ${getReseauColor(reseau)}`}></span>
                          <span className="text-sm">{reseau}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        const selectedNetworks = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                          .map((input) => (input as HTMLInputElement).parentElement?.querySelector('span:last-child')?.textContent)
                          .filter((text): text is string => text !== null && text !== undefined)
                        saveAsPost(selectedNetworks)
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      💾 Sauvegarder comme brouillon
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent)
                        alert('Post copié ! Collez-le sur vos réseaux sociaux.')
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      📋 Copier pour publication
                    </button>
                  </div>
                </>
              )}

              <button 
                onClick={() => {
                  setShowGenerator(false)
                  setGeneratedContent('')
                }}
                className="w-full mt-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sélecteur de contenu */}
      {showContentSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">🎯 Créer un post depuis votre contenu</h3>
              <p className="text-gray-600 mb-6">Sélectionnez un ou plusieurs éléments pour générer automatiquement un post illustré</p>
              
              <div className="grid gap-4 mb-6">
                {availableContent.map(item => (
                  <div 
                    key={item.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedItems.find(s => s.id === item.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      const isSelected = selectedItems.find(s => s.id === item.id)
                      if (isSelected) {
                        setSelectedItems(selectedItems.filter(s => s.id !== item.id))
                      } else {
                        setSelectedItems([...selectedItems, item])
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.type === 'avis' ? 'bg-yellow-100 text-yellow-800' :
                            item.type === 'actualite' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'vehicule' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.type === 'avis' ? '⭐ Avis' :
                             item.type === 'actualite' ? '📰 Actualité' :
                             item.type === 'vehicule' ? '🚗 Véhicule' :
                             '📅 Événement'}
                          </span>
                          <span className="text-xs text-gray-500">{item.date}</span>
                          {item.note && (
                            <span className="text-xs text-yellow-600">⭐ {item.note}/5</span>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">{item.titre}</h4>
                        <p className="text-gray-600 text-sm">{item.contenu}</p>
                        {item.prix && (
                          <p className="text-green-600 font-semibold mt-1">{item.prix}</p>
                        )}
                        {item.client && (
                          <p className="text-gray-500 text-xs mt-1">Par {item.client}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        {selectedItems.find(s => s.id === item.id) && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    generatePostFromSelection()
                    setShowContentSelector(false)
                    setShowGenerator(true)
                  }}
                  disabled={selectedItems.length === 0}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  ✨ Générer le post ({selectedItems.length} sélectionné{selectedItems.length > 1 ? 's' : ''})
                </button>
                <button 
                  onClick={() => {
                    setShowContentSelector(false)
                    setSelectedItems([])
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
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
