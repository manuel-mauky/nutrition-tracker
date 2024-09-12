import { Id, Recipe } from "../types.ts"
import { useStore } from "../store.ts"
import { Controller, useForm } from "react-hook-form"
import { Button, Form, IconButton, Modal } from "rsuite"
import { validateName } from "../utils.ts"
import { TextField } from "../../components/form-fields.tsx"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Icon } from "@rsuite/icons"
import { PiCopySimple } from "react-icons/pi"

export type CloneRecipeFormValue = {
  newName: string
}

export function CloneRecipeButton({ recipeId, disabled = false }: { recipeId: Id; disabled?: boolean }) {
  const navigate = useNavigate({ from: "/recipes/$recipeId" })

  const { recipes, addRecipe } = useStore()

  const recipe = recipes.find((recipe) => recipe.id === recipeId)

  const [open, setOpen] = useState(false)

  const defaultValues: Partial<CloneRecipeFormValue> = {
    newName: recipe?.name,
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CloneRecipeFormValue>({
    defaultValues,
  })

  const onSubmit = handleSubmit((data) => {
    handleCloneOk(data.newName).then(() => {
      reset()
    })
  })

  async function handleCloneOk(newName: string) {
    if (recipe) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = recipe

      const clone: Omit<Recipe, "id"> = {
        ...rest,
        name: newName,
      }

      const newId = addRecipe(clone)

      await navigate({
        to: "/recipes/$recipeId",
        params: {
          recipeId: newId,
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

  if (!recipe) {
    return null
  }

  return (
    <>
      <IconButton icon={<Icon as={PiCopySimple} />} disabled={disabled} onClick={handleCloneButtonClicked}>
        Klonen
      </IconButton>
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
          <Button appearance="subtle" onClick={handleCloneCancel}>
            Abbrechen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
