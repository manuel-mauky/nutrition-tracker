import { ContentLayout } from "../../content-layout.tsx"
import { useStore } from "../store.ts"
import { Text } from "rsuite"

export function RecipesRoute() {
  const { recipes } = useStore()

  return (
    <ContentLayout header={<Text>Rezepte</Text>}>
      <div>
        {recipes.map((recipe) => (
          <div key={recipe.id}>{JSON.stringify(recipe)}</div>
        ))}
      </div>
    </ContentLayout>
  )
}
