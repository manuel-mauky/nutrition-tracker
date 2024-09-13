import { Navigate, useParams } from "@tanstack/react-router"
import { useStore } from "../store.ts"
import { ContentLayout } from "../../content-layout.tsx"
import { RecipesBreadcrumb } from "./recipes-breadcrumb.tsx"
import { Button, ButtonGroup, ButtonToolbar, Divider, IconButton, Text } from "rsuite"
import { useRef, useState } from "react"
import { Icon } from "@rsuite/icons"
import { PiPencilLine } from "react-icons/pi"
import { CloneRecipeButton } from "./clone-recipe-button.tsx"
import { RecipeDetailsForm, RecipeDetailsFormRef } from "./recipe-details-form.tsx"
import { DeleteRecipeButton } from "./delete-recipe-button.tsx"
import { IngredientTable } from "./ingredient-table.tsx"

import "./recipes.css"

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
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <ButtonToolbar style={{ marginBottom: "10px" }}>
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

        <div style={{ flexGrow: 1 }}>
          <IngredientTable recipe={recipe} />
        </div>
      </div>
    </ContentLayout>
  )
}
