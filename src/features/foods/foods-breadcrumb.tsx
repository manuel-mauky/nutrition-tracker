import { Breadcrumb } from "rsuite"
import { Food } from "../types.ts"
import { BreadcrumbLink } from "../../components/breadcrumbs.tsx"
import { useTranslation } from "react-i18next"

export function FoodsBreadcrumb({ food }: { food?: Food }) {
  const { t } = useTranslation()
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/foods" as={BreadcrumbLink} active={!food}>
        {t("foods.title")}
      </Breadcrumb.Item>
      {food ? <Breadcrumb.Item active>{food.name}</Breadcrumb.Item> : null}
    </Breadcrumb>
  )
}
