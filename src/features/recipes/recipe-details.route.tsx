import { Navigate, useParams } from "@tanstack/react-router"
import { useStore } from "../store.ts"
import { ContentLayout } from "../../content-layout.tsx"
import { RecipesBreadcrumb } from "./recipes-breadcrumb.tsx"
import { Button, ButtonGroup, ButtonToolbar, Divider, IconButton, List, Text } from "rsuite"
import { useRef, useState } from "react"
import { Recipe } from "../types.ts"
import { Icon } from "@rsuite/icons"
import { PiPencilLine } from "react-icons/pi"
import { CloneRecipeButton } from "./clone-recipe-button.tsx"
import { createFoodsMap } from "./recipe-utils.ts"
import { MovedItemInfo } from "rsuite/esm/List/helper/useSortHelper"
import { RecipeDetailsForm, RecipeDetailsFormRef } from "./recipe-details-form.tsx"
import { DeleteRecipeButton } from "./delete-recipe-button.tsx"

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

  const [editMode, setEditMode] = useState(false)

  const { recipes } = useStore()
  const recipe = recipes.find((recipe) => recipe.id === recipeId)

  function handleEditCancel() {
    formRef.current?.reset()
    setEditMode(false)
  }

  if (!recipe) {
    // this case can happen when:
    // a) users directly navigated to details page with wrong link/id
    // b) after the recipe was deleted
    return <Navigate to="/recipes" />
  }

  return (
    <ContentLayout header={<RecipesBreadcrumb recipe={recipe} />}>
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

        <CloneRecipeButton recipeId={recipe.id} disabled={editMode} />
        <DeleteRecipeButton recipeId={recipe.id} disabled={editMode} />
      </ButtonToolbar>

      <RecipeDetailsForm ref={formRef} recipe={recipe} editMode={editMode} setEditMode={setEditMode} />

      <Divider />
      <Text size="xl">Zutaten</Text>

      <IngredientList recipe={recipe} />
    </ContentLayout>
  )
}
