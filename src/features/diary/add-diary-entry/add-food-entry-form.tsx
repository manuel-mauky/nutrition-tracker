import { FoodDiaryEntry } from "../../types.ts"
import { forwardRef, useImperativeHandle, useMemo } from "react"
import { FormRef } from "./types.ts"
import { useStore } from "../../store.ts"
import { Controller, useForm } from "react-hook-form"
import { Form } from "rsuite"
import { InputPickerField, NumberField } from "../../../components/form-fields.tsx"
import { sortByName } from "../../../utils/sort-utils.ts"

export type AddFoodFormData = Omit<FoodDiaryEntry, "id" | "date" | "mealType">

export const AddFoodEntryForm = forwardRef<
  FormRef,
  {
    formId: string
    onSubmit: (data: AddFoodFormData) => void
  }
>(function AddFoodEntryForm({ formId, onSubmit }, ref) {
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
          validate: (value) => (value <= 0 ? "Muss größer als 0g sein" : undefined),
        }}
        render={({ field }) => (
          <NumberField
            className="first-column"
            step={0.1}
            label="Menge in Gram"
            field={field}
            error={errors[field.name]?.message}
          />
        )}
      />
      <Controller
        name="foodId"
        control={control}
        rules={{
          required: "Lebensmittel ist erforderlich",
        }}
        render={({ field }) => (
          <InputPickerField
            style={{ flexGrow: 1 }}
            label="Lebensmittel"
            field={field}
            data={foodItems}
            error={errors[field.name]?.message}
          />
        )}
      />
    </Form>
  )
})
