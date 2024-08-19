import { ContentLayout } from "../../content-layout.tsx"
import { useStore } from "../store.ts"

export function RecipesRoute() {
  const { recipes } = useStore()

  return (
    <ContentLayout title="Rezepte">
      <div>
        {recipes.map((recipe) => (
          <div key={recipe.id}>{JSON.stringify(recipe)}</div>
        ))}
      </div>
    </ContentLayout>
  )
}
