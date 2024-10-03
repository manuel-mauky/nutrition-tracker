export type Id = string

export type Entity = {
  id: Id
  name: string
}

export const nutrientNames = ["kcal", "carbs", "fat", "protein", "fiber", "sugar"] as const
export type NutrientName = (typeof nutrientNames)[number]

export function isNutrientName(key: string): key is NutrientName {
  return nutrientNames.includes(key as NutrientName)
}

export const nutrientUnit: Record<NutrientName, string> = {
  kcal: "",
  carbs: "g",
  fat: "g",
  protein: "g",
  fiber: "g",
  sugar: "g",
}

export type Nutrients = Record<(typeof nutrientNames)[number], number>

export type Food = Nutrients &
  Entity & {
    description: string
  }

export type Recipe = Entity & {
  description: string
  ingredients: Array<Ingredient>
  portions: number
}

export type RecipeWithNutrients = Omit<Recipe, "ingredients"> & Nutrients

export type Ingredient = {
  ingredientId: Id
  foodId: Id
  amountInGram: number
}


export type IsoDateString = string
export type IsoDateTimeString = string

export type FoodDiaryEntry = {
  id: Id
  date: IsoDateTimeString
  mealType: "food"
  foodId: Id
  amountInGram: number
}

export type RecipeDiaryEntry = {
  id: Id
  date: IsoDateTimeString
  mealType: "recipe"
  recipeId: Id
  portions: number
}

export type DiaryEntry = FoodDiaryEntry | RecipeDiaryEntry

