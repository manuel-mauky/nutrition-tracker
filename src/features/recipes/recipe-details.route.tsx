import { Navigate, useParams } from "@tanstack/react-router"
import { useStore } from "../store.ts"
import { ContentLayout } from "../../content-layout.tsx"
import { RecipesBreadcrumb } from "./recipes-breadcrumb.tsx"

export function RecipeDetailsRoute() {
  const { recipeId } = useParams({ strict: false })

  const { recipes } = useStore()

  const recipe = recipes.find((recipe) => recipe.id === recipeId)

  if (!recipe) {
    // this case can happen when:
    // a) users directly navigated to details page with wrong link/id
    // b) after the recipe was deleted
    return <Navigate to="/recipes" />
  }

  return <ContentLayout header={<RecipesBreadcrumb recipe={recipe} />}></ContentLayout>
}
