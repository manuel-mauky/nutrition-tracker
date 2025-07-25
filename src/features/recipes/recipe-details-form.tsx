import { Recipe } from "../types.ts"
import { forwardRef, useImperativeHandle } from "react"
import { useStore } from "../store.ts"
import { Controller, useForm } from "react-hook-form"
import { Form } from "rsuite"
import { validateName } from "../utils.ts"
import { NumberField, TextAreaField, TextField } from "../../components/form-fields.tsx"
import { useTranslation } from "react-i18next"

export type RecipeForm = Omit<Recipe, "ingredients">

export type RecipeDetailsFormRef = {
  reset: () => void
}

export type Props = {
  recipe: Recipe
  editMode: boolean
  setEditMode: (newValue: boolean) => void
}

export const RecipeDetailsForm = forwardRef<RecipeDetailsFormRef, Props>(({ recipe, editMode, setEditMode }, ref) => {
  const { t } = useTranslation()
  const { recipes, editRecipe } = useStore()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RecipeForm>({
    values: recipe,
  })

  useImperativeHandle(ref, () => {
    return {
      reset,
    }
  }, [reset])

  const onSubmit = handleSubmit((data) => {
    editRecipe({
      ...recipe!,
      ...data,
    })
    setEditMode(false)
    reset()
  })

  return (
    <Form plaintext={!editMode} id="edit-recipe-form" fluid onSubmit={(_, event) => onSubmit(event)}>
      <div className="two-column-form-grid">
        <div>
          <Controller
            name="name"
            control={control}
            rules={{
              required: t("common.validation.requiredName"),
              validate: (value, formRecipe) =>
                validateName(
                  value,
                  recipes.filter((recipe) => recipe.id !== formRecipe.id),
                ),
            }}
            render={({ field }) => (
              <TextField label={t("labels.name")} field={field} error={errors[field.name]?.message} />
            )}
          />

          <Controller
            name="portions"
            control={control}
            rules={{
              required: t("common.validation.requiredPortions"),
              validate: (value) => {
                if (value <= 0) {
                  return t("common.validation.moreThenZeroNumber")
                }
              },
            }}
            render={({ field }) => (
              <NumberField
                step={0.5}
                label={t("recipes.howManyPortionsPerRecipe")}
                field={field}
                error={errors[field.name]?.message}
              />
            )}
          />
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextAreaField
              readOnly={!editMode}
              plaintext={false}
              style={{ height: "150px" }}
              label={t("common.description")}
              field={field}
              error={errors[field.name]?.message}
            />
          )}
        />
      </div>
    </Form>
  )
})
