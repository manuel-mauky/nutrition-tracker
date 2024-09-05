export type Id = string

export type Nutrients = {
  kcal: number
  carbs: number
  fat: number
  protein: number

  fiber: number
  sugar: number
}

export type Food = Nutrients & {
  id: Id
  name: string
  description: string
}

export type Recipe = {
  id: Id
  name: string
  description: string
}
