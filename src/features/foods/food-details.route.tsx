import { useParams } from "@tanstack/react-router"
import { useStore } from "../store.ts"

import "./foods.css"


export function FoodDetailsRoute() {
  const { foodId } = useParams({ strict: false })

  const { foods } = useStore()

  const food = foods.find((food) => food.id === foodId)

  return <div>{food ? <div>{JSON.stringify(food, null, 2)}</div> : <div>Not found</div>}</div>
}
