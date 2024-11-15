import { Breadcrumb } from "rsuite"
import { Food } from "../types.ts"
import { BreadcrumbLink } from "../../components/breadcrumbs.tsx"

export function FoodsBreadcrumb({ food }: { food?: Food }) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/foods" as={BreadcrumbLink} active={!food}>
        Lebensmittel
      </Breadcrumb.Item>
      {food ? <Breadcrumb.Item active>{food.name}</Breadcrumb.Item> : null}
    </Breadcrumb>
  )
}
