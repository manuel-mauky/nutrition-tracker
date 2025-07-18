import { Id, Recipe } from "../types.ts"
import { useStore } from "../store.ts"
import { useState } from "react"
import { Button, IconButton, Modal, Text } from "rsuite"
import { Icon } from "@rsuite/icons"
import { PiTrash } from "react-icons/pi"
import { useTranslation } from "react-i18next"

export function DeleteIngredientButton({
  recipe,
  ingredientId,
  disabled,
  hideLabel,
}: {
  recipe: Recipe
  ingredientId: Id | undefined
  disabled?: boolean
  hideLabel?: boolean
}) {
  const { t } = useTranslation()
  const { foods, editRecipe } = useStore()
  const [open, setOpen] = useState(false)

  if (!ingredientId) {
    return null
  }

  const ingredient = recipe.ingredients.find((ingredient) => ingredient.ingredientId === ingredientId)

  if (!ingredient) {
    return null
  }

  const food = foods.find((food) => food.id === ingredient.foodId)

  if (!food) {
    return null
  }

  function handleDeleteButtonClicked() {
    setOpen(true)
  }

  function handleDeleteOk() {
    const editedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.filter((ingredient) => ingredient.ingredientId !== ingredientId),
    }

    editRecipe(editedRecipe)

    setOpen(false)
  }

  function handleDeleteCancel() {
    setOpen(false)
  }

  return (
    <>
      <IconButton
        aria-label={t("common.delete")}
        icon={<Icon as={PiTrash} />}
        disabled={disabled}
        onClick={handleDeleteButtonClicked}
        children={hideLabel ? undefined : t("common.delete")}
      />
      <Modal open={open} role="alertdialog" backdrop="static" autoFocus>
        <Modal.Header>
          <Modal.Title>{t("recipes.deleteFoodFromRecipeDialogTitle")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Text>{t("recipes.deleteFoodFromRecipeDialogHint")}</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDeleteOk} appearance="primary">
            {t("common.ok")}
          </Button>
          <Button onClick={handleDeleteCancel} appearance="subtle">
            {t("common.cancel")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
