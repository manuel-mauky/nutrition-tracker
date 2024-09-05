import { Control, Controller, FieldErrors } from "react-hook-form"
import { NumberField } from "../../components/form-fields.tsx"
import { Food } from "../types.ts"

export function FoodNutritionForm({ control, errors }: { control: Control<Food>; errors: FieldErrors<Food> }) {
  return (
    <div className="two-column-form-grid">
      <Controller
        name="kcal"
        control={control}
        render={({ field }) => <NumberField label="KCal" field={field} error={errors[field.name]?.message} />}
      />
      <Controller
        name="carbs"
        control={control}
        render={({ field }) => (
          <NumberField label="Kohlenhydrate" unit="g" field={field} error={errors[field.name]?.message} />
        )}
      />
      <Controller
        name="fat"
        control={control}
        render={({ field }) => <NumberField label="Fett" unit="g" field={field} error={errors[field.name]?.message} />}
      />
      <Controller
        name="protein"
        control={control}
        render={({ field }) => (
          <NumberField label="Protein" unit="g" field={field} error={errors[field.name]?.message} />
        )}
      />
      <Controller
        name="fiber"
        control={control}
        render={({ field }) => (
          <NumberField label="Ballaststoffe" unit="g" field={field} error={errors[field.name]?.message} />
        )}
      />
      <Controller
        name="sugar"
        control={control}
        render={({ field }) => (
          <NumberField label="Zucker" unit="g" field={field} error={errors[field.name]?.message} />
        )}
      />
    </div>
  )
}
