import { Id } from "../types.ts"
import { useStore } from "../store.ts"
import { Button, Modal } from "rsuite"

export function DeleteRecipeWarningDialog({
  recipeId,
  handleOk,
  handleCancel,
  open,
}: {
  recipeId: Id | undefined
  handleOk: () => void
  handleCancel: () => void
  open: boolean
}) {
  const { recipes } = useStore()

  if (!recipeId) {
    return null
  }

  const recipe = recipes.find((recipe) => recipe.id === recipeId)

  if (!recipe) {
    return null
  }

  return (
    <Modal open={open} role="alertdialog" backdrop="static" autoFocus>
      <Modal.Header>
        <Modal.Title>Rezept löschen?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Möchten Sie "{recipe.name}" wirklich löschen?</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleOk} appearance="primary">
          Ok
        </Button>
        <Button onClick={handleCancel} appearance="subtle">
          Abbrechen
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
