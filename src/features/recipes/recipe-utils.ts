import { Food, Id, Ingredient, nutrientNames, Nutrients, Recipe, RecipeWithNutrients } from "../types.ts"
import { createSelector } from "reselect"
import { RootStore } from "../store.ts"

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
function calcNutrientForFood(food: Food, ingredient: Ingredient, key: keyof Nutrients): number {
  return Math.floor((food[key] / 100) * ingredient.amountInGram)
}

/**
 * Calculate the sum of all nutrients for a given recipe.
 *
 * @param foodsMap a map of all foods. This is needed to take the basic nutrient values for foods
 * @param recipe
 */
export function calcNutrients(foodsMap: Record<Id, Food>, recipe: Recipe): RecipeWithNutrients {
  // transform all ingredients to a list of nutrients.
  const nutrients: Array<Nutrients> = recipe.ingredients.map((ingredient) => {
    const food = foodsMap[ingredient.foodId]

    // for every nutrient we calculate the nutrient amount of that ingredient
    return nutrientNames.reduce((prev, nutrientName) => {
      const value = calcNutrientForFood(food, ingredient, nutrientName)
      return {
        ...prev,
        [nutrientName]: value,
      }
    }, {}) as Nutrients
  })

  // first need a record of nutrientName to 0 that is used
  // as a starting value for the next reduce step
  const initial = nutrientNames.reduce((prev, nutrientName) => {
    return {
      ...prev,
      [nutrientName]: 0,
    }
  }, {}) as Nutrients

  // now we can go through all nutrients and sum up all nutrient values to get the nutrients of the whole recipe
  const sumValues: Nutrients = nutrients.reduce((sumValues, nutrient) => {
    // for this, we go through all nutrientNames and sum up the values
    return nutrientNames.reduce((prev, nutrientName) => {
      return {
        ...prev,
        [nutrientName]: sumValues[nutrientName] + nutrient[nutrientName],
      }
    }, {}) as Nutrients
  }, initial)

  return {
    ...recipe,
    ...sumValues,
  }
}

export function createFoodsMap(foods: Array<Food>): Record<Id, Food> {
  return foods.reduce((prev, curr) => {
    return {
      ...prev,
      [curr.id]: curr,
    }
  }, {})
}

export const selectRecipesWithNutrients = createSelector(
  [(state: RootStore) => state.foods, (state: RootStore) => state.recipes],
  (foods, recipes) => {
    const foodsMap: Record<Id, Food> = createFoodsMap(foods)

    return recipes.map((recipe) => calcNutrients(foodsMap, recipe))
  },
)
