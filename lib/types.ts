export interface Vehicle {
  id?: string
  client_id?: string
  marque: string
  modele: string
  annee: number
  km: number
  prix: number
  prix_achat?: number
  carburant: string
  images: string[]
  description: string
  statut: 'En stock' | 'Réservé' | 'Vendu'
  created_at?: string
}

export interface Review {
  id?: string
  client_id?: string
  client_name: string
  note: number
  commentaire: string
  source: string
  reponse?: string
  affiche: boolean
  created_at?: string
}
