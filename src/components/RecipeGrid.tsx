'use client'

import { useEffect, useState, useMemo, useDeferredValue } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RecipeCard } from './RecipeCard'
import { RandomizerModal } from './RandomizerModal'
import { Search, Dices, Plus, Coffee } from 'lucide-react'
import Fuse from 'fuse.js'
import type { Recipe } from '@/lib/types'
import Link from 'next/link'

export function RecipeGrid() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState('')
  const [isRandomizerOpen, setRandomizerOpen] = useState(false)
  const [isLazyFilter, setIsLazyFilter] = useState(false)
  // ⚡ Bolt: Defer search input to prevent expensive fuzzy search from blocking the main thread during typing
  const deferredSearch = useDeferredValue(search)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchRecipes() {
      const { data } = await supabase
        .from('recipes')
        .select('*, author:profiles(*), recipe_tags(tags(*))')
        .order('created_at', { ascending: false })
      
      if (data) setRecipes(data as Recipe[])
    }

    fetchRecipes()

    const channel = supabase.channel('realtime:public:recipes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, () => {
        fetchRecipes()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Fuzzy Search
  const fuse = useMemo(() => new Fuse(recipes, { keys: ['title', 'author.display_name'] }), [recipes])
  
  const filteredRecipes = useMemo(() => {
    let result = recipes
    if (deferredSearch) {
      result = fuse.search(deferredSearch).map(r => r.item)
    }
    if (isLazyFilter) {
      result = result.filter(r => {
        const isFast = r.cook_time != null && r.cook_time <= 20
        const hasLazyTag = (r as any).recipe_tags?.some((rt: any) => 
          rt.tags && ['quick', '15-min', 'easy'].includes(rt.tags.name.toLowerCase())
        )
        return isFast || hasLazyTag
      })
    }
    return result
  }, [deferredSearch, recipes, fuse, isLazyFilter])

  if (recipes.length === 0) {
    const hasKeys = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!hasKeys) {
      return (
        <div className="flex flex-col items-center justify-center p-6 mt-12 text-center">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
             <Search className="w-10 h-10 text-text-hi" />
          </div>
          <h2 className="text-2xl font-bold text-text-hi mb-2">Supabase Disconnected</h2>
          <p className="text-text-lo mb-8 max-w-sm">Please add your NEXT_PUBLIC_SUPABASE_URL and ANON_KEY to your Vercel Environment Variables.</p>
        </div>
      )
    }

    // Empty State / Onboarding View
    return (
      <div className="flex flex-col items-center justify-center p-6 mt-12 text-center">
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-text-hi" />
        </div>
        <h2 className="text-2xl font-bold text-text-hi mb-2">Your kitchen, your rules.</h2>
        <p className="text-text-lo mb-8 max-w-sm">Add your first recipe — paste a link or type it in.</p>
        
        <Link href="/recipes/new" className="bg-primary text-white border border-border hover:bg-stone-800 font-bold py-4 px-8 rounded-md shadow-sm border border-border transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Recipe
        </Link>
        <p className="mt-8 text-sm text-text-lo font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse inline-block" /> Shared Kitchen synced live
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md px-4 pt-4 pb-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-lo" />
            <input 
              aria-label="Search recipes"
              type="text" 
              placeholder="Search recipes..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-300 transition-shadow text-text-hi placeholder:text-text-lo"
            />
          </div>
          <button 
            aria-label="Surprise Me"
            onClick={() => setRandomizerOpen(true)}
            title="Surprise Me"
            className="shrink-0 w-12 h-12 bg-white border border-border rounded-md flex items-center justify-center text-text-hi hover:bg-stone-50 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300"
          >
            <Dices className="w-6 h-6" />
          </button>
          <button 
            aria-label="Toggle Lazy Mode"
            aria-pressed={isLazyFilter}
            onClick={() => setIsLazyFilter(!isLazyFilter)}
            title="I'm Lazy Mode"
            className={`shrink-0 w-12 h-12 border border-border rounded-md flex items-center justify-center transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 ${
              isLazyFilter ? 'bg-orange-100 text-orange-800 border-orange-200 shadow-inner' : 'bg-white text-text-hi hover:bg-stone-50'
            }`}
          >
            <Coffee className="w-6 h-6" />
          </button>
        </div>
        
        {/* Placeholder for Tags Filter Bar */}
      </div>

      <div className="px-4 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <RandomizerModal isOpen={isRandomizerOpen} onClose={() => setRandomizerOpen(false)} />
    </>
  )
}
