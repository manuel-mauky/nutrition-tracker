import { Recipe } from "../types.ts"
import { Breadcrumb } from "rsuite"
import { Link } from "@tanstack/react-router"

export function RecipesBreadcrumb({ recipe }: { recipe?: Recipe }) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item to="/recipes" as={Link} active={!recipe}>
        Rezepte
      </Breadcrumb.Item>
      {recipe ? <Breadcrumb.Item active>{recipe.name}</Breadcrumb.Item> : null}
    </Breadcrumb>
  )
}
