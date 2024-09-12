import { Navigate, useNavigate, useParams } from "@tanstack/react-router"
import { useStore } from "../store.ts"
import { ContentLayout } from "../../content-layout.tsx"
import { RecipesBreadcrumb } from "./recipes-breadcrumb.tsx"
import { Button, ButtonGroup, ButtonToolbar, Divider, IconButton, List, Text } from "rsuite"
import { useRef, useState } from "react"
import { Recipe } from "../types.ts"
import { Icon } from "@rsuite/icons"
import { PiCopySimple, PiPencilLine, PiTrash } from "react-icons/pi"
import { DeleteRecipeWarningDialog } from "./delete-recipe-warning-dialog.tsx"
import { CloneRecipeDialog } from "./clone-recipe-dialog.tsx"
import { createFoodsMap } from "./recipe-utils.ts"
import { MovedItemInfo } from "rsuite/esm/List/helper/useSortHelper"
import { RecipeDetailsForm, RecipeDetailsFormRef } from "./recipe-details-form.tsx"

function IngredientList({ recipe }: { recipe: Recipe }) {
  const { foods, editRecipe } = useStore()
  const foodsMap = createFoodsMap(foods)

  function handleSortEnd({ oldIndex, newIndex }: MovedItemInfo) {
    const dataMutable = [...recipe.ingredients]
    const moveData = dataMutable.splice(oldIndex, 1)
    dataMutable.splice(newIndex, 0, moveData[0])

    editRecipe({
      ...recipe,
      ingredients: dataMutable,
    })
  }

  return (
    <List sortable onSort={handleSortEnd}>
      {recipe.ingredients.map((ingredient, index) => (
        <List.Item key={`${ingredient.foodId}_${ingredient.amountInGram}_${index}`} index={index}>
          {ingredient.amountInGram} g - {foodsMap[ingredient.foodId].name}
        </List.Item>
      ))}
    </List>
  )
}

export function RecipeDetailsRoute() {
  const { recipeId } = useParams({ strict: false })

  const formRef = useRef<RecipeDetailsFormRef>(null)

  const navigate = useNavigate({ from: "/recipes/$recipeId" })

  const [editMode, setEditMode] = useState(false)
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [showCloneDialog, setShowCloneDialog] = useState(false)

  const { recipes, addRecipe, removeRecipe } = useStore()
  const recipe = recipes.find((recipe) => recipe.id === recipeId)

  function handleEditCancel() {
    formRef.current?.reset()
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

      <RecipeDetailsForm ref={formRef} recipe={recipe} editMode={editMode} setEditMode={setEditMode} />

      <Divider />
      <Text size="xl">Zutaten</Text>

      <IngredientList recipe={recipe} />
    </ContentLayout>
  )
}
