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
import { useStore } from "../../store.ts"
import { TranslationKey } from "../../../i18n.ts"
import { useTranslation } from "react-i18next"

const mealTypes: Array<{ label: TranslationKey; value: MealType }> = [
  {
    label: "domain.food",
    value: "food",
  },
  {
    label: "domain.recipe",
    value: "recipe",
  },
]

export function AddDiaryEntryDialog({ date }: { date: DateTime }) {
  const { t } = useTranslation()
  const formRef = useRef<FormRef>(null)

  const { addDiaryEntry } = useStore()

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
    addDiaryEntry({
      mealType: "recipe",
      date: time.toISO() ?? DateTime.now().toISO(),
      recipeId: data.recipeId,
      portions: data.portions,
      foods: data.foods,
    })

    setOpenDialog(false)
    reset()
  }

  function onSubmitAddFood(data: AddFoodFormData) {
    addDiaryEntry({
      mealType: "food",
      date: time.toISO() ?? DateTime.now().toISO(),
      foodId: data.foodId,
      amountInGram: data.amountInGram,
    })

    setOpenDialog(false)
    reset()
  }

  return (
    <>
      <Button startIcon={<PiPlusBold />} onClick={handleOpen} size="sm">
        {t("common.add")}
      </Button>

      <Modal open={openDialog} onClose={handleClose} backdrop="static">
        <Modal.Header>
          <Modal.Title>{t("diary.addDialogTitle")}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="add-diary-entry-dialog-root">
            <RadioGroup inline value={mealType} onChange={(value) => setMealType(value as MealType)}>
              {mealTypes.map((mealType) => (
                <Radio key={mealType.value} value={mealType.value}>
                  {t(mealType.label)}
                </Radio>
              ))}
            </RadioGroup>

            <FormGroup className="first-column">
              <Form.ControlLabel>{t("diary.whenLabel")}</Form.ControlLabel>

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
            {t("common.ok")}
          </Button>
          <Button onClick={handleClose}>{t("common.cancel")}</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
