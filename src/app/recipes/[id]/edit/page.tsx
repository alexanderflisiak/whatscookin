'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RecipeForm } from '@/components/RecipeForm'
import type { Recipe } from '@/lib/types'

export default function EditRecipePage() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRecipe() {
      if (!id || typeof id !== 'string') return
      try {
        // ⚡ Bolt: Fetch recipe and ingredients concurrently to prevent network waterfalls
        const [recRes, ingRes] = await Promise.all([
          supabase.from('recipes').select('*').eq('id', id).single(),
          supabase.from('recipe_ingredients').select('*, ingredient:ingredients(*)').eq('recipe_id', id)
        ])

        if (!recRes.data) throw new Error('Not found')
          
        const ingredients = (ingRes.data || []).map((i: any) => ({
          amount: i.amount || '',
          unit: i.unit || '',
          name: i.ingredient?.name || '',
        }))

        setRecipe({ ...recRes.data, ingredients } as any)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipe()
  }, [id, supabase])

  if (loading) return <div className="p-8 text-center text-text-lo">Loading...</div>
  if (!recipe) return <div className="p-8 text-center text-danger">Recipe not found.</div>

  return <RecipeForm initialData={recipe} mode="edit" />
}
