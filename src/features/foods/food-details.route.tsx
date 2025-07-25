import { Navigate, useParams } from "@tanstack/react-router"
import { useStore } from "../store.ts"

import "./foods.css"
import { ContentLayout } from "../../content-layout.tsx"
import { FoodsBreadcrumb } from "./foods-breadcrumb.tsx"
import { Button, ButtonGroup, ButtonToolbar, Form, IconButton } from "rsuite"
import { useState } from "react"
import { Food } from "../types.ts"
import { Controller, useForm } from "react-hook-form"
import { TextAreaField, TextField } from "../../components/form-fields.tsx"
import { FoodNutritionForm } from "./food-nutrition-form.tsx"
import { DeleteFoodButton } from "./delete-food-button.tsx"
import { PiPencilLine } from "react-icons/pi"
import { Icon } from "@rsuite/icons"
import { CloneFoodButton } from "./clone-food-button.tsx"
import { validateName } from "../utils.ts"
import { useTranslation } from "react-i18next"

export function FoodDetailsRoute() {
  const { t } = useTranslation()
  const { foodId } = useParams({ strict: false })

  const [editMode, setEditMode] = useState(false)

  const { foods, editFood } = useStore()

  const food = foods.find((food) => food.id === foodId)

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Food>({
    values: food,
  })

  const onSubmit = handleSubmit((data) => {
    editFood(data)
    setEditMode(false)
    reset()
  })

  function handleEditCancel() {
    reset()
    setEditMode(false)
  }

  if (!food) {
    // this case can happen when:
    // a) users directly navigated to details page with wrong link/id
    // b) after the food was deleted
    return <Navigate to="/foods" />
  }

  return (
    <ContentLayout header={<FoodsBreadcrumb food={food} />}>
      <ButtonToolbar style={{ marginBottom: "10px" }}>
        {editMode ? (
          <ButtonGroup>
            <Button appearance="primary" type="submit" form="edit-food-form">
              {t("common.save")}
            </Button>
            <Button onClick={handleEditCancel} appearance="subtle">
              {t("common.cancel")}
            </Button>
          </ButtonGroup>
        ) : (
          <IconButton icon={<Icon as={PiPencilLine} />} onClick={() => setEditMode(!editMode)}>
            {t("common.edit")}
          </IconButton>
        )}

        <CloneFoodButton foodId={food.id} disabled={editMode} />
        <DeleteFoodButton foodId={food.id} disabled={editMode} />
      </ButtonToolbar>

      <Form plaintext={!editMode} id="edit-food-form" fluid onSubmit={(_, event) => onSubmit(event)}>
        <div className="two-column-form-grid">
          <div>
            <Controller
              name="name"
              control={control}
              rules={{
                required: t("common.validation.requiredName"),
                validate: (value, formFood) =>
                  validateName(
                    value,
                    foods.filter((food) => food.id !== formFood.id),
                  ),
              }}
              render={({ field }) => <TextField field={field} error={errors[field.name]?.message} label="Name" />}
            />
            <div className="four-column-form-grid">
              <FoodNutritionForm control={control} errors={errors} />
            </div>
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextAreaField
                readOnly={!editMode}
                plaintext={false}
                style={{ height: "200px" }}
                label={t("common.description")}
                field={field}
                error={errors[field.name]?.message}
              />
            )}
          />
        </div>
      </Form>
    </ContentLayout>
  )
}
