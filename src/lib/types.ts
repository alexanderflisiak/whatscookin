export type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
}

export type Recipe = {
  id: string
  title: string
  instructions: string | null
  cook_time: number | null
  source_url: string | null
  image_path: string | null
  created_by: string | null
  created_at: string
  updated_at: string

  // Joined fields for convenience in UI
  author?: Profile | null
}

export type Tag = {
  id: string
  name: string
}

export type RecipeTag = {
  recipe_id: string
  tag_id: string
}

export type Ingredient = {
  id: string
  name: string
}

export type RecipeIngredient = {
  recipe_id: string
  ingredient_id: string
  amount: string | null
  unit: string | null

  // Joined field
  ingredient?: Ingredient
}

export type ShoppingListItem = {
  id: string
  item_name: string
  quantity: string | null
  is_bought: boolean
  bought_at: string | null
  recipe_id: string | null
  created_by: string | null
  created_at: string
}
