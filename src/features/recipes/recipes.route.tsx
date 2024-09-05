import { ContentLayout } from "../../content-layout.tsx"
import { ButtonToolbar, Text } from "rsuite"
import { RecipesTable } from "./recipes-table.tsx"

export function RecipesRoute() {
  return (
    <ContentLayout header={<Text>Rezepte</Text>}>
      <div id="recipe-root">
        <ButtonToolbar></ButtonToolbar>
        <div style={{ flexGrow: 1 }}>
          <RecipesTable />
        </div>
      </div>
    </ContentLayout>
  )
}
