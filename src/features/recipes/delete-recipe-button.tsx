import { Id } from "../types.ts"
import { useStore } from "../store.ts"
import { DeleteEntityButton } from "../../components/delete-entity-button.tsx"
import { useTranslation } from "react-i18next"

export function DeleteRecipeButton({
  recipeId,
  disabled = false,
  hideLabel = false,
}: {
  recipeId: Id
  disabled?: boolean
  hideLabel?: boolean
}) {
  const { t } = useTranslation()
  const { recipes, removeRecipe } = useStore()

  if (!recipeId) {
    return null
  }

  const recipe = recipes.find((recipe) => recipe.id === recipeId)

  if (!recipe) {
    return null
  }

  return (
    <DeleteEntityButton
      hideLabel={hideLabel}
      disabled={disabled}
      entity={recipe}
      removeEntity={removeRecipe}
      title={t("recipes.deleteDialogTitle")}
    />
  )
}
