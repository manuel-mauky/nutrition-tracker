import { Recipe } from "../types.ts"
import { forwardRef, useImperativeHandle } from "react"
import { useStore } from "../store.ts"
import { Controller, useForm } from "react-hook-form"
import { calcNutrients, createFoodsMap } from "./recipe-utils.ts"
import { Form } from "rsuite"
import { validateName } from "../utils.ts"
import { ReadonlyNumberField, TextAreaField, TextField } from "../../components/form-fields.tsx"

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
  const { recipes, foods, editRecipe } = useStore()

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

  const foodsMap = createFoodsMap(foods)

  const recipeWithNutrients = calcNutrients(foodsMap, recipe)

  return (
    <Form plaintext={!editMode} id="edit-recipe-form" fluid onSubmit={(_, event) => onSubmit(event)}>
      <div className="two-column-form-grid">
        <div>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name ist erforderlich",
              validate: (value, formRecipe) =>
                validateName(
                  value,
                  recipes.filter((recipe) => recipe.id !== formRecipe.id),
                ),
            }}
            render={({ field }) => <TextField label="Name" field={field} error={errors[field.name]?.message} />}
          />
          <div className="four-column-form-grid">
            <ReadonlyNumberField label="KCal" recipe={recipeWithNutrients} nutrientName="kcal" />
            <ReadonlyNumberField label="Kohlenhydrate" recipe={recipeWithNutrients} nutrientName="carbs" />

            <ReadonlyNumberField label="Fett" recipe={recipeWithNutrients} nutrientName="fat" />
            <ReadonlyNumberField label="Protein" recipe={recipeWithNutrients} nutrientName="protein" />

            <ReadonlyNumberField label="Ballaststoffe" recipe={recipeWithNutrients} nutrientName="fiber" />
            <ReadonlyNumberField label="Zucker" recipe={recipeWithNutrients} nutrientName="sugar" />
          </div>
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextAreaField
              style={{ height: "200px" }}
              label="Beschreibung"
              field={field}
              error={errors[field.name]?.message}
            />
          )}
        />
      </div>
    </Form>
  )
})