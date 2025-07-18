import { useState } from "react"
import { useStore } from "../store.ts"
import { Controller, useForm } from "react-hook-form"
import { Recipe } from "../types.ts"
import { Button, Form, Modal } from "rsuite"
import { PiPlusBold } from "react-icons/pi"
import { TextField } from "../../components/form-fields.tsx"
import { validateName } from "../utils.ts"
import { useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

type RecipeForm = Omit<Recipe, "ingredients">

export function AddRecipeDialog() {
  const { t } = useTranslation()
  const [openAddDialog, setOpenAddDialog] = useState(false)

  const navigate = useNavigate({ from: "/recipes" })

  const { addRecipe, recipes } = useStore()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RecipeForm>({
    defaultValues: {
      name: "",
      description: "",
      portions: 1,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    const newId = addRecipe(data)
    setOpenAddDialog(false)
    reset()
    await navigate({
      to: "/recipes/$recipeId",
      params: {
        recipeId: newId,
      },
    })
  })

  function handleOpen() {
    reset()
    setOpenAddDialog(true)
  }

  function handleClose() {
    setOpenAddDialog(false)
  }

  return (
    <>
      <Button startIcon={<PiPlusBold />} onClick={handleOpen}>
        {t("common.add")}
      </Button>
      <Modal open={openAddDialog} onClose={handleClose} backdrop="static">
        <Modal.Header>
          <Modal.Title>{t("recipes.addDialogTitle")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="add-recipe-form" fluid onSubmit={(_, event) => onSubmit(event)}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: t("common.validation.requiredName"),
                validate: (value) => validateName(value, recipes),
              }}
              render={({ field }) => (
                <TextField label={t("labels.name")} autoFocus field={field} error={errors[field.name]?.message} />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField label={t("common.description")} field={field} error={errors[field.name]?.message} />
              )}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button form="add-recipe-form" type="submit">
            {t("common.ok")}
          </Button>
          <Button onClick={handleClose}>{t("common.cancel")}</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
