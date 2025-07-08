import { RecipeDiaryEntry } from "../../types.ts"
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react"
import { useStore } from "../../store.ts"
import { Controller, useForm } from "react-hook-form"
import { Form } from "rsuite"
import { InputPickerField, NumberField } from "../../../components/form-fields.tsx"
import { FormRef } from "./types.ts"
import { sortByName } from "../../../utils/sort-utils.ts"
import { SelectedRecipeFoodsTable } from "./selected-recipe-foods-table.tsx"

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
    watch,
    setValue,
  } = useForm<AddRecipeFormData>({
    defaultValues: {
      portions: 1,
      foods: [],
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

  const selectedRecipeId = watch("recipeId")

  const portions = watch("portions")

  // keep form value for foods in sync with the selected recipe
  useEffect(() => {
    const recipe = recipes.find((recipe) => recipe.id === selectedRecipeId)

    if (recipe) {
      const portionFactor = portions / recipe?.portions

      const foods = recipe.ingredients.map((i) => ({
        foodId: i.foodId,
        amountInGram: Math.round(i.amountInGram * portionFactor),
      }))
      setValue("foods", foods)
    } else {
      setValue("foods", [])
    }
  }, [selectedRecipeId, recipes, setValue, portions])

  return (
    <Form id={formId} onSubmit={(_, event) => onSubmitHandler(event)}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ display: "flex", gap: "10px" }}>
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
              <InputPickerField label="Rezept" field={field} data={recipeItems} error={errors[field.name]?.message} />
            )}
          />
        </div>

        {selectedRecipeId && <SelectedRecipeFoodsTable control={control} />}
      </div>
    </Form>
  )
})
