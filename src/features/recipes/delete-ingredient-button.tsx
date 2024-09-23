import { Id, Recipe } from "../types.ts"
import { useStore } from "../store.ts"
import { useState } from "react"
import { Button, IconButton, Modal, Text } from "rsuite"
import { Icon } from "@rsuite/icons"
import { PiTrash } from "react-icons/pi"

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
        aria-label="Löschen"
        icon={<Icon as={PiTrash} />}
        disabled={disabled}
        onClick={handleDeleteButtonClicked}
        children={hideLabel ? undefined : "Löschen"}
      />
      <Modal open={open} role="alertdialog" backdrop="static" autoFocus>
        <Modal.Header>
          <Modal.Title>Zutat löschen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Text>
            Möchtest du die Zutat "{food.name}" wirklich aus dem Rezept "{recipe.name}" löschen?
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDeleteOk} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleDeleteCancel} appearance="subtle">
            Abbrechen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
