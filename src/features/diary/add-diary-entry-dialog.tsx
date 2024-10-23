import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import { Button, Form, Modal, Radio, RadioGroup } from "rsuite"
import { PiPlusBold } from "react-icons/pi"
import { Controller, useForm } from "react-hook-form"
import { FoodDiaryEntry, MealType, RecipeDiaryEntry } from "../types.ts"
import { TimePickerField } from "../../components/form-fields.tsx"

const mealTypes: Array<{ label: string; value: MealType }> = [
  {
    label: "Lebensmittel",
    value: "food",
  },
  {
    label: "Rezept",
    value: "recipe",
  },
]

type AddFoodFormData = Omit<FoodDiaryEntry, "id" | "date"> & {
  time: DateTime
}

type AddRecipeFormData = Omit<RecipeDiaryEntry, "id" | "date"> & {
  time: DateTime
}

type AddEntryFormData = AddFoodFormData | AddRecipeFormData

export function AddDiaryEntryDialog({ date }: { date: DateTime }) {
  const [openDialog, setOpenDialog] = useState(false)

  const [mealType, setMealType] = useState<MealType>("recipe")

  const now = useMemo(() => {
    return DateTime.now()
  }, [])

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddEntryFormData>({
    defaultValues: {
      mealType: "recipe",
      time: date.set({
        hour: now.hour,
        minute: now.minute,
      }),
    },
  })

  function handleOpen() {
    reset()
    setOpenDialog(true)
  }

  function handleClose() {
    setOpenDialog(false)
  }

  const onSubmit = handleSubmit((data) => {
    console.log("onSubmit", data)
    setOpenDialog(false)
    reset()
  })

  return (
    <>
      <Button startIcon={<PiPlusBold />} onClick={handleOpen} size="sm">
        Hinzufügen
      </Button>

      <Modal open={openDialog} onClose={handleClose} backdrop="static">
        <Modal.Header>
          <Modal.Title>Tagebucheintrag hinzufügen</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="add-diary-entry-form" fluid onSubmit={(_, event) => onSubmit(event)}>
            <RadioGroup inline value={mealType} onChange={(value) => setMealType(value as MealType)}>
              {mealTypes.map((mealType) => (
                <Radio key={mealType.value} value={mealType.value}>
                  {mealType.label}
                </Radio>
              ))}
            </RadioGroup>

            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TimePickerField label="Wann?" error={errors[field.name]?.message} field={field} />
              )}
            />

            {mealType === "recipe" && <></>}
            {mealType === "food" && <></>}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button form="add-diary-entry-form" type="submit">
            Ok
          </Button>
          <Button onClick={handleClose}>Abbrechen</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
