import { useParams } from "@tanstack/react-router"
import { useStore } from "../store.ts"

import "./foods.css"
import { ContentLayout } from "../../content-layout.tsx"
import { FoodsBreadcrumb } from "./foods-breadcrumb.tsx"

export function FoodDetailsRoute() {
  const { foodId } = useParams({ strict: false })

  const { foods } = useStore()

  const food = foods.find((food) => food.id === foodId)

  return (
    <ContentLayout header={<FoodsBreadcrumb food={food} />}>
      <div>{food ? <div>{JSON.stringify(food, null, 2)}</div> : <div>Not found</div>}</div>
    </ContentLayout>
  )
}
