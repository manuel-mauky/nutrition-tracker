import { StateCreator } from "zustand"
import { RootStore, RootStoreMutators } from "../store.ts"
import { SortType } from "rsuite-table"
import { FoodColumn } from "../foods/foods-table.tsx"
import { RecipeColumn } from "../recipes/recipes-table.tsx"
import { IngredientColumn } from "../recipes/ingredient-table.tsx"
import { CustomProviderProps } from "rsuite"
import { defaultLanguage, Language } from "../../i18n.ts"

type SortSettings<T extends string> = {
  sortColumn: T | undefined
  sortType: SortType | undefined
}

type SortFeatures = "recipes" | "foods" | "recipeIngredients"

type SettingsState = {
  theme: CustomProviderProps["theme"]
  language: Language
  settings: {
    sorting: {
      recipes: SortSettings<RecipeColumn["key"]>
      foods: SortSettings<FoodColumn["key"]>
      recipeIngredients: SortSettings<IngredientColumn["key"]>
    }
  }
}

const initialSortSettings: SortSettings<never> = {
  sortType: undefined,
  sortColumn: undefined,
}

const initialState: SettingsState = {
  theme: "light",
  language: defaultLanguage,
  settings: {
    sorting: {
      foods: initialSortSettings,
      recipes: initialSortSettings,
      recipeIngredients: initialSortSettings,
    },
  },
}

export type SettingsSlice = SettingsState & {
  changeTheme: (newTheme: SettingsState["theme"]) => void
  changeLanguage: (newLanguage: Language) => void
  changeSortSettings: <T extends SortFeatures>(
    sortFeature: T,
    newSettings: SettingsState["settings"]["sorting"][T],
  ) => void
}

export const createSettingsSlice: StateCreator<RootStore, RootStoreMutators, [], SettingsSlice> = (set) => ({
  ...initialState,
  changeSortSettings: (sortFeature, newSettings) =>
    set((state) => {
      state.settings.sorting[sortFeature] = newSettings
    }),
  changeTheme: (newTheme) =>
    set((state) => {
      state.theme = newTheme
    }),
  changeLanguage: (newLanguage) =>
    set((state) => {
      state.language = newLanguage
    }),
})

export function selectSortSettings<T extends SortFeatures>(sortFeature: T) {
  return function (rootState: RootStore) {
    const sortSettings = rootState.settings.sorting[sortFeature]

    return {
      ...sortSettings,
      changeSortSettings: (newSetting: SettingsState["settings"]["sorting"][T]) =>
        rootState.changeSortSettings(sortFeature, newSetting),
    }
  }
}
