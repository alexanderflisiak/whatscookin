'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Clock, ChefHat, CheckCircle2, Circle, Pencil, AlertTriangle, ArrowLeft } from 'lucide-react'
import { CookModeOverlay } from '@/components/CookModeOverlay'
import { InstructionParser } from '@/components/InstructionParser'
import Image from 'next/image'
import Link from 'next/link'
import type { Recipe, RecipeIngredient, Tag } from '@/lib/types'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new window.Set())
  const [isCookMode, setIsCookMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!id || typeof id !== 'string') return

      try {
        // ⚡ Bolt: Fetch recipe, ingredients, and tags concurrently using Promise.all to prevent network waterfalls
        const [
          { data: recData, error: recErr },
          { data: ingData },
          { data: tagData }
        ] = await Promise.all([
          supabase.from('recipes').select('*, author:profiles(*)').eq('id', id).single(),
          supabase.from('recipe_ingredients').select('*, ingredient:ingredients(*)').eq('recipe_id', id),
          supabase.from('recipe_tags').select('tag:tags(*)').eq('recipe_id', id)
        ])

        if (recErr) throw recErr
        setRecipe(recData)
        if (ingData) setIngredients(ingData as any[])
        if (tagData) setTags(tagData.map((td: any) => td.tag as Tag))
      } catch (err: unknown) {
        setErrorMsg('Recipe not found.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, supabase])

  function toggleCheck(ingId: string) {
    const newSet = new window.Set(checkedItems)
    if (newSet.has(ingId)) newSet.delete(ingId)
    else newSet.add(ingId)
    setCheckedItems(newSet)
  }

  async function syncToShoppingList() {
    const missing = ingredients.filter(i => !checkedItems.has(i.ingredient_id))
    if (missing.length === 0) return

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return alert("Must be logged in to sync shopping list.")

      const payloads = missing.map(m => ({
        item_name: m.ingredient?.name || '',
        quantity: [m.amount, m.unit].filter(Boolean).join(' '),
        recipe_id: recipe?.id,
        created_by: userData.user.id
      }))

      const { error } = await supabase.from('shopping_list').insert(payloads)
      if (error) throw error
      alert(`${missing.length} items added to Shopping List!`)
    } catch(err) {
      alert("Failed to sync shopping list.")
    }
  }

  if (loading) return <div className="p-8 text-center text-text-lo font-medium animate-pulse">Loading recipe...</div>
  if (errorMsg || !recipe) return (
    <div className="p-8 text-center flex flex-col items-center">
      <AlertTriangle className="w-12 h-12 text-danger mb-4 opacity-50" />
      <p className="text-text-lo font-medium">{errorMsg}</p>
      <button onClick={() => router.push('/')} className="mt-4 text-text-hi font-medium hover:underline">Go back Home</button>
    </div>
  )

  const parsedInstructions = (recipe.instructions || '').split(/\n+/).map(s => s.trim()).filter(Boolean)
  const imageUrl = recipe.image_path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/recipe-images/${recipe.image_path}` : null

  return (
    <div className="pb-32 bg-background min-h-full relative">
      <Link href="/" className="absolute top-4 left-4 z-20 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="relative aspect-[4/3] w-full bg-stone-200">
        {imageUrl ? (
          <Image src={imageUrl} alt={recipe.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-stone-300" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-3xl font-black leading-tight drop-shadow-md">{recipe.title}</h1>
        </div>
      </div>

      <div className="px-5 py-6">
        <div className="flex items-center justify-between mb-8 border-b border-border/60 pb-6">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-lo tracking-wider uppercase mb-1">Cook Time</span>
              <div className="flex items-center gap-1.5 font-semibold text-text-hi">
                <Clock className="w-4 h-4 text-text-hi" />
                {recipe.cook_time ? `${recipe.cook_time}m` : '--'}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-lo tracking-wider uppercase mb-1">Created By</span>
              <div className="flex items-center gap-1.5 font-semibold text-text-hi">
                {recipe.author?.avatar_url ? (
                  <img src={recipe.author.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 bg-stone-200 rounded-full" />
                )}
                <span className="truncate max-w-[100px]">{recipe.author?.display_name?.split(' ')[0] || 'Unknown'}</span>
              </div>
            </div>
          </div>
          <Link href={`/recipes/${recipe.id}/edit`} className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-text-hi hover:bg-stone-200 transition-colors shrink-0">
            <Pencil className="w-5 h-5" />
          </Link>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map(t => <span key={t.id} className="px-3 py-1 bg-stone-50 text-text-hi text-xs font-bold uppercase tracking-wide rounded-md">{t.name}</span>)}
          </div>
        )}

        <div className="mb-10">
          <div className="flex flex-col gap-2 mb-5">
            <h2 className="text-xl font-bold">Ingredients</h2>
            <button onClick={syncToShoppingList} className="self-start text-xs font-bold uppercase tracking-wider text-text-hi hover:text-text-hi hover:underline transition-colors">
              Sync Missing to List
            </button>
          </div>
          <div className="space-y-1">
            {ingredients.map((ing) => {
              const isChecked = checkedItems.has(ing.ingredient_id)
              return (
                <button key={ing.ingredient_id} onClick={() => toggleCheck(ing.ingredient_id)} className="w-full flex items-center gap-4 py-3 min-h-[48px] px-2 -mx-2 hover:bg-stone-100 rounded-md transition-colors group text-left">
                  <div className="shrink-0">
                    {isChecked ? <CheckCircle2 className="w-6 h-6 text-success fill-success/20 stroke-[1.5]" /> : <Circle className="w-6 h-6 text-stone-300 group-hover:text-text-hi stroke-[1.5] transition-colors" />}
                  </div>
                  <div className={`flex-1 transition-all ${isChecked ? 'opacity-40 italic' : ''}`}>
                    <span className="font-semibold w-16 inline-block shrink-0">{[ing.amount, ing.unit].filter(Boolean).join(' ')}</span>
                    <span className={`font-medium ${isChecked ? 'line-through' : ''}`}>{ing.ingredient?.name}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <div className="space-y-4">
            {parsedInstructions.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-stone-100 text-text-lo text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</div>
                <div className="text-text-hi leading-relaxed font-medium">
                  <InstructionParser text={step.replace(/^(?:\d+\.|\*|\-)\s*/, '')} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-4 right-4 z-30">
        <button onClick={() => setIsCookMode(true)} className="w-full h-14 bg-primary text-white border border-border hover:bg-stone-800 font-bold text-lg rounded-md shadow-sm border border-border hover:bg-stone-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2  hover:shadow-sm border border-border">
          <ChefHat className="w-6 h-6" /> Start Cook Mode
        </button>
      </div>

      {isCookMode && <CookModeOverlay title={recipe.title} instructions={recipe.instructions || ''} onClose={() => setIsCookMode(false)} />}
    </div>
  )
}
