import { Entity, Id } from "../features/types.ts"
import { PropsWithChildren, useState } from "react"
import { Button, IconButton, Modal, Text } from "rsuite"
import { Icon } from "@rsuite/icons"
import { PiTrash } from "react-icons/pi"

export function DeleteEntityButton({
  entity,
  removeEntity,
  disabled = false,
  title,
  hideLabel = false,
  children,
}: PropsWithChildren<{
  entity: Entity
  removeEntity: (id: Id) => void
  disabled?: boolean
  title: string
  hideLabel?: boolean
}>) {
  const [open, setOpen] = useState(false)

  function handleDeleteButtonClicked() {
    setOpen(true)
  }

  function handleDeleteOk() {
    if (entity) {
      removeEntity(entity.id)
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
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children ?? <Text>Möchtest du "{entity.name}" wirklich löschen?</Text>}</Modal.Body>
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
