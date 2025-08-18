import { useState, useEffect } from 'react'
import { supabase, Vehicle, Review, Actualite, Post } from '@/lib/supabase'

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
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setVehicles(data || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicle])
        .select()
      
      if (error) throw error
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
      throw error
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
      throw error
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

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addReview(review: Omit<Review, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
      
      if (error) throw error
      if (data) {
        setReviews([data[0], ...reviews])
        return data[0]
      }
    } catch (error) {
      console.error('Error adding review:', error)
      throw error
    }
  }

  async function updateReview(id: string, updates: Partial<Review>) {
    try {
      const { error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      await fetchReviews()
    } catch (error) {
      console.error('Error updating review:', error)
      throw error
    }
  }

  async function deleteReview(id: string) {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setReviews(reviews.filter(r => r.id !== id))
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  }

  return {
    reviews,
    loading,
    addReview,
    updateReview,
    deleteReview,
    refresh: fetchReviews
  }
}

export function useActualites() {
  const [actualites, setActualites] = useState<Actualite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActualites()
  }, [])

  async function fetchActualites() {
    try {
      const { data, error } = await supabase
        .from('actualites')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setActualites(data || [])
    } catch (error) {
      console.error('Error fetching actualites:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addActualite(actualite: Omit<Actualite, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('actualites')
        .insert([actualite])
        .select()
      
      if (error) throw error
      if (data) {
        setActualites([data[0], ...actualites])
        return data[0]
      }
    } catch (error) {
      console.error('Error adding actualite:', error)
      throw error
    }
  }

  async function updateActualite(id: string, updates: Partial<Actualite>) {
    try {
      const { error } = await supabase
        .from('actualites')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      await fetchActualites()
    } catch (error) {
      console.error('Error updating actualite:', error)
      throw error
    }
  }

  async function deleteActualite(id: string) {
    try {
      const { error } = await supabase
        .from('actualites')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setActualites(actualites.filter(a => a.id !== id))
    } catch (error) {
      console.error('Error deleting actualite:', error)
      throw error
    }
  }

  return {
    actualites,
    loading,
    addActualite,
    updateActualite,
    deleteActualite,
    refresh: fetchActualites
  }
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addPost(post: Omit<Post, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .select()
      
      if (error) throw error
      if (data) {
        setPosts([data[0], ...posts])
        return data[0]
      }
    } catch (error) {
      console.error('Error adding post:', error)
      throw error
    }
  }

  async function updatePost(id: string, updates: Partial<Post>) {
    try {
      const { error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      await fetchPosts()
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  }

  async function deletePost(id: string) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setPosts(posts.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }

  return {
    posts,
    loading,
    addPost,
    updatePost,
    deletePost,
    refresh: fetchPosts
  }
}
