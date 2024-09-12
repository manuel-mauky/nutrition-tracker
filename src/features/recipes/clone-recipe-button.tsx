import { Id } from "../types.ts"
import { useStore } from "../store.ts"
import { validateName } from "../utils.ts"
import { useNavigate } from "@tanstack/react-router"
import { CloneEntityButton } from "../../components/clone-entity-button.tsx"

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

  if (!recipe) {
    return null
  }

  return (
    <CloneEntityButton
      disabled={disabled}
      entity={recipe}
      addEntity={addRecipe}
      onCloneSuccess={onCloneSuccess}
      validateNewName={(newName) => validateName(newName, recipes)}
      title="Rezepte klonen?"
    />
  )
}
