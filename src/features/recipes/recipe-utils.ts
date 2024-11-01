import {
  DiaryEntry,
  Food,
  FoodAmount,
  Id,
  IsoDateString,
  nutrientNames,
  Nutrients,
  Recipe,
  RecipeWithNutrients,
} from "../types.ts"
import { createSelector } from "reselect"
import { RootStore } from "../store.ts"
import { DateTime } from "luxon"

export const emptyNutrients: Nutrients = nutrientNames.reduce(
  (nutrients, nutrientName) => ({
    ...nutrients,
    [nutrientName]: 0,
  }),
  {} as Nutrients,
)

/**
 * Calculate a specific nutrient (by key) for a given ingredient.
 * In food, nutrients are persisted in amount by 100g.
 * In recipes the amount is defined by ingredients.
 * This function calculates the nutrient amount for this ingredient
 *
 * @param food
 * @param ingredient
 * @param key
 */
function calcNutrientForFood(food: Food, ingredient: FoodAmount, key: keyof Nutrients): number {
  return Math.floor((food[key] / 100) * ingredient.amountInGram)
}

export function calcNutrientsForIngredient(foodsMap: Record<Id, Food>, ingredient: FoodAmount): Nutrients {
  const food = foodsMap[ingredient.foodId]

  // for every nutrient we calculate the nutrient amount of that ingredient
  return nutrientNames.reduce((prev, nutrientName) => {
    const value = calcNutrientForFood(food, ingredient, nutrientName)
    return {
      ...prev,
      [nutrientName]: value,
    }
  }, {}) as Nutrients
}

export function sumNutrients(nutrients: Array<Nutrients>, portions: number = 1): Nutrients {
  // now we can go through all nutrients and sum up all nutrient values to get the nutrients of the whole recipe
  return nutrients.reduce((sumValues, nutrient) => {
    // for this, we go through all nutrientNames and sum up the values
    return nutrientNames.reduce((prev, nutrientName) => {
      return {
        ...prev,
        [nutrientName]: sumValues[nutrientName] + nutrient[nutrientName] * portions,
      }
    }, {}) as Nutrients
  }, emptyNutrients)
}

/**
 * Calculate the sum of all nutrients for a given recipe.
 *
 * @param foodsMap a map of all foods. This is needed to take the basic nutrient values for foods
 * @param recipe
 * @param portions (optional) number of portions
 */
export function calcNutrients(foodsMap: Record<Id, Food>, recipe: Recipe, portions: number = 1): RecipeWithNutrients {
  // transform all ingredients to a list of nutrients.
  const nutrients: Array<Nutrients> = recipe.ingredients.map((ingredient) =>
    calcNutrientsForIngredient(foodsMap, ingredient),
  )

  const sumValues: Nutrients = sumNutrients(nutrients, portions)

  return {
    ...recipe,
    ...sumValues,
  }
}

export function createFoodsMap(foods: Array<Food>): Record<Id, Food> {
  return foods.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.id]: curr,
    }),
    {},
  )
}

export function createRecipesMap(recipes: Array<Recipe>): Record<Id, Recipe> {
  return recipes.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.id]: curr,
    }),
    {},
  )
}

export const selectRecipesWithNutrients = createSelector(
  [(state: RootStore) => state.foods, (state: RootStore) => state.recipes],
  (foods, recipes) => {
    const foodsMap: Record<Id, Food> = createFoodsMap(foods)

    return recipes.map((recipe) => calcNutrients(foodsMap, recipe))
  },
)

/**
 * Calculate the sum of all nutritions of one specific day.
 *
 * @param foodsMap
 * @param recipesMap
 * @param diaryEntries
 * @param day
 */
export function calcNutrientsOfDay(
  foodsMap: Record<Id, Food>,
  recipesMap: Record<Id, Recipe>,
  diaryEntries: Record<IsoDateString, Array<DiaryEntry>>,
  day: DateTime,
): Nutrients {
  const isoDate = day.toISODate()
  if (!isoDate) {
    return emptyNutrients
  }

  const diaryEntriesOfDay = diaryEntries[isoDate] ?? []

  return diaryEntriesOfDay.reduce((nutrients, entry) => {
    let newNutrients: Nutrients = emptyNutrients

    if (entry.mealType === "food") {
      newNutrients = calcNutrientsForIngredient(foodsMap, entry)
    } else if (entry.mealType === "recipe") {
      const recipeWithNutrients = calcNutrients(foodsMap, recipesMap[entry.recipeId])

      newNutrients = {
        kcal: recipeWithNutrients.kcal,
        protein: recipeWithNutrients.protein,
        fat: recipeWithNutrients.fat,
        carbs: recipeWithNutrients.carbs,
        sugar: recipeWithNutrients.sugar,
        fiber: recipeWithNutrients.fiber,
      }
    }

    return {
      ...sumNutrients([nutrients, newNutrients]),
    }
  }, emptyNutrients)
}
