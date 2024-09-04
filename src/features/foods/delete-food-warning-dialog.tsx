import { Id } from "../types.ts"
import { useStore } from "../store.ts"
import { Button, Modal } from "rsuite"

export function DeleteFoodWarningDialog({
  foodId,
  handleOk,
  handleCancel,
  open = false,
}: {
  foodId: Id | undefined
  handleOk: () => void
  handleCancel: () => void
  open: boolean
}) {
  const { foods } = useStore()

  if (!foodId) {
    return null
  }

  const food = foods.find((food) => food.id === foodId)

  if (!food) {
    return null
  }

  return (
    <Modal open={open} role="alertdialog" backdrop="static" autoFocus>
      <Modal.Header>
        <Modal.Title>Lebensmittel löschen?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Möchten Sie "{food.name}" wirklich löschen?</Modal.Body>
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
