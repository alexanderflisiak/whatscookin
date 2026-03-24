'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Link as LinkIcon, Download, Loader2, Save } from 'lucide-react'
import type { Recipe, RecipeIngredient, Tag } from '@/lib/types'

type RecipeFormData = {
  title: string
  source_url: string
  cook_time: number | null
  instructions: string
  ingredients: { amount: string; unit: string; name: string }[]
  tags: string[]
}

export function RecipeForm({ initialData, mode = 'create' }: { initialData?: Partial<Recipe> & { ingredients?: any[] }, mode?: 'create' | 'edit' }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [scrapeUrl, setScrapeUrl] = useState('')
  const [isScraping, setIsScraping] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { register, control, handleSubmit, setValue, getValues, watch } = useForm<RecipeFormData>({
    defaultValues: {
      title: initialData?.title || '',
      source_url: initialData?.source_url || '',
      cook_time: initialData?.cook_time || null,
      instructions: initialData?.instructions || '',
      ingredients: initialData?.ingredients || [{ amount: '', unit: '', name: '' }],
      tags: [],
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients'
  })

  async function handleScrape() {
    if (!scrapeUrl) return
    setIsScraping(true)
    setErrorMsg('')
    
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        body: JSON.stringify({ url: scrapeUrl })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setValue('title', data.title || '')
      setValue('source_url', data.source_url || scrapeUrl)
      setValue('instructions', data.instructions || '')
      setValue('cook_time', data.cook_time || null)
      
      if (data.ingredients && data.ingredients.length > 0) {
        // clear existing and append new
        setValue('ingredients', data.ingredients)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Scrape failed. You may need to enter manually.')
    } finally {
      setIsScraping(false)
    }
  }

  async function onSubmit(data: RecipeFormData) {
    setIsSaving(true)
    setErrorMsg('')
    try {
      // 1. Insert/Update Recipe
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Must be logged in to save")

      const recipePayload = {
        title: data.title,
        instructions: data.instructions,
        cook_time: data.cook_time,
        source_url: data.source_url,
        created_by: userData.user.id
      }

      let recipeId = initialData?.id

      if (mode === 'create') {
        const { data: newRecipe, error: recipeErr } = await supabase
          .from('recipes')
          .insert(recipePayload)
          .select('id')
          .single()
        if (recipeErr) throw recipeErr
        recipeId = newRecipe.id
      } else {
        const { error: recipeErr } = await supabase
          .from('recipes')
          .update(recipePayload)
          .eq('id', recipeId)
        if (recipeErr) throw recipeErr
      }

      // 2. Handle Ingredients
      // For simplicity, delete old bridge records and re-insert
      if (mode === 'edit') {
        await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId)
      }

      for (const ing of data.ingredients) {
        if (!ing.name) continue
        const ingName = ing.name.trim().toLowerCase()
        
        // Find or create ingredient
        let { data: existingIng } = await supabase.from('ingredients').select('id').eq('name', ingName).single()
        let ingredientId = existingIng?.id

        if (!ingredientId) {
          const { data: newIng, error: newIngErr } = await supabase.from('ingredients').insert({ name: ingName }).select('id').single()
          if (!newIngErr && newIng) ingredientId = newIng.id
        }

        if (ingredientId) {
          await supabase.from('recipe_ingredients').insert({
            recipe_id: recipeId,
            ingredient_id: ingredientId,
            amount: ing.amount || null,
            unit: ing.unit || null
          })
        }
      }

      router.push(`/recipes/${recipeId}`)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save recipe')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">{mode === 'create' ? 'Add Recipe' : 'Edit Recipe'}</h1>

      {mode === 'create' && (
        <div className="bg-surface p-4 rounded-xl border border-border mb-8 shadow-sm">
          <label className="block text-sm font-semibold mb-2">Scrape from URL</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-lo" />
              <input 
                type="url" 
                placeholder="https://tasty.co/..." 
                value={scrapeUrl}
                onChange={e => setScrapeUrl(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <button 
              type="button"
              onClick={handleScrape} 
              disabled={isScraping || !scrapeUrl}
              className="bg-stone-200 text-text-hi px-4 py-2 rounded-lg font-medium hover:bg-stone-300 disabled:opacity-50 flex items-center gap-2"
            >
              {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Scrape
            </button>
          </div>
        </div>
      )}

      {errorMsg && <div className="bg-red-50 text-danger p-3 rounded-lg mb-6 text-sm">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input 
            {...register('title', { required: true })}
            className="w-full p-3 border border-border rounded-lg bg-surface focus:ring-2 focus:ring-primary/50 outline-none font-medium"
            placeholder="e.g. Garlic Butter Chicken"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Source URL (optional)</label>
          <input 
            {...register('source_url')}
            className="w-full p-2 border border-border rounded-lg bg-surface focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 flex justify-between items-center">
            <span>Ingredients</span>
            <button 
              type="button" 
              onClick={() => append({ amount: '', unit: '', name: '' })}
              className="text-primary text-sm flex items-center gap-1 font-medium bg-orange-50 px-2 py-1 rounded"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </label>
          
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <input 
                  {...register(`ingredients.${index}.amount`)}
                  placeholder="2"
                  className="w-16 p-2 border border-border rounded-lg bg-surface text-center outline-none focus:border-primary shrink-0"
                />
                <input 
                  {...register(`ingredients.${index}.unit`)}
                  placeholder="cups"
                  className="w-20 p-2 border border-border rounded-lg bg-surface outline-none focus:border-primary shrink-0"
                />
                <input 
                  {...register(`ingredients.${index}.name`, { required: true })}
                  placeholder="flour"
                  className="flex-1 p-2 border border-border rounded-lg bg-surface outline-none focus:border-primary"
                />
                <button 
                  type="button" 
                  onClick={() => remove(index)}
                  className="p-2 text-text-lo hover:text-danger hover:bg-red-50 rounded-lg transition-colors mt-0.5 shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Instructions</label>
          <textarea 
            {...register('instructions')}
            rows={10}
            className="w-full p-3 border border-border rounded-lg bg-surface focus:ring-2 focus:ring-primary/50 outline-none leading-relaxed"
            placeholder="1. Preheat the oven...&#10;2. Mix the dry ingredients..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-[0_4px_0_0_rgb(194,65,12)] hover:bg-orange-500 hover:translate-y-[2px] border-b-4 border-transparent hover:shadow-[0_2px_0_0_rgb(194,65,12)] transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {mode === 'create' ? 'Save Recipe' : 'Update Recipe'}
        </button>
      </form>
    </div>
  )
}
