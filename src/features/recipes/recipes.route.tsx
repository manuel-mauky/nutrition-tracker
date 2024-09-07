import { ContentLayout } from "../../content-layout.tsx"
import { ButtonToolbar } from "rsuite"
import { RecipesTable } from "./recipes-table.tsx"
import { RecipesBreadcrumb } from "./recipes-breadcrumb.tsx"
import { AddRecipeDialog } from "./add-recipe-dialog.tsx"

export function RecipesRoute() {
  return (
    <ContentLayout header={<RecipesBreadcrumb />}>
      <div id="recipe-root">
        <ButtonToolbar>
          <AddRecipeDialog />
        </ButtonToolbar>
        <div style={{ flexGrow: 1 }}>
          <RecipesTable />
        </div>
      </div>
    </ContentLayout>
  )
}
