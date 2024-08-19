import { create } from "zustand"
import { createFoodsSlice, FoodsSlice } from "./foods/foods-slice.ts"
import { createRecipesSlice, RecipesSlice } from "./recipes/recipes-slice.ts"
import { immer } from "zustand/middleware/immer"
import { devtools, persist } from "zustand/middleware"

export type RootStore = FoodsSlice & RecipesSlice

export type RootStoreMutators = [["zustand/devtools", never], ["zustand/immer", never], ["zustand/persist", unknown]]

export const useStore = create<RootStore, RootStoreMutators>(
  devtools(
    immer(
      persist(
        (...a) => ({
          ...createFoodsSlice(...a),
          ...createRecipesSlice(...a),
        }),
        {
          name: "nutrition-tracker-storage",
        },
      ),
    ),
  ),
)
