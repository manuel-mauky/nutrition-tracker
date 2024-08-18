import { createLazyFileRoute } from "@tanstack/react-router"
import { RecipesRoute } from "../features/recipes/recipes.route.tsx"

export const Route = createLazyFileRoute("/recipes")({
  component: RecipesRoute,
})
