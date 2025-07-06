import { seed, randUuid, randBoolean, randNumber } from "@ngneat/falso"
import {
  DiaryEntry,
  Food,
  FoodAmount,
  FoodDiaryEntry,
  IsoDateString,
  Recipe,
  RecipeDiaryEntry,
} from "./features/types.ts"
import { DateTime } from "luxon"

seed("1")

const spaghetti: Food = {
  id: randUuid(),
  name: "Spaghetti",
  description: "Italienische Pasta",
  kcal: 270,

  carbs: 53,
  fat: 2.1,
  protein: 10,
  sugar: 0,
  fiber: 2.5,
}

const tomatos: Food = {
  id: randUuid(),
  name: "Tomaten",
  description: "",
  kcal: 20,

  carbs: 4,
  fat: 0.3,
  protein: 1,
  sugar: 2.6,
  fiber: 1.2,
}

const oliveOil: Food = {
  id: randUuid(),
  name: "Olivenöl",
  description: "",
  kcal: 857,

  carbs: 0,
  fat: 91.5,
  protein: 0,
  sugar: 0,
  fiber: 0,
}

const tofu: Food = {
  id: randUuid(),
  name: "Tofu",
  description: "",

  kcal: 137,
  carbs: 0.5,
  fat: 8,
  protein: 15,
  sugar: 0,
  fiber: 0,
}

export const foods: Array<Food> = [spaghetti, tomatos, oliveOil, tofu]

const bolognese = {
  id: randUuid(),
  name: "Bolognese",
  description: "",
  portions: 2,
  ingredients: [
    {
      ingredientId: randUuid(),
      foodId: tomatos.id,
      amountInGram: 400,
    },
    {
      ingredientId: randUuid(),
      foodId: tofu.id,
      amountInGram: 200,
    },
    {
      ingredientId: randUuid(),
      foodId: oliveOil.id,
      amountInGram: 25,
    },
  ],
}

const tomatensalat = {
  id: randUuid(),
  name: "Tomatensalat",
  description: "",
  portions: 1.5,
  ingredients: [
    {
      ingredientId: randUuid(),
      foodId: tomatos.id,
      amountInGram: 300,
    },
    {
      ingredientId: randUuid(),
      foodId: oliveOil.id,
      amountInGram: 20,
    },
  ],
}

export const recipes: Array<Recipe> = [bolognese, tomatensalat]

function generateDiaryEntries(): Record<IsoDateString, Array<DiaryEntry>> {
  const maxDate = DateTime.now()
  const minDate = maxDate.minus({ day: 30 })

  let tmpDate = minDate

  const result: Record<IsoDateString, Array<DiaryEntry>> = {}

  while (tmpDate < maxDate) {
    const list: Array<DiaryEntry> = []
    result[tmpDate.toISODate()!] = list

    for (let i = 0; i < 5; i++) {
      const date = tmpDate
        .set({
          hour: randNumber({ min: 8, max: 20 }),
          minute: randNumber({ min: 0, max: 59 }),
        })
        .toISO()!

      if (randBoolean()) {
        const i = randNumber({ min: 0, max: foods.length - 1 })
        const food = foods[i]

        const foodEntry: FoodDiaryEntry = {
          id: randUuid(),
          mealType: "food",
          date,
          amountInGram: randNumber({ min: 10, max: 200, precision: 10 }),
          foodId: food.id,
        }

        list.push(foodEntry)
      } else {
        const i = randNumber({ min: 0, max: recipes.length - 1 })
        const recipe = recipes[i]

        const foods: Array<FoodAmount> = recipe.ingredients.map((ingredient) => ({
          foodId: ingredient.foodId,
          amountInGram: ingredient.amountInGram,
        }))

        const recipeEntry: RecipeDiaryEntry = {
          id: randUuid(),
          mealType: "recipe",
          date,
          recipeId: recipe.id,
          foods,
          portions: randNumber({ min: 0.5, max: 1.5, precision: 0.5 }),
        }

        list.push(recipeEntry)
      }
    }

    tmpDate = tmpDate.plus({ days: 1 })
  }

  return result
}

export const diaryEntries = generateDiaryEntries()
