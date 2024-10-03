import { create } from "zustand"
import { createFoodsSlice, FoodsSlice } from "./foods/foods-slice.ts"
import { createRecipesSlice, RecipesSlice } from "./recipes/recipes-slice.ts"
import { immer } from "zustand/middleware/immer"
import { devtools, persist } from "zustand/middleware"
import { migrate } from "../storage.ts"
import { shared } from "../middlewares/broadcast.ts"
import { createSettingsSlice, SettingsSlice } from "./settings/settings-slice.ts"
import { createDiarySlice, DiarySlice } from "./diary/diary-slice.ts"

export type RootStore = FoodsSlice & RecipesSlice & SettingsSlice & DiarySlice

export type RootStoreMutators = [["zustand/devtools", never], ["zustand/immer", never], ["zustand/persist", unknown]]

export const useStore = create<RootStore, RootStoreMutators>(
  devtools(
    immer(
      shared(
        persist(
          (...a) => ({
            ...createFoodsSlice(...a),
            ...createRecipesSlice(...a),
            ...createSettingsSlice(...a),
            ...createDiarySlice(...a),
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
