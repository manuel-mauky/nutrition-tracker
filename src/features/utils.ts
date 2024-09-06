export function validateName(value: string, foods: Array<{ name: string }>): string | undefined {
  const duplicate = foods.some((food) => food.name.trim() === value.trim())

  if (duplicate) {
    return "Name existiert bereits"
  } else {
    return undefined
  }
}
