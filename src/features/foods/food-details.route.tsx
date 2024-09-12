import { Navigate, useNavigate, useParams } from "@tanstack/react-router"
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
import { DeleteFoodWarningDialog } from "./delete-food-warning-dialog.tsx"
import { PiCopySimple, PiPencilLine, PiTrash } from "react-icons/pi"
import { Icon } from "@rsuite/icons"
import { CloneFoodDialog } from "./clone-food-dialog.tsx"
import { validateName } from "../utils.ts"

export function FoodDetailsRoute() {
  const { foodId } = useParams({ strict: false })
  const navigate = useNavigate({ from: "/foods/$foodId" })

  const [editMode, setEditMode] = useState(false)

  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

  const [showCloneDialog, setShowCloneDialog] = useState(false)

  const { foods, addFood, editFood, removeFood } = useStore()

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

  function handleDelete() {
    setShowDeleteWarning(true)
  }

  function handleDeleteOk() {
    if (food) {
      removeFood(food)
    }
    setShowDeleteWarning(false)
  }

  function handleDeleteCancel() {
    setShowDeleteWarning(false)
  }

  function handleClone() {
    setShowCloneDialog(true)
  }

  async function handleCloneOk(newName: string) {
    if (food) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = food

      const clone: Omit<Food, "id"> = {
        ...rest,
        name: newName,
      }

      const newId = addFood(clone)

      await navigate({
        to: "/foods/$foodId",
        params: {
          foodId: newId,
        },
      })
    }

    setShowCloneDialog(false)
  }

  function handleCloneCancel() {
    setShowCloneDialog(false)
  }

  if (!food) {
    // this case can happen when:
    // a) users directly navigated to details page with wrong link/id
    // b) after the food was deleted
    return <Navigate to="/foods" />
  }

  return (
    <ContentLayout header={<FoodsBreadcrumb food={food} />}>
      <DeleteFoodWarningDialog
        open={showDeleteWarning}
        foodId={food?.id}
        handleOk={handleDeleteOk}
        handleCancel={handleDeleteCancel}
      />
      <CloneFoodDialog
        foodId={food?.id}
        handleOk={handleCloneOk}
        handleCancel={handleCloneCancel}
        open={showCloneDialog}
      />
      <ButtonToolbar style={{ marginBottom: "10px", marginTop: "10px" }}>
        {editMode ? (
          <ButtonGroup>
            <Button appearance="primary" type="submit" form="edit-food-form">
              Speichern
            </Button>
            <Button onClick={handleEditCancel} appearance="subtle">
              Abbrechen
            </Button>
          </ButtonGroup>
        ) : (
          <IconButton icon={<Icon as={PiPencilLine} />} onClick={() => setEditMode(!editMode)}>
            Editieren
          </IconButton>
        )}

        <IconButton icon={<Icon as={PiCopySimple} />} disabled={editMode} onClick={handleClone}>
          Klonen
        </IconButton>
        <IconButton icon={<Icon as={PiTrash} />} disabled={editMode} onClick={handleDelete}>
          Löschen
        </IconButton>
      </ButtonToolbar>

      <Form plaintext={!editMode} id="edit-food-form" fluid onSubmit={(_, event) => onSubmit(event)}>
        <div className="two-column-form-grid">
          <div>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name ist erforderlich",
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
                style={{ height: "200px" }}
                label="Beschreibung"
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
