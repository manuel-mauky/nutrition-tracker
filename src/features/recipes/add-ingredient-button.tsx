import { Button, Form, Modal, Text } from "rsuite"
import { PiPlusBold, PiWarningCircle } from "react-icons/pi"
import { useState } from "react"
import { useStore } from "../store.ts"
import { Id } from "../types.ts"
import { Controller, useForm } from "react-hook-form"
import { InputPickerField, NumberField } from "../../components/form-fields.tsx"
import { sortByName } from "../../utils/sort-utils.ts"

export type AddIngredientFormValue = {
  amount: number
  foodId: Id
}

type Props = {
  onAddIngredient(ingredient: AddIngredientFormValue): void
  existingFoods?: Array<Id>
}

export function AddIngredientButton({ onAddIngredient, existingFoods }: Props) {
  const [openAddDialog, setOpenAddDialog] = useState(false)

  const { foods } = useStore()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddIngredientFormValue>({
    defaultValues: {
      amount: 0,
      foodId: undefined,
    },
  })

  const onSubmit = handleSubmit((data) => {
    onAddIngredient(data)

    setOpenAddDialog(false)
    reset()
  })

  function handleOpen() {
    reset()
    setOpenAddDialog(true)
  }

  function handleClose() {
    setOpenAddDialog(false)
    reset()
  }

  const foodItems = foods.toSorted(sortByName()).map((food) => ({
    label: food.name,
    value: food.id,
  }))

  return (
    <>
      <Button startIcon={<PiPlusBold />} onClick={handleOpen}>
        Hinzufügen
      </Button>

      <Modal open={openAddDialog} onClose={handleClose} backdrop="static">
        <Modal.Header>
          <Modal.Title>Zutaten zu Rezept hinzufügen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="add-ingredient-form" fluid onSubmit={(_, event) => onSubmit(event)}>
            <Controller
              name="amount"
              rules={{
                validate: (value) => (value <= 0 ? "Menge muss größer als 1 gram sein" : undefined),
              }}
              control={control}
              render={({ field }) => (
                <NumberField label="Menge (in g)" autoFocus field={field} error={errors[field.name]?.message} />
              )}
            />
            <Controller
              name="foodId"
              control={control}
              rules={{
                required: "Lebensmittel ist erforderlich",
              }}
              render={({ field }) => {
                const alreadyIncludedIngredient = [...(existingFoods ?? [])].find((foodId) => foodId === field.value)

                const food = foods.find((food) => food.id === field.value)

                return (
                  <>
                    <InputPickerField
                      data={foodItems}
                      label="Lebensmittel"
                      field={field}
                      error={errors[field.name]?.message}
                    />

                    {alreadyIncludedIngredient && food && (
                      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        <PiWarningCircle size="30px" color="var(--rs-state-warning)" />
                        <Text>
                          {" "}
                          Die Zutat "{food.name}" ist bereits im Rezept enthalten. Möchtest du es nochmal hinzufügen?
                        </Text>
                      </div>
                    )}
                  </>
                )
              }}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button form="add-ingredient-form" type="submit">
            Ok
          </Button>
          <Button onClick={handleClose}>Abbrechen</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
