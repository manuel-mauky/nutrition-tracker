import { DateTime } from "luxon"
import { useMemo, useRef, useState } from "react"
import { Button, Form, Modal, Radio, RadioGroup, TimePicker } from "rsuite"
import { PiPlusBold } from "react-icons/pi"
import { MealType } from "../../types.ts"
import { FormRef } from "./types.ts"
import { AddRecipeEntryForm, AddRecipeFormData } from "./add-recipe-entry-form.tsx"
import { AddFoodEntryForm, AddFoodFormData } from "./add-food-entry-form.tsx"
import FormGroup from "rsuite/FormGroup"
import "./add-diary-entry.css"

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

export function AddDiaryEntryDialog({ date }: { date: DateTime }) {
  const formRef = useRef<FormRef>(null)

  const [openDialog, setOpenDialog] = useState(false)

  const [mealType, setMealType] = useState<MealType>("recipe")

  const now = useMemo(() => {
    return DateTime.now()
  }, [])

  const [time, setTime] = useState(() => {
    return date.set({
      hour: now.hour,
      minute: now.minute,
    })
  })

  function reset() {
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  function handleOpen() {
    reset()
    setOpenDialog(true)
  }

  function handleClose() {
    setOpenDialog(false)
  }

  function onSubmitAddRecipe(data: AddRecipeFormData) {
    console.log("submit recipe", {
      time: time.toISO(),
      ...data,
    })

    setOpenDialog(false)
    reset()
  }

  function onSubmitAddFood(data: AddFoodFormData) {
    console.log("submit food", {
      time: time.toISO(),
      ...data,
    })
    reset()
  }

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
          <div className="add-diary-entry-dialog-root">
            <RadioGroup inline value={mealType} onChange={(value) => setMealType(value as MealType)}>
              {mealTypes.map((mealType) => (
                <Radio key={mealType.value} value={mealType.value}>
                  {mealType.label}
                </Radio>
              ))}
            </RadioGroup>

            <FormGroup className="first-column">
              <Form.ControlLabel>Wann?</Form.ControlLabel>

              <TimePicker
                cleanable={false}
                hideMinutes={(minute) => minute % 5 !== 0}
                value={time.toJSDate()}
                onChange={(jsDate) => (jsDate ? setTime(DateTime.fromJSDate(jsDate)) : now)}
              />
            </FormGroup>
            {mealType === "recipe" && (
              <AddRecipeEntryForm ref={formRef} formId="add-diary-entry-form" onSubmit={onSubmitAddRecipe} />
            )}
            {mealType === "food" && (
              <AddFoodEntryForm ref={formRef} formId="add-diary-entry-form" onSubmit={onSubmitAddFood} />
            )}
          </div>
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
