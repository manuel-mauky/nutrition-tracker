import { Breadcrumb } from "rsuite"
import { Link } from "@tanstack/react-router"
import { Food } from "../types.ts"

export function FoodsBreadcrumb({ food }: { food?: Food }) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item to="/foods" as={Link} active={!food}>
        Lebensmittel
      </Breadcrumb.Item>
      {food ? <Breadcrumb.Item active>{food.name}</Breadcrumb.Item> : false}
    </Breadcrumb>
  )
}
