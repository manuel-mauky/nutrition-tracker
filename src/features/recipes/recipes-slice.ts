import { Id, Recipe } from "../types.ts"
import { nanoid } from "nanoid"
import { StateCreator } from "zustand"
import { RootStore, RootStoreMutators } from "../store.ts"
import { recipes } from "../../test-data.ts"

const initialState: RecipesState = {
  recipes: [...recipes],
}

type RecipesState = {
  recipes: Array<Recipe>
}

export type RecipesSlice = RecipesState & {
  addRecipe: (newRecipe: Omit<Recipe, "id" | "ingredients">) => Id
  editRecipe: (editedRecipe: Recipe) => void
  removeRecipe: (recipeOrId: Recipe | Id) => void
}

export const createRecipesSlice: StateCreator<RootStore, RootStoreMutators, [], RecipesSlice> = (set) => ({
  ...initialState,
  addRecipe: (newRecipe) => {
    const id = nanoid()
    set((state) => {
      state.recipes.push({
        id: id,
        ingredients: [],
        ...newRecipe,
      })
    })
    return id
  },
  editRecipe: (editedRecipe) =>
    set((state) => ({
      recipes: state.recipes.map((recipe) => (recipe.id === editedRecipe.id ? editedRecipe : recipe)),
    })),
  removeRecipe: (recipeOrId) =>
    set((state) => {
      const id = typeof recipeOrId === "string" ? recipeOrId : recipeOrId.id

      return {
        recipes: state.recipes.filter((recipe) => recipe.id !== id),
      }
    }),
})
