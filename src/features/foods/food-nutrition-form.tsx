import { Control, Controller, FieldErrors } from "react-hook-form"
import { NumberField } from "../../components/form-fields.tsx"
import { Food } from "../types.ts"
import { useTranslation } from "react-i18next"

export function FoodNutritionForm({ control, errors }: { control: Control<Food>; errors: FieldErrors<Food> }) {
  const { t } = useTranslation()
  return (
    <>
      <Controller
        name="kcal"
        control={control}
        render={({ field }) => <NumberField label="KCal" field={field} error={errors[field.name]?.message} />}
      />
      <Controller
        name="carbs"
        control={control}
        render={({ field }) => (
          <NumberField label={t("domain.carbs")} unit="g" field={field} error={errors[field.name]?.message} />
        )}
      />
      <Controller
        name="fat"
        control={control}
        render={({ field }) => (
          <NumberField label={t("domain.fat")} unit="g" field={field} error={errors[field.name]?.message} />
        )}
      />
      <Controller
        name="protein"
        control={control}
        render={({ field }) => (
          <NumberField label={t("domain.protein")} unit="g" field={field} error={errors[field.name]?.message} />
        )}
      />
      <Controller
        name="fiber"
        control={control}
        render={({ field }) => (
          <NumberField label={t("domain.fiber")} unit="g" field={field} error={errors[field.name]?.message} />
        )}
      />
      <Controller
        name="sugar"
        control={control}
        render={({ field }) => (
          <NumberField label={t("domain.sugar")} unit="g" field={field} error={errors[field.name]?.message} />
        )}
      />
    </>
  )
}
