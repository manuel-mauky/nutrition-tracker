export type Id = string

export type Food = {
  id: Id
  name: string
  description: string

  kcal: number
  carbs: number
  fat: number
  protein: number

  fiber: number
  sugar: number
}

export type Recipe = {
  id: Id
  name: string
  description: string
}
