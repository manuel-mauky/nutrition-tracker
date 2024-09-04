import { useParams } from "@tanstack/react-router"
import { useStore } from "../store.ts"

import "./foods.css"
import { ContentLayout } from "../../content-layout.tsx"
import { FoodsBreadcrumb } from "./foods-breadcrumb.tsx"
import { Button, ButtonGroup, ButtonToolbar, Form } from "rsuite"
import { useState } from "react"
import { Food } from "../types.ts"
import { Controller, useForm } from "react-hook-form"
import { TextAreaField, TextField } from "../../components/form-fields.tsx"
import { FoodNutritionForm } from "./food-nutrition-form.tsx"

export function FoodDetailsRoute() {
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

  return (
    <ContentLayout header={<FoodsBreadcrumb food={food} />}>
      <ButtonToolbar style={{ marginBottom: "10px" }}>
        {editMode ? (
          <ButtonGroup>
            <Button appearance="primary" type="submit" form="edit-food-form">
              Speichern
            </Button>
            <Button onClick={handleEditCancel}>Abbrechen</Button>
          </ButtonGroup>
        ) : (
          <Button onClick={() => setEditMode(!editMode)}>Editieren</Button>
        )}

        <Button disabled={editMode}>Clonen</Button>
        <Button disabled={editMode}>Löschen</Button>
      </ButtonToolbar>

      <Form plaintext={!editMode} id="edit-food-form" fluid onSubmit={(_, event) => onSubmit(event)}>
        <div
          style={{
            height: "70px",
          }}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name ist erforderlich",
              validate: (value, formFood) => {
                const duplicate = foods.some((food) => food.id !== formFood.id && food.name === value)

                if (duplicate) {
                  return "Name existiert bereits"
                } else {
                  return undefined
                }
              },
            }}
            render={({ field }) => <TextField field={field} error={errors[field.name]?.message} label="Name" />}
          />
        </div>
        <div className="two-column-form-grid">
          <FoodNutritionForm control={control} errors={errors} />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextAreaField label="Beschreibung" field={field} error={errors[field.name]?.message} />
            )}
          />
        </div>
      </Form>
    </ContentLayout>
  )
}
