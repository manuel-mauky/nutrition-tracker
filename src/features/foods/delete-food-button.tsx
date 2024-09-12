import { Id } from "../types.ts"
import { useStore } from "../store.ts"
import { Button, IconButton, Modal } from "rsuite"
import { Icon } from "@rsuite/icons"
import { PiTrash } from "react-icons/pi"
import { useState } from "react"

export function DeleteFoodButton({
  foodId,
  disabled = false,
  hideLabel = false,
}: {
  foodId: Id | undefined
  disabled?: boolean
  hideLabel?: boolean
}) {
  const [open, setOpen] = useState(false)

  const { foods, removeFood } = useStore()

  if (!foodId) {
    return null
  }

  const food = foods.find((food) => food.id === foodId)

  if (!food) {
    return null
  }

  function handleDeleteButtonClicked() {
    setOpen(true)
  }

  function handleDeleteOk() {
    if (food) {
      removeFood(food)
    }
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
          <Modal.Title>Lebensmittel löschen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Möchten Sie "{food.name}" wirklich löschen?</Modal.Body>
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
