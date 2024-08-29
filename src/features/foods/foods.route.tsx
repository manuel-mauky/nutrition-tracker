import { ContentLayout } from "../../content-layout.tsx"
import { useStore } from "../store.ts"
import { useState } from "react"
import { FoodsTable } from "./foods-table.tsx"

import "./foods.css"
import { FoodsBreadcrumb } from "./foods-breadcrumb.tsx"



export function FoodsRoute() {
  const { addFood } = useStore()

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
    <ContentLayout header={<FoodsBreadcrumb/>}>
      <div id="foods-root">
        <div>
          <label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <button onClick={createNewFood}>Add</button>
        </div>
        <div style={{ flexGrow: 1 }}>
          <FoodsTable />
        </div>
      </div>
    </ContentLayout>
  )
}
