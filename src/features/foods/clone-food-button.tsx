import { Id } from "../types.ts"
import { useStore } from "../store.ts"
import { validateName } from "../utils.ts"
import { useNavigate } from "@tanstack/react-router"
import { CloneEntityButton } from "../../components/clone-entity-button.tsx"
import { useTranslation } from "react-i18next"

export function CloneFoodButton({ foodId, disabled = false }: { foodId: Id; disabled?: boolean }) {
  const { t } = useTranslation()
  const { foods, addFood } = useStore()
  const food = foods.find((food) => food.id === foodId)

  const navigate = useNavigate({ from: "/foods/$foodId" })

  async function onCloneSuccess(newId: Id) {
    await navigate({
      to: "/foods/$foodId",
      params: {
        foodId: newId,
      },
    })
  }

  if (!food) {
    return null
  }

  return (
    <CloneEntityButton
      disabled={disabled}
      entity={food}
      addEntity={addFood}
      onCloneSuccess={onCloneSuccess}
      validateNewName={(newName) => validateName(newName, foods)}
      title={t("foods.cloneDialogTitle")}
    />
  )
}
