import { createLazyFileRoute } from "@tanstack/react-router"
import { ContentLayout } from "../content-layout.tsx"

export const Route = createLazyFileRoute("/recipes")({
  component: RecipesPage,
})

function RecipesPage() {
  return (
    <ContentLayout title="Rezepte">
      <p>Rezepte content</p>
    </ContentLayout>
  )
}
