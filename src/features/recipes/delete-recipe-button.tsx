import { Icon } from "@rsuite/icons"
import { PiTrash } from "react-icons/pi"
import { Button, IconButton, Modal } from "rsuite"
import { Id } from "../types.ts"
import { useState } from "react"
import { useStore } from "../store.ts"

export function DeleteRecipeButton({ recipeId, disabled = false }: { recipeId: Id; disabled?: boolean }) {
  const [open, setOpen] = useState(false)

  const { recipes, removeRecipe } = useStore()

  if (!recipeId) {
    return null
  }

  const recipe = recipes.find((recipe) => recipe.id === recipeId)

  if (!recipe) {
    return null
  }

  function handleDeleteButtonClicked() {
    setOpen(true)
  }

  function handleDeleteOk() {
    if (recipe) {
      removeRecipe(recipe)
    }
    setOpen(false)
  }

  function handleDeleteCancel() {
    setOpen(false)
  }

  return (
    <>
      <IconButton icon={<Icon as={PiTrash} />} disabled={disabled} onClick={handleDeleteButtonClicked}>
        Löschen
      </IconButton>
      <Modal open={open} role="alertdialog" backdrop="static" autoFocus>
        <Modal.Header>
          <Modal.Title>Rezept löschen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Möchten Sie "{recipe.name}" wirklich löschen?</Modal.Body>
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
