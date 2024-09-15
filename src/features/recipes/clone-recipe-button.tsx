import { Id, Recipe } from "../types.ts"
import { useStore } from "../store.ts"
import { validateName } from "../utils.ts"
import { useNavigate } from "@tanstack/react-router"
import { CloneEntityButton } from "../../components/clone-entity-button.tsx"
import { nanoid } from "nanoid"

export function CloneRecipeButton({ recipeId, disabled = false }: { recipeId: Id; disabled?: boolean }) {
  const navigate = useNavigate({ from: "/recipes/$recipeId" })

  const { recipes, addRecipe } = useStore()

  const recipe = recipes.find((recipe) => recipe.id === recipeId)

  async function onCloneSuccess(newId: Id) {
    await navigate({
      to: "/recipes/$recipeId",
      params: {
        recipeId: newId,
      },
    })
  }

  function cloneRecipe(recipe: Omit<Recipe, "id">): string {
    // all ingredient-ids in the clone need to be re-created
    const clonedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => {
        return {
          ...ingredient,
          ingredientId: nanoid(),
        }
      }),
    }

    return addRecipe(clonedRecipe)
  }

  if (!recipe) {
    return null
  }

  return (
    <CloneEntityButton
      disabled={disabled}
      entity={recipe}
      addEntity={cloneRecipe}
      onCloneSuccess={onCloneSuccess}
      validateNewName={(newName) => validateName(newName, recipes)}
      title="Rezepte klonen?"
    />
  )
}
