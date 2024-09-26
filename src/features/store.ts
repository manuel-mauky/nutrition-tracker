import { create } from "zustand"
import { createFoodsSlice, FoodsSlice } from "./foods/foods-slice.ts"
import { createRecipesSlice, RecipesSlice } from "./recipes/recipes-slice.ts"
import { immer } from "zustand/middleware/immer"
import { devtools, persist } from "zustand/middleware"
import { migrate } from "../storage.ts"
import { shared } from "../middlewares/broadcast.ts"

export type RootStore = FoodsSlice & RecipesSlice

export type RootStoreMutators = [["zustand/devtools", never], ["zustand/immer", never], ["zustand/persist", unknown]]

export const useStore = create<RootStore, RootStoreMutators>(
  devtools(
    immer(
      shared(
        persist(
          (...o) => ({
            ...createFoodsSlice(...o),
            ...createRecipesSlice(...o),
          }),
          {
            version: 1,
            name: "nutrition-tracker-storage",
            migrate: migrate,
          },
        ),
        {
          name: "nutrition-tracker-channel",
        },
      ),
    ),
  ),
)
