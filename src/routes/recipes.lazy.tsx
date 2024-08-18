import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/recipes")({
  component: RecipesPage,
})

function RecipesPage() {
  return (
    <div>
      <h3>Rezepte</h3>
    </div>
  )
}
