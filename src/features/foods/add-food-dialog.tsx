import { useState } from "react"
import { useStore } from "../store.ts"
import { Controller, useForm } from "react-hook-form"
import { Food } from "../types.ts"
import { Button, Form, Modal } from "rsuite"
import { PiPlusBold } from "react-icons/pi"
import { TextAreaField, TextField } from "../../components/form-fields.tsx"
import { FoodNutritionForm } from "./food-nutrition-form.tsx"
import { validateName } from "../utils.ts"

export function AddFoodDialog() {
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const { addFood, foods } = useStore()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Food>({
    defaultValues: {
      name: "",
      description: "",
      kcal: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
      fiber: 0,
      sugar: 0,
    },
  })

  function handleOpen() {
    reset()
    setOpenAddDialog(true)
  }

  function handleClose() {
    setOpenAddDialog(false)
  }

  const onSubmit = handleSubmit((data) => {
    addFood(data)
    setOpenAddDialog(false)
    reset()
  })

  return (
    <>
      <Button startIcon={<PiPlusBold />} onClick={handleOpen}>
        Hinzufügen
      </Button>
      <Modal open={openAddDialog} onClose={handleClose} backdrop="static">
        <Modal.Header>
          <Modal.Title>Lebensmittel hinzufügen</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="add-food-form" fluid onSubmit={(_, event) => onSubmit(event)}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name ist erforderlich",
                validate: (value) => validateName(value, foods),
              }}
              render={({ field }) => (
                <TextField autoFocus field={field} error={errors[field.name]?.message} label="Name" />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextAreaField label="Beschreibung" field={field} error={errors[field.name]?.message} />
              )}
            />

            <FoodNutritionForm control={control} errors={errors} />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button form="add-food-form" type="submit">
            Ok
          </Button>
          <Button onClick={handleClose}>Abbrechen</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
