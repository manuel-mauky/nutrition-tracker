import { Id } from "../types.ts"
import { useStore } from "../store.ts"
import { DeleteEntityButton } from "../../components/delete-entity-button.tsx"

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
    />
  )
}
