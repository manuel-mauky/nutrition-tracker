import { Entity, Id } from "../features/types.ts"
import { PropsWithChildren, useState } from "react"
import { Button, IconButton, Modal, Text } from "rsuite"
import { Icon } from "@rsuite/icons"
import { PiTrash } from "react-icons/pi"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
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
        aria-label={t("common.delete")}
        icon={<Icon as={PiTrash} />}
        disabled={disabled}
        onClick={handleDeleteButtonClicked}
        children={hideLabel ? undefined : t("common.delete")}
      />
      <Modal open={open} role="alertdialog" backdrop="static" autoFocus>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {children ?? <Text>{t("labels.entityDeleteSecurityQuestion", { entityName: entity.name })}</Text>}
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
