import { Id } from "../types.ts"
import { useStore } from "../store.ts"
import { Button, Form, Modal } from "rsuite"
import { Controller, useForm } from "react-hook-form"
import { TextField } from "../../components/form-fields.tsx"
import { validateName } from "./foods-utils.ts"

export type CloneFoodFormValue = {
  newName: string
}

export function CloneFoodDialog({
  foodId,
  handleOk,
  handleCancel,
  open,
}: {
  foodId: Id
  handleOk: (newName: string) => void
  handleCancel: () => void
  open: boolean
}) {
  const { foods } = useStore()

  const food = foods.find((food) => food.id === foodId)

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CloneFoodFormValue>({
    defaultValues: {
      newName: food?.name,
    },
  })

  const onSubmit = handleSubmit((data) => {
    handleOk(data.newName)

    reset()
  })

  if (!food) {
    return null
  }

  function handleOnCancel() {
    reset()
    handleCancel()
  }

  return (
    <Modal open={open} role="dialog" backdrop="static" autoFocus>
      <Modal.Header>
        <Modal.Title>Lebensmittel klonen</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="clone-food-form" style={{
          marginBottom: "20px"
        }} fluid onSubmit={(_, event) => onSubmit(event)}>
          <Controller
            name="newName"
            control={control}
            rules={{
              required: "Name ist erforderlich",
              validate: (value) => validateName(value, foods),
            }}
            render={({ field }) => <TextField autoFocus label="Name" field={field} error={errors[field.name]?.message} />}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" type="submit" form="clone-food-form">
          Ok
        </Button>
        <Button appearance="subtle" onClick={handleOnCancel}>
          Abbrechen
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
