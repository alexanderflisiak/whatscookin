import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import type { Recipe } from '@/lib/types'

type RecipeCardProps = {
  recipe: Recipe
}

// ⚡ Bolt: Wrapped with React.memo so the deferred search in RecipeGrid actually prevents re-renders
export const RecipeCard = React.memo(function RecipeCard({ recipe }: RecipeCardProps) {
  // If we have an image_path, it's relative to the Supabase storage bucket 'recipe-images'
  const imageUrl = recipe.image_path 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/recipe-images/${recipe.image_path}`
    : null

  return (
    <Link href={`/recipes/${recipe.id}`} className="block group">
      <div className="bg-surface rounded-md overflow-hidden shadow-sm border border-border group-hover:border-primary/50 transition-colors">
        <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center relative">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={recipe.title} 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <span className="text-text-lo text-sm font-medium">No Image</span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-text-hi leading-tight mb-2 line-clamp-2">
            {recipe.title}
          </h3>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1.5 text-text-lo text-sm">
              <Clock className="w-4 h-4" />
              <span>{recipe.cook_time ? `${recipe.cook_time}m` : '--'}</span>
            </div>

            {recipe.author?.display_name && (
              <div className="flex items-center gap-1.5">
                {recipe.author.avatar_url ? (
                  <img src={recipe.author.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-stone-200" />
                )}
                <span className="text-xs font-medium text-text-lo">
                  {recipe.author.display_name.split(' ')[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
})
