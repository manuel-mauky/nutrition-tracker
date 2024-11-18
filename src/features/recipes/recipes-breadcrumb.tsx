import { Recipe } from "../types.ts"
import { Breadcrumb } from "rsuite"
import { BreadcrumbLink } from "../../components/breadcrumbs.tsx"
import { useTranslation } from "react-i18next"

export function RecipesBreadcrumb({ recipe }: { recipe?: Recipe }) {
  const { t } = useTranslation()
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/recipes" as={BreadcrumbLink} active={!recipe}>
        {t("recipes.title")}
      </Breadcrumb.Item>
      {recipe ? <Breadcrumb.Item active>{recipe.name}</Breadcrumb.Item> : null}
    </Breadcrumb>
  )
}
