import { Button, Form, Modal, Text } from "rsuite"
import { PiPlusBold, PiWarningCircle } from "react-icons/pi"
import { useState } from "react"
import { useStore } from "../store.ts"
import { Id } from "../types.ts"
import { Controller, useForm } from "react-hook-form"
import { InputPickerField, NumberField } from "../../components/form-fields.tsx"
import { sortByName } from "../../utils/sort-utils.ts"
import { useTranslation } from "react-i18next"

export type AddIngredientFormValue = {
  amount: number
  foodId: Id
}

type Props = {
  onAddIngredient(ingredient: AddIngredientFormValue): void
  existingFoods?: Array<Id>
}

export function AddIngredientButton({ onAddIngredient, existingFoods }: Props) {
  const { t } = useTranslation()
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
        {t("common.add")}
      </Button>

      <Modal open={openAddDialog} onClose={handleClose} backdrop="static">
        <Modal.Header>
          <Modal.Title>{t("recipes.addFoodToRecipeDialogTitle")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="add-ingredient-form" fluid onSubmit={(_, event) => onSubmit(event)}>
            <Controller
              name="amount"
              rules={{
                validate: (value) => (value <= 0 ? t("common.validation.moreThenZeroGram") : undefined),
              }}
              control={control}
              render={({ field }) => (
                <NumberField
                  label={t("labels.amountInGram")}
                  autoFocus
                  field={field}
                  error={errors[field.name]?.message}
                />
              )}
            />
            <Controller
              name="foodId"
              control={control}
              rules={{
                required: t("common.validation.moreThenZeroNumber"),
              }}
              render={({ field }) => {
                const alreadyIncludedIngredient = [...(existingFoods ?? [])].find((foodId) => foodId === field.value)

                const food = foods.find((food) => food.id === field.value)

                return (
                  <>
                    <InputPickerField
                      data={foodItems}
                      label={t("domain.food")}
                      field={field}
                      error={errors[field.name]?.message}
                    />

                    {alreadyIncludedIngredient && food && (
                      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        <PiWarningCircle size="30px" color="var(--rs-state-warning)" />
                        <Text>{t("recipes.addIngredientFoodAlreadyAddedHint", { foodName: food.name })}</Text>
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
            {t("common.ok")}
          </Button>
          <Button onClick={handleClose}>{t("common.cancel")}</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
