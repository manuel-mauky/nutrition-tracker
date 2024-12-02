import { RecipeDiaryEntry } from "../../types.ts"
import { forwardRef, useImperativeHandle, useMemo } from "react"
import { useStore } from "../../store.ts"
import { Controller, useForm } from "react-hook-form"
import { Form } from "rsuite"
import { InputPickerField, NumberField } from "../../../components/form-fields.tsx"
import { FormRef } from "./types.ts"
import { sortByName } from "../../../utils/sort-utils.ts"

export type AddRecipeFormData = Omit<RecipeDiaryEntry, "id" | "date" | "mealType">

export const AddRecipeEntryForm = forwardRef<
  FormRef,
  {
    formId: string
    onSubmit: (data: AddRecipeFormData) => void
  }
>(function AddRecipeEntryForm({ formId, onSubmit }, ref) {
  const { recipes } = useStore()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddRecipeFormData>({
    defaultValues: {
      portions: 1,
    },
  })

  useImperativeHandle(ref, () => ({
    reset,
  }))

  const recipeItems = useMemo(
    () =>
      recipes.toSorted(sortByName()).map((recipe) => ({
        label: recipe.name,
        value: recipe.id,
      })),
    [recipes],
  )

  const onSubmitHandler = handleSubmit((data) => {
    onSubmit(data)
    reset()
  })

  return (
    <Form id={formId} onSubmit={(_, event) => onSubmitHandler(event)}>
      <Controller
        name="portions"
        control={control}
        rules={{
          validate: (value) => (value <= 0 ? "Anzahl Portionen muss größer als 0 sein" : undefined),
        }}
        render={({ field }) => (
          <NumberField
            className="first-column"
            step={0.1}
            label="Anzahl Portionen"
            field={field}
            error={errors[field.name]?.message}
          />
        )}
      />

      <Controller
        name="recipeId"
        control={control}
        rules={{
          required: "Rezept ist erforderlich",
        }}
        render={({ field }) => (
          <InputPickerField
            style={{ flexGrow: 1 }}
            label="Rezept"
            field={field}
            data={recipeItems}
            error={errors[field.name]?.message}
          />
        )}
      />
    </Form>
  )
})
