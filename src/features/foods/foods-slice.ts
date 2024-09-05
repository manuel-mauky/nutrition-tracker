import { Food, Id } from "../types.ts"
import { StateCreator } from "zustand"
import { nanoid } from "nanoid"
import { RootStore, RootStoreMutators } from "../store.ts"

import { foods } from "../../test-data.ts"

const initialState: FoodsState = {
  foods: [...foods],
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
