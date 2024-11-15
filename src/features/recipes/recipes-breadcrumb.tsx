import { Recipe } from "../types.ts"
import { Breadcrumb } from "rsuite"
import { BreadcrumbLink } from "../../components/breadcrumbs.tsx"

export function RecipesBreadcrumb({ recipe }: { recipe?: Recipe }) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/recipes" as={BreadcrumbLink} active={!recipe}>
        Rezepte
      </Breadcrumb.Item>
      {recipe ? <Breadcrumb.Item active>{recipe.name}</Breadcrumb.Item> : null}
    </Breadcrumb>
  )
}
