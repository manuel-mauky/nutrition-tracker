import { Food, Id } from "../types.ts"
import { useStore } from "../store.ts"
import { Button, Form, IconButton, Modal } from "rsuite"
import { Controller, useForm } from "react-hook-form"
import { TextField } from "../../components/form-fields.tsx"
import { validateName } from "../utils.ts"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Icon } from "@rsuite/icons"
import { PiCopySimple } from "react-icons/pi"

export type CloneFoodFormValue = {
  newName: string
}

export function CloneFoodButton({ foodId, disabled = false }: { foodId: Id; disabled?: boolean }) {
  const { foods, addFood } = useStore()

  const navigate = useNavigate({ from: "/foods/$foodId" })

  const [open, setOpen] = useState(false)

  const food = foods.find((food) => food.id === foodId)

  const defaultValues: Partial<CloneFoodFormValue> = {
    newName: food?.name,
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CloneFoodFormValue>({
    defaultValues,
  })

  const onSubmit = handleSubmit((data) => {
    handleCloneOk(data.newName).then(() => {
      reset()
    })
  })

  async function handleCloneOk(newName: string) {
    if (food) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = food

      const clone: Omit<Food, "id"> = {
        ...rest,
        name: newName,
      }

      const newId = addFood(clone)

      await navigate({
        to: "/foods/$foodId",
        params: {
          foodId: newId,
        },
      })
    }

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

  if (!food) {
    return null
  }

  return (
    <>
      <IconButton icon={<Icon as={PiCopySimple} />} disabled={disabled} onClick={handleCloneButtonClicked}>
        Klonen
      </IconButton>
      <Modal open={open} role="dialog" backdrop="static" autoFocus>
        <Modal.Header>
          <Modal.Title>Lebensmittel klonen</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            id="clone-food-form"
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
                validate: (value) => validateName(value, foods),
              }}
              render={({ field }) => (
                <TextField autoFocus label="Name" field={field} error={errors[field.name]?.message} />
              )}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" type="submit" form="clone-food-form">
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
