import { Food } from "../types.ts"

export function validateName(value: string, foods: Array<Food>): string | undefined {
  const duplicate = foods.some((food) => food.name.trim() === value.trim())

  if (duplicate) {
    return "Name existiert bereits"
  } else {
    return undefined
  }
}
