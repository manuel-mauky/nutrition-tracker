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

export type FoodAmount = {
  foodId: Id
  amountInGram: number
}

export type Ingredient = FoodAmount & {
  ingredientId: Id
}

export type IsoDateString = string
export type IsoDateTimeString = string

export type FoodDiaryEntry = FoodAmount & {
  id: Id
  date: IsoDateTimeString
  mealType: "food"
}

export type RecipeDiaryEntry = {
  id: Id
  date: IsoDateTimeString
  mealType: "recipe"
  recipeId: Id
  foods: Array<FoodAmount>
  // TODO: remove from state. Should only be used in the UI
  portions: number
}

export type DiaryEntry = FoodDiaryEntry | RecipeDiaryEntry

export type MealType = DiaryEntry["mealType"]
