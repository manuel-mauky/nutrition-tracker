import { createLazyFileRoute } from "@tanstack/react-router"
import { FoodsRoute } from "../features/foods/foods.route.tsx"

export const Route = createLazyFileRoute("/foods")({
  component: FoodsRoute,
})
