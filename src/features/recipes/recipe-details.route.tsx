import { Navigate, useNavigate, useParams } from "@tanstack/react-router"
import { useStore } from "../store.ts"
import { ContentLayout } from "../../content-layout.tsx"
import { RecipesBreadcrumb } from "./recipes-breadcrumb.tsx"
import { Button, ButtonGroup, ButtonToolbar, Form, IconButton } from "rsuite"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Recipe } from "../types.ts"
import { Icon } from "@rsuite/icons"
import { PiCopySimple, PiPencilLine, PiTrash } from "react-icons/pi"
import { TextAreaField, TextField } from "../../components/form-fields.tsx"
import { validateName } from "../utils.ts"
import { DeleteRecipeWarningDialog } from "./delete-recipe-warning-dialog.tsx"
import { CloneRecipeDialog } from "./clone-recipe-dialog.tsx"

type RecipeForm = Omit<Recipe, "ingredients">

export function RecipeDetailsRoute() {
  const { recipeId } = useParams({ strict: false })

  const navigate = useNavigate({ from: "/recipes/$recipeId" })

  const [editMode, setEditMode] = useState(false)
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [showCloneDialog, setShowCloneDialog] = useState(false)

  const { recipes, editRecipe, addRecipe, removeRecipe } = useStore()

  const recipe = recipes.find((recipe) => recipe.id === recipeId)

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RecipeForm>({
    values: recipe,
  })

  const onSubmit = handleSubmit((data) => {
    editRecipe({
      ...recipe!,
      ...data,
    })
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
    if (recipe) {
      removeRecipe(recipe)
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
    if (recipe) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = recipe

      const clone: Omit<Recipe, "id"> = {
        ...rest,
        name: newName,
      }

      const newId = addRecipe(clone)

      await navigate({
        to: "/recipes/$recipeId",
        params: {
          recipeId: newId,
        },
      })
    }

    setShowCloneDialog(false)
  }

  function handleCloneCancel() {
    setShowCloneDialog(false)
  }

  if (!recipe) {
    // this case can happen when:
    // a) users directly navigated to details page with wrong link/id
    // b) after the recipe was deleted
    return <Navigate to="/recipes" />
  }

  return (
    <ContentLayout header={<RecipesBreadcrumb recipe={recipe} />}>
      <DeleteRecipeWarningDialog
        open={showDeleteWarning}
        recipeId={recipe?.id}
        handleOk={handleDeleteOk}
        handleCancel={handleDeleteCancel}
      />
      <CloneRecipeDialog
        open={showCloneDialog}
        recipeId={recipe?.id}
        handleOk={handleCloneOk}
        handleCancel={handleCloneCancel}
      />
      <ButtonToolbar style={{ marginBottom: "10px", marginTop: "10px" }}>
        {editMode ? (
          <ButtonGroup>
            <Button appearance="primary" type="submit" form="edit-recipe-form">
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

      <Form plaintext={!editMode} id="edit-recipe-form" fluid onSubmit={(_, event) => onSubmit(event)}>
        <div className="two-column-form-grid">
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
