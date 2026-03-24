'use client'

import { useState } from 'react'
import { Dices, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { RecipeCard } from './RecipeCard'
import type { Recipe } from '@/lib/types'

type RandomizerModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function RandomizerModal({ isOpen, onClose }: RandomizerModalProps) {
  const [mealType, setMealType] = useState<string>('All')
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const supabase = createClient()

  async function handleRoll() {
    setLoading(true)
    setErrorMsg('')
    setRecipe(null)

    try {
      let query = supabase.from('recipes').select('*, author:profiles(*)')
      
      // We would ideally use Postgres random() RPC or similar. 
      // For simplicity in UI without custom RPC, we fetch IDs and sample one in JS, 
      // or if small dataset, fetch all and pick one.
      // Easiest is to fetch all matching tag and pick random client-side for now.
      
      if (mealType !== 'All') {
        const { data: tagData } = await supabase.from('tags').select('id').eq('name', mealType).single()
        if (tagData) {
          const { data: tagRecipes } = await supabase.from('recipe_tags').select('recipe_id').eq('tag_id', tagData.id)
          if (tagRecipes && tagRecipes.length > 0) {
            const recipeIds = tagRecipes.map(tr => tr.recipe_id)
            query = query.in('id', recipeIds)
          } else {
            setErrorMsg(`No ${mealType} recipes yet — picking from all.`)
            // fallback to all
            query = supabase.from('recipes').select('*, author:profiles(*)')
          }
        }
      }

      const { data, error } = await query
      
      if (error) throw error
      
      if (data && data.length > 0) {
        const randomItem = data[Math.floor(Math.random() * data.length)] as Recipe
        setRecipe(randomItem)
      } else {
        setErrorMsg('Your cookbook is empty!')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to roll.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Dices className="text-primary w-6 h-6" />
            Surprise Me
          </h2>

          <div className="flex gap-2 mb-6">
            {['All', 'Breakfast', 'Lunch', 'Dinner'].map(t => (
              <button
                key={t}
                onClick={() => setMealType(t)}
                className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
                  mealType === t ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {!recipe && !loading && (
            <button
              onClick={handleRoll}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-[0_4px_0_0_rgb(194,65,12)] hover:bg-orange-500 hover:translate-y-[2px] hover:shadow-[0_2px_0_0_rgb(194,65,12)] transition-all flex items-center justify-center gap-2"
            >
              <Dices className="w-5 h-5" /> Roll the Dice
            </button>
          )}

          {loading && (
            <div className="py-12 flex justify-center">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {errorMsg && <p className="text-sm text-danger mt-4 text-center">{errorMsg}</p>}

          {recipe && !loading && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-4">
                <RecipeCard recipe={recipe} />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleRoll}
                  className="flex-1 bg-stone-100 text-stone-700 font-semibold py-3 rounded-xl hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Re-roll
                </button>
                <a
                  href={`/recipes/${recipe.id}`}
                  className="flex-1 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-orange-500 transition-colors text-center"
                >
                  Start Cooking
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
