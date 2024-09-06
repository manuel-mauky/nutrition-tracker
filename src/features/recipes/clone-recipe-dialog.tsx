import { Id } from "../types.ts"
import { useStore } from "../store.ts"
import { Controller, useForm } from "react-hook-form"
import { Button, Form, Modal } from "rsuite"
import { validateName } from "../utils.ts"
import { TextField } from "../../components/form-fields.tsx"

export type CloneRecipeFormValue = {
  newName: string
}

export function CloneRecipeDialog({
  recipeId,
  handleOk,
  handleCancel,
  open,
}: {
  recipeId: Id
  handleOk: (newName: string) => void
  handleCancel: () => void
  open: boolean
}) {
  const { recipes } = useStore()

  const recipe = recipes.find((recipe) => recipe.id === recipeId)

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CloneRecipeFormValue>({
    defaultValues: {
      newName: recipe?.name,
    },
  })

  const onSubmit = handleSubmit((data) => {
    handleOk(data.newName)

    reset()
  })

  function handleOnCancel() {
    reset()
    handleCancel()
  }

  if (!recipe) {
    return null
  }

  return (
    <Modal open={open} role="dialog" backdrop="static" autoFocus>
      <Modal.Header>
        <Modal.Title>Rezepte klonen</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          id="clone-recipe-form"
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
              validate: (value) => validateName(value, recipes),
            }}
            render={({ field }) => (
              <TextField autoFocus label="Name" field={field} error={errors[field.name]?.message} />
            )}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" type="submit" form="clone-recipe-form">
          Ok
        </Button>
        <Button appearance="subtle" onClick={handleOnCancel}>
          Abbrechen
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
