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
import { AddIngredientButton, AddIngredientFormValue } from "./add-ingredient-button.tsx"
import { Recipe } from "../types.ts"
import { nanoid } from "nanoid"
import { useTranslation } from "react-i18next"

export function RecipeDetailsRoute() {
  const { t } = useTranslation()
  const { recipeId } = useParams({ strict: false })

  const formRef = useRef<RecipeDetailsFormRef>(null)

  const [editMode, setEditMode] = useState(false)

  const { recipes, editRecipe } = useStore()
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

  function onAddIngredient(ingredient: AddIngredientFormValue) {
    if (recipe) {
      const updatedRecipe: Recipe = {
        ...recipe,
        ingredients: [
          ...recipe.ingredients,
          {
            ingredientId: nanoid(),
            amountInGram: ingredient.amount,
            foodId: ingredient.foodId,
          },
        ],
      }

      editRecipe(updatedRecipe)
    }
  }

  return (
    <ContentLayout header={<RecipesBreadcrumb recipe={recipe} />}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <ButtonToolbar style={{ marginBottom: "10px" }}>
          {editMode ? (
            <ButtonGroup>
              <Button appearance="primary" type="submit" form="edit-recipe-form">
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

          <CloneRecipeButton recipeId={recipe.id} disabled={editMode} />
          <DeleteRecipeButton recipeId={recipe.id} disabled={editMode} />
        </ButtonToolbar>

        <RecipeDetailsForm ref={formRef} recipe={recipe} editMode={editMode} setEditMode={setEditMode} />

        <Divider />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Text size="xl">{t("domain.foods")}</Text>
          <ButtonToolbar style={{ marginTop: "10px", marginBottom: "10px" }}>
            <AddIngredientButton
              onAddIngredient={onAddIngredient}
              existingFoods={recipe.ingredients.map((ingredient) => ingredient.foodId)}
            />
          </ButtonToolbar>
        </div>

        <div style={{ flexGrow: 1 }}>
          <IngredientTable recipe={recipe} />
        </div>
      </div>
    </ContentLayout>
  )
}
