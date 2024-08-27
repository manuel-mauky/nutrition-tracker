import { createFileRoute } from "@tanstack/react-router"
import { FoodDetailsRoute } from "../features/foods/food-details.route.tsx"

export const Route = createFileRoute("/foods/$foodId")({
  component: FoodDetailsRoute,
})
