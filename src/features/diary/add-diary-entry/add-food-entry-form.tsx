import { FoodDiaryEntry } from "../../types.ts"
import { forwardRef, useImperativeHandle, useMemo } from "react"
import { FormRef } from "./types.ts"
import { useStore } from "../../store.ts"
import { Controller, useForm } from "react-hook-form"
import { Form } from "rsuite"
import { InputPickerField, NumberField } from "../../../components/form-fields.tsx"
import { sortByName } from "../../../utils/sort-utils.ts"
import { useTranslation } from "react-i18next"

export type AddFoodFormData = Omit<FoodDiaryEntry, "id" | "date" | "mealType">

export const AddFoodEntryForm = forwardRef<
  FormRef,
  {
    formId: string
    onSubmit: (data: AddFoodFormData) => void
  }
>(function AddFoodEntryForm({ formId, onSubmit }, ref) {
  const { t } = useTranslation()
  const { foods } = useStore()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddFoodFormData>({
    defaultValues: {
      amountInGram: 100,
    },
  })

  useImperativeHandle(ref, () => ({
    reset,
  }))

  const foodItems = useMemo(
    () =>
      foods.toSorted(sortByName()).map((food) => ({
        label: food.name,
        value: food.id,
      })),
    [foods],
  )

  const onSubmitHandler = handleSubmit((data) => {
    onSubmit(data)
    reset()
  })

  return (
    <Form id={formId} fluid onSubmit={(_, event) => onSubmitHandler(event)}>
      <Controller
        name="amountInGram"
        control={control}
        rules={{
          validate: (value) => (value <= 0 ? t("common.validation.moreThenZeroGram") : undefined),
        }}
        render={({ field }) => (
          <NumberField
            className="first-column"
            step={0.1}
            label={t("labels.amountInGram")}
            field={field}
            error={errors[field.name]?.message}
          />
        )}
      />
      <Controller
        name="foodId"
        control={control}
        rules={{
          required: t("common.validation.requiredFood"),
        }}
        render={({ field }) => (
          <InputPickerField
            style={{ flexGrow: 1 }}
            label={t("domain.food")}
            field={field}
            data={foodItems}
            error={errors[field.name]?.message}
          />
        )}
      />
    </Form>
  )
})
