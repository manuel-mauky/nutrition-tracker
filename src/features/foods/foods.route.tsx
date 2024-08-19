import { ContentLayout } from "../../content-layout.tsx"
import { useStore } from "../store.ts"
import { useState } from "react"

export function FoodsRoute() {
  const { foods, addFood } = useStore()

  const [name, setName] = useState("")

  function createNewFood() {
    if (name.trim().length > 0) {
      addFood({
        name,
        description: "",
        kcal: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        fiber: 0,
        sugar: 0,
      })
    }
  }

  return (
    <ContentLayout title="Lebensmittel">
      <div>
        <label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <button onClick={createNewFood}>Add</button>
      </div>
      <div>
        {foods.map((food) => (
          <div key={food.id}>{JSON.stringify(food)}</div>
        ))}
      </div>
    </ContentLayout>
  )
}
