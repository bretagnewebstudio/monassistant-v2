'use client'
import { useState } from 'react'

interface Avis {
  id: number
  client: string
  note: number
  commentaire: string
  date: string
  source: 'Google' | 'Facebook' | 'Site' | 'Manuel'
  reponse?: string
  affiche: boolean
}

export default function AvisModule() {
  const [avisList, setAvisList] = useState<Avis[]>([
    {
      id: 1,
      client: "Marie Dupont",
      note: 5,
      commentaire: "Excellent service ! Personnel très professionnel et prix corrects.",
      date: "15/01/2025",
      source: "Google",
      affiche: true
    },
    {
      id: 2,
      client: "Jean Martin",
      note: 4,
      commentaire: "Bon garage, travail sérieux. Un peu d'attente mais satisfait du résultat.",
      date: "10/01/2025",
      source: "Facebook",
      affiche: true
    }
  ])
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [selectedAvis, setSelectedAvis] = useState<Avis | null>(null)
  const [replyText, setReplyText] = useState('')

  const generateAIReply = (avis: Avis) => {
    const templates = {
      5: "Merci beaucoup pour cette excellente note ! 🌟 Nous sommes ravis que notre service vous ait plu. Votre satisfaction est notre priorité. À bientôt !",
      4: "Merci pour votre retour positif ! 😊 Nous prenons note de vos remarques pour continuer à nous améliorer. N'hésitez pas à revenir !",
      3: "Merci pour votre avis. Nous prenons en compte vos remarques pour améliorer nos services. N'hésitez pas à nous contacter pour discuter.",
      2: "Nous vous remercions pour votre retour. Nous sommes désolés que votre expérience n'ait pas été à la hauteur. Contactez-nous pour en discuter.",
      1: "Nous sommes sincèrement désolés de cette expérience décevante. Nous aimerions comprendre ce qui s'est passé. Pouvez-vous nous contacter ?"
    }
    
    return templates[avis.note as keyof typeof templates] || templates[3]
  }

  const handleReply = () => {
    if (selectedAvis && replyText) {
      setAvisList(avisList.map(a => 
        a.id === selectedAvis.id ? {...a, reponse: replyText} : a
      ))
      setShowReplyModal(false)
      setReplyText('')
    }
  }

  const [showRequestModal, setShowRequestModal] = useState(false)
  const [emailTemplate, setEmailTemplate] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showWidgetModal, setShowWidgetModal] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)

  const generateEmailTemplate = () => {
    setEmailTemplate(`Objet : Votre avis nous intéresse - Garage Martin

Bonjour,

Nous espérons que vous êtes satisfait(e) de nos services.

Votre avis est très important pour nous aider à améliorer notre service client. Pourriez-vous prendre quelques minutes pour partager votre expérience ?

👉 Laissez votre avis sur Google : [LIEN]
👉 Ou sur notre page Facebook : [LIEN]

Merci pour votre confiance !

L'équipe du Garage Martin
📞 01 23 45 67 89`)
  }

  // Simulation import Google Reviews
  const importGoogleReviews = async () => {
    setIsImporting(true)
    setImportProgress(0)
    
    // Simulation d'import avec progression
    const mockReviews: Avis[] = [
      { id: Date.now() + 1, client: 'Jean Martin', note: 5, commentaire: 'Excellent service, très professionnel !', date: '16/01/2025', source: 'Google' as const, affiche: true },
      { id: Date.now() + 2, client: 'Sophie Durand', note: 4, commentaire: 'Bon travail, délais respectés.', date: '14/01/2025', source: 'Google' as const, affiche: true },
      { id: Date.now() + 3, client: 'Pierre Moreau', note: 5, commentaire: 'Je recommande vivement ce garage !', date: '13/01/2025', source: 'Google' as const, affiche: true }
    ]
    
    for (let i = 0; i <= 100; i += 20) {
      setImportProgress(i)
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    setAvisList([...mockReviews, ...avisList])
    setIsImporting(false)
    setShowImportModal(false)
    alert('3 nouveaux avis Google importés avec succès !')
  }

  // Envoi direct sur les plateformes
  const sendReplyToPlatform = async (avis: Avis, reponse: string) => {
    // Simulation d'envoi API
    const platform = avis.source.toLowerCase()
    alert(`Réponse envoyée sur ${avis.source} avec succès !`)
    
    // Mettre à jour l'avis avec la réponse
    setAvisList(avisList.map(a => 
      a.id === avis.id ? {...a, reponse: reponse} : a
    ))
  }

  // Génération du widget
  const generateWidgetCode = () => {
    const bestReviews = avisList.filter(a => a.note >= 4 && a.affiche).slice(0, 3)
    return `<!-- Widget Avis MonAssistant -->
<div id="monassistant-reviews-widget" style="max-width: 400px; font-family: Arial, sans-serif; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background: white;">
  <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">⭐ Avis Clients</h3>
  <div style="text-align: center; margin-bottom: 15px;">
    <span style="font-size: 24px; font-weight: bold; color: #f59e0b;">⭐ ${moyenneNote}/5</span>
    <div style="font-size: 12px; color: #6b7280;">${avisList.length} avis</div>
  </div>
  ${bestReviews.map(avis => `
  <div style="border-bottom: 1px solid #f3f4f6; padding: 10px 0; margin-bottom: 10px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
      <strong style="color: #1f2937; font-size: 14px;">${avis.client}</strong>
      <div>${'⭐'.repeat(avis.note)}</div>
    </div>
    <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.4;">"${avis.commentaire}"</p>
  </div>`).join('')}
  <div style="text-align: center; margin-top: 15px;">
    <a href="#" style="color: #3b82f6; text-decoration: none; font-size: 12px;">Voir tous les avis</a>
  </div>
</div>`
  }

  const moyenneNote = avisList.length > 0 
    ? (avisList.reduce((acc, a) => acc + a.note, 0) / avisList.length).toFixed(1)
    : '0'

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">⭐ Avis Clients</h2>
          <p className="text-gray-600 text-sm mt-1">Note moyenne : ⭐ {moyenneNote}/5 ({avisList.length} avis)</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowImportModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            📥 Importer Google
          </button>
          <button 
            onClick={() => setShowWidgetModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            🔧 Widget
          </button>
          <button 
            onClick={() => setShowStatsModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            📊 Stats
          </button>
          <button 
            onClick={() => {
              setShowRequestModal(true)
              generateEmailTemplate()
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Demander un avis
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-yellow-500">⭐ {moyenneNote}</div>
          <div className="text-gray-500 text-sm">Note moyenne</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-green-600">{avisList.filter(a => a.note >= 4).length}</div>
          <div className="text-gray-500 text-sm">Avis positifs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600">{avisList.filter(a => a.reponse).length}</div>
          <div className="text-gray-500 text-sm">Réponses</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-purple-600">{avisList.filter(a => a.affiche).length}</div>
          <div className="text-gray-500 text-sm">Publiés</div>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {avisList.map(avis => (
          <div key={avis.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-lg">{avis.client}</strong>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{avis.source}</span>
                  {!avis.affiche && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Non publié</span>}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < avis.note ? 'text-yellow-500' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                  <span className="text-gray-500 text-sm ml-2">{avis.date}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedAvis(avis)
                    setReplyText(avis.reponse || generateAIReply(avis))
                    setShowReplyModal(true)
                  }}
                  className="text-blue-600 text-sm hover:underline"
                >
                  {avis.reponse ? 'Modifier réponse' : '🤖 Répondre (IA)'}
                </button>
                <button 
                  onClick={() => setAvisList(avisList.map(a => 
                    a.id === avis.id ? {...a, affiche: !a.affiche} : a
                  ))}
                  className="text-green-600 text-sm hover:underline"
                >
                  {avis.affiche ? 'Masquer' : 'Publier'}
                </button>
              </div>
            </div>
            
            <p className="text-gray-700 mb-2">{avis.commentaire}</p>
            
            {avis.reponse && (
              <div className="bg-blue-50 p-3 rounded-lg mt-3">
                <div className="font-semibold text-blue-900 text-sm mb-1">↳ Votre réponse :</div>
                <p className="text-blue-800 text-sm">{avis.reponse}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de réponse */}
      {showReplyModal && selectedAvis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">🤖 Répondre à l'avis</h3>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="font-semibold">{selectedAvis.client}</div>
              <div className="flex items-center gap-1 my-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < selectedAvis.note ? 'text-yellow-500 text-sm' : 'text-gray-300 text-sm'}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-700">{selectedAvis.commentaire}</p>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Réponse suggérée par l'IA :</label>
                <button 
                  onClick={() => setReplyText(generateAIReply(selectedAvis))}
                  className="text-blue-600 text-sm hover:underline"
                >
                  🔄 Régénérer
                </button>
              </div>
            </div>

            <textarea 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Merci pour votre avis..."
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => {
                  sendReplyToPlatform(selectedAvis, replyText)
                  setShowReplyModal(false)
                  setReplyText('')
                }}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                📤 Envoyer sur {selectedAvis.source}
              </button>
              <button 
                onClick={handleReply}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                💾 Sauvegarder seulement
              </button>
              <button 
                onClick={() => {
                  setShowReplyModal(false)
                  setReplyText('')
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal demande d'avis */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <h3 className="text-xl font-bold mb-4">📧 Demander un avis client</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Template d'email généré :</label>
              <textarea 
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(emailTemplate)
                  alert('Template copié ! Collez-le dans votre logiciel d\'email.')
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                📋 Copier le template
              </button>
              <button 
                onClick={() => setShowRequestModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import Google */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">📥 Importer les avis Google</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">URL Google My Business :</label>
              <input 
                type="url"
                placeholder="https://business.google.com/reviews/..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Connectez votre compte Google My Business</p>
            </div>

            {isImporting && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Import en cours...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={importGoogleReviews}
                disabled={isImporting}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {isImporting ? '⏳ Import...' : '📥 Importer'}
              </button>
              <button 
                onClick={() => setShowImportModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Widget */}
      {showWidgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6">
            <h3 className="text-xl font-bold mb-4">🔧 Widget Avis pour votre site</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Aperçu du widget :</h4>
                <div 
                  className="border rounded-lg p-4 bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: generateWidgetCode() }}
                />
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Code à intégrer :</h4>
                <textarea 
                  value={generateWidgetCode()}
                  readOnly
                  rows={12}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-mono bg-gray-50"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generateWidgetCode())
                    alert('Code widget copié ! Collez-le sur votre site.')
                  }}
                  className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  📋 Copier le code
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowWidgetModal(false)}
              className="w-full mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal Statistiques */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6">
            <h3 className="text-xl font-bold mb-4">📊 Statistiques mensuelles</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Évolution des avis</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-end h-32 gap-2">
                    {['Oct', 'Nov', 'Déc', 'Jan'].map((mois, i) => (
                      <div key={mois} className="flex flex-col items-center">
                        <div 
                          className="bg-blue-500 w-8 rounded-t"
                          style={{ height: `${(i + 1) * 20}px` }}
                        ></div>
                        <span className="text-xs mt-1">{mois}</span>
                        <span className="text-xs font-bold">{(i + 1) * 3}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Répartition par note</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(note => {
                    const count = avisList.filter(a => a.note === note).length
                    const percentage = avisList.length > 0 ? (count / avisList.length * 100).toFixed(0) : 0
                    return (
                      <div key={note} className="flex items-center gap-3">
                        <span className="text-sm w-8">{note}⭐</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-yellow-500 h-4 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm w-12">{count} ({percentage}%)</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{avisList.filter(a => a.reponse).length}</div>
                <div className="text-sm text-green-700">Avis avec réponse</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{avisList.filter(a => a.source === 'Google').length}</div>
                <div className="text-sm text-blue-700">Avis Google</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{avisList.filter(a => a.source === 'Facebook').length}</div>
                <div className="text-sm text-purple-700">Avis Facebook</div>
              </div>
            </div>

            <button 
              onClick={() => setShowStatsModal(false)}
              className="w-full mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
