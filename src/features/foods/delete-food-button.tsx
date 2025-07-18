import { Id } from "../types.ts"
import { Text } from "rsuite"
import { useStore } from "../store.ts"
import { DeleteEntityButton } from "../../components/delete-entity-button.tsx"
import { selectRecipesWithFood } from "./foods-slice.ts"
import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

export function DeleteFoodButton({
  foodId,
  disabled = false,
  hideLabel = false,
}: {
  foodId: Id | undefined
  disabled?: boolean
  hideLabel?: boolean
}) {
  const { t } = useTranslation()
  const { foods, removeFood } = useStore()

  const recipesWithFood = useStore(selectRecipesWithFood(foodId ?? ""))

  if (!foodId) {
    return null
  }

  const food = foods.find((food) => food.id === foodId)

  if (!food) {
    return null
  }

  return (
    <DeleteEntityButton
      disabled={disabled}
      hideLabel={hideLabel}
      entity={food}
      removeEntity={removeFood}
      title={t("foods.deleteDialogTitle")}
      children={
        recipesWithFood.length > 0 ? (
          <>
            <Text>
              {t("foods.deleteDialogReferencedRecipesHint", { foodName: food.name, count: recipesWithFood.length })}
            </Text>
            <Text>{t("foods.deleteDialogReferencedRecipesHeadline")}</Text>
            <ul>
              {recipesWithFood.map((recipe) => (
                <li key={recipe.id}>
                  <Link to={`/recipes/$recipeId`} params={{ recipeId: recipe.id }}>
                    {recipe.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : undefined
      }
    />
  )
}
