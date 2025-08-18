import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getClientId } from '@/lib/security'
import { Vehicle } from '@/lib/types'

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicles()
  }, [])

  async function fetchVehicles() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('client_id', getClientId())
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error:', error)
        // Si la table n'existe pas, on travaille en local
        const localData = localStorage.getItem('garage-vehicules')
        if (localData) {
          setVehicles(JSON.parse(localData))
        }
      } else {
        setVehicles(data || [])
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addVehicle(vehicle: Vehicle) {
    try {
      // Préparer les données
      const vehicleData = {
        ...vehicle,
        client_id: getClientId(),
        images: vehicle.images || []
      }
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select()
      
      if (error) {
        console.error('Supabase error:', error)
        // Fallback sur localStorage si erreur
        const localVehicules = JSON.parse(localStorage.getItem('garage-vehicules') || '[]')
        const newVehicle = { ...vehicleData, id: Date.now() }
        const updated = [newVehicle, ...localVehicules]
        localStorage.setItem('garage-vehicules', JSON.stringify(updated))
        setVehicles(updated)
        return newVehicle
      }
      
      if (data) {
        setVehicles([data[0], ...vehicles])
        return data[0]
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      throw error
    }
  }

  async function updateVehicle(id: string, updates: Partial<Vehicle>) {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      await fetchVehicles()
    } catch (error) {
      console.error('Error updating vehicle:', error)
      // Fallback localStorage
      const localVehicules = JSON.parse(localStorage.getItem('garage-vehicules') || '[]')
      const updated = localVehicules.map((v: Vehicle) => v.id === id ? {...v, ...updates} : v)
      localStorage.setItem('garage-vehicules', JSON.stringify(updated))
      setVehicles(updated)
    }
  }

  async function deleteVehicle(id: string) {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setVehicles(vehicles.filter(v => v.id !== id))
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      // Fallback localStorage
      const localVehicules = JSON.parse(localStorage.getItem('garage-vehicules') || '[]')
      const updated = localVehicules.filter((v: Vehicle) => v.id !== id)
      localStorage.setItem('garage-vehicules', JSON.stringify(updated))
      setVehicles(updated)
    }
  }

  return {
    vehicles,
    loading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refresh: fetchVehicles
  }
}
