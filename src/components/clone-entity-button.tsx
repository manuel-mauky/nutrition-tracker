import { Entity, Id } from "../features/types.ts"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Icon } from "@rsuite/icons"
import { PiCopySimple } from "react-icons/pi"
import { Button, Form, IconButton, Modal } from "rsuite"
import { TextField } from "./form-fields.tsx"

type CloneFormValue = {
  newName: string
}

type Props<T extends Entity> = {
  entity: T
  addEntity: (entity: Omit<T, "id">) => Id
  onCloneSuccess: (newId: Id) => Promise<void>
  validateNewName: (newName: string) => string | undefined
  disabled?: boolean
  title: string
}

export function CloneEntityButton<T extends Entity>({
  entity,
  addEntity,
  onCloneSuccess,
  disabled,
  title,
  validateNewName,
}: Props<T>) {
  const [open, setOpen] = useState(false)

  const defaultValues: Partial<CloneFormValue> = {
    newName: entity.name,
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CloneFormValue>({
    defaultValues,
  })

  const onSubmit = handleSubmit((data) => {
    handleCloneOk(data.newName).then(() => {
      reset()
    })
  })

  async function handleCloneOk(newName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = entity

    const clone: Omit<T, "id"> = {
      ...rest,
      name: newName,
    }

    const newId = addEntity(clone)

    onCloneSuccess(newId)

    setOpen(false)
  }

  function handleCloneCancel() {
    reset()
    setOpen(false)
  }

  function handleCloneButtonClicked() {
    reset(defaultValues)
    setOpen(true)
  }

  return (
    <>
      <IconButton icon={<Icon as={PiCopySimple} />} disabled={disabled} onClick={handleCloneButtonClicked}>
        Klonen
      </IconButton>
      <Modal open={open} role="dialog" backdrop="static" autoFocus>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            id="clone-form"
            style={{
              marginBottom: "20px",
            }}
            fluid
            onSubmit={(_, event) => onSubmit(event)}
          >
            <Controller
              name="newName"
              control={control}
              rules={{
                required: "Name ist erforderlich",
                validate: validateNewName,
              }}
              render={({ field }) => (
                <TextField autoFocus label="Name" field={field} error={errors[field.name]?.message} />
              )}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" type="submit" form="clone-form">
            Ok
          </Button>
          <Button appearance="subtle" onClick={handleCloneCancel}>
            Abbrechen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
