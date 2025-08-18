// Clé simple pour identifier le client (temporaire)
export function getClientId() {
  // En production, ce sera basé sur le domaine ou une licence
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    
    // Mapping domaine -> client_id
    const clientMap: Record<string, string> = {
      'localhost': 'demo',
      'garage-martin.fr': 'garage-martin',
      'pizza-luigi.fr': 'pizza-luigi'
    }
    
    return clientMap[hostname] || 'demo'
  }
  return 'demo'
}

export function isAuthorized() {
  // Plus tard : vérification de licence
  return true
}
