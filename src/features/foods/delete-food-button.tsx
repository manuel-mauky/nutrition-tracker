import { Id } from "../types.ts"
import { Text } from "rsuite"
import { useStore } from "../store.ts"
import { DeleteEntityButton } from "../../components/delete-entity-button.tsx"
import { selectRecipesWithFood } from "./foods-slice.ts"
import { Link } from "@tanstack/react-router"

export function DeleteFoodButton({
  foodId,
  disabled = false,
  hideLabel = false,
}: {
  foodId: Id | undefined
  disabled?: boolean
  hideLabel?: boolean
}) {
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
      title="Lebensmittel löschen?"
      children={
        recipesWithFood.length > 0 ? (
          <>
            <Text>
              "{food.name}" wird noch {recipesWithFood.length === 1 ? "einem Rezept" : "einigen Rezepten"} verwendet.
              Wenn du das Lebensmittel löschst, wird es aus{" "}
              {recipesWithFood.length === 1 ? "diesem Rezept" : "diesen Rezepten"} entfernt.
            </Text>
            <Text>Rezepte:</Text>
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
