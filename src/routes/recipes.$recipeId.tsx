import { createFileRoute } from "@tanstack/react-router"
import { RecipeDetailsRoute } from "../features/recipes/recipe-details.route.tsx"

export const Route = createFileRoute("/recipes/$recipeId")({
  component: RecipeDetailsRoute,
})
