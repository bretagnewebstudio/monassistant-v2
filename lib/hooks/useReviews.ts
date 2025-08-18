import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getClientId } from '@/lib/security'
import { Review } from '@/lib/types'

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
        .eq('client_id', getClientId())
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setReviews(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addReview(review: Review) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ ...review, client_id: getClientId() }])
        .select()
      
      if (!error && data) {
        setReviews([data[0], ...reviews])
        return data[0]
      }
    } catch (error) {
      console.error('Error adding review:', error)
    }
  }

  return {
    reviews,
    loading,
    addReview,
    refresh: fetchReviews
  }
}
