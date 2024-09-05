import { seed, randUuid } from "@ngneat/falso"
import { Food, Recipe } from "./features/types.ts"

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

export const recipes: Array<Recipe> = [
  {
    id: randUuid(),
    name: "Bolognese",
    description: "",
    ingredients: [
      {
        foodId: tomatos.id,
        amountInGram: 400,
      },
      {
        foodId: tofu.id,
        amountInGram: 200,
      },
      {
        foodId: oliveOil.id,
        amountInGram: 25,
      },
    ],
  },
  {
    id: randUuid(),
    name: "Tomatensalat",
    description: "",
    ingredients: [
      {
        foodId: tomatos.id,
        amountInGram: 300,
      },
      {
        foodId: oliveOil.id,
        amountInGram: 20,
      },
    ],
  },
]

console.log("testData", {
  foods,
  recipes,
})
