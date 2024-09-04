import { Food, Id } from "../types.ts"
import { StateCreator } from "zustand"
import { nanoid } from "nanoid"
import { RootStore, RootStoreMutators } from "../store.ts"

const initialState: FoodsState = {
  foods: [
    {
      id: nanoid(),
      name: "Spaghetti",
      description: "",
      kcal: 270,

      carbs: 53,
      fat: 2.1,
      protein: 10,
      sugar: 0,
      fiber: 2.5,
    },
    {
      id: nanoid(),
      name: "Tomaten",
      description: "",
      kcal: 20,

      carbs: 4,
      fat: 0.3,
      protein: 1,
      sugar: 2.6,
      fiber: 1.2,
    },
  ],
}

type FoodsState = {
  foods: Array<Food>
}

export type FoodsSlice = FoodsState & {
  addFood: (newFood: Omit<Food, "id">) => Id
  editFood: (editedFood: Food) => void
  removeFood: (foodOrId: Food | Id) => void
}

export const createFoodsSlice: StateCreator<RootStore, RootStoreMutators, [], FoodsSlice> = (set) => ({
  ...initialState,
  addFood: (newFood) => {
    const id = nanoid()

    set((state) => {
      state.foods.push({
        id: id,
        ...newFood,
      })
    })
    return id
  },
  editFood: (editedFood) => {
    set((state) => ({
      foods: state.foods.map((food) => (food.id === editedFood.id ? editedFood : food)),
    }))
  },
  removeFood: (foodOrId) => {
    set((state) => {
      const id = typeof foodOrId === "string" ? foodOrId : foodOrId.id

      return {
        foods: state.foods.filter((food) => food.id !== id),
      }
    })
  },
})
