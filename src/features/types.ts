export type Id = string

export type Entity = {
  id: Id
  name: string
}

export const nutrientNames = ["kcal", "carbs", "fat", "protein", "fiber", "sugar"] as const

export type Nutrients = Record<(typeof nutrientNames)[number], number>

export type Food = Nutrients &
  Entity & {
    description: string
  }

export type Recipe = Entity & {
  description: string
  ingredients: Array<Ingredient>
}

export type RecipeWithNutrients = Omit<Recipe, "ingredients"> & Nutrients

export type Ingredient = {
  amountInGram: number
  foodId: Id
}
