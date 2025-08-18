import { createClient } from '@supabase/supabase-js'

// Variables en dur temporairement pour tester
const supabaseUrl = 'https://itijhfuqaabojbidgxcj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aWpoZnVxYWFib2piaWRneGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDYxMTAsImV4cCI6MjA3MTA4MjExMH0.9zIDZWrLZWrWj-knKxxiavL1KXNYgjAEjidhmKrpzbQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export interface Vehicle {
  id?: string
  marque: string
  modele: string
  annee: number
  km: number
  prix: number
  carburant: string
  images: string[]
  description: string
  statut: 'En stock' | 'Réservé' | 'Vendu'
  created_at?: string
  client_id?: string
}

export interface Review {
  id?: string
  client: string
  note: number
  commentaire: string
  source: string
  reponse?: string
  affiche: boolean
  created_at?: string
  client_id?: string
}

export interface Actualite {
  id?: string
  titre: string
  contenu: string
  categorie: 'Promotion' | 'Nouveauté' | 'Info' | 'Événement'
  image?: string
  publie: boolean
  created_at?: string
  client_id?: string
}

export interface Post {
  id?: string
  contenu: string
  reseaux: string[]
  type: 'vehicule' | 'promotion' | 'conseil' | 'avis' | 'actualite' | 'evenement'
  hashtags?: string[]
  image?: string
  statut: 'brouillon' | 'publie'
  created_at?: string
  client_id?: string
}
