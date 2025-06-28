import { FoodAmount, Id } from "../../types.ts"
import { useStore } from "../../store.ts"
import { CellProps, Table } from "rsuite"
import { ColumnType } from "../../../utils/sort-utils.ts"
import { InlineNumberField } from "../../../components/form-fields.tsx"
import { useEffect, useState } from "react"

type FoodAmountTableData = FoodAmount & { foodName: string }

type FoodsTableColumn = ColumnType<FoodAmountTableData>

const columns: Array<FoodsTableColumn> = [
  {
    key: "amountInGram",
    label: "Menge (g)",
    width: 150
  },
  {
    key: "foodName",
    label: "Name",
  },
]

function AmountCell({
  rowData,
  onAmountChanged,
  ...rest
}: CellProps<FoodAmountTableData> & {
  onAmountChanged: (foodId: Id, newValue: number) => void
}) {
  console.log("amount-cell", { rowData })
  return (
    <Table.Cell {...rest}>
      {rowData && (
        <InlineNumberField
          value={rowData.amountInGram}
          onSave={(newValue) => onAmountChanged(rowData.foodId, newValue)}
        />
      )}
    </Table.Cell>
  )
}

export function SelectedRecipeFoodsTable({ recipeId }: { recipeId: Id }) {
  const { recipes, foods: allFoods } = useStore()

  const recipe = recipes.find((recipe) => recipe.id === recipeId)!

  const [foods, setFoods] = useState<Array<FoodAmount>>([])

  useEffect(() => {
    setFoods(
      recipe.ingredients.map((i) => ({
        foodId: i.foodId,
        amountInGram: i.amountInGram,
      })),
    )
  }, [recipe])

  const data: Array<FoodAmountTableData> = foods.map((food) => ({
    ...food,
    foodName: allFoods.find((f) => f.id === food.foodId)!.name,
  }))

  if (data.length === 0) {
    return <p>Rezept enthält keine Lebensmittel</p>
  }

  function onAmountChanged(foodId: Id, newValue: number) {
    console.log("onChange", { foodId, newValue })
  }

  return (
    <Table data={data}>
      {columns.map((column) => {
        const { key, label, ...rest } = column

        let cell

        switch (key) {
          case "amountInGram": {
            cell = <AmountCell dataKey={key} onAmountChanged={onAmountChanged} />
            break
          }

          default: {
            cell = <Table.Cell dataKey={key} />
          }
        }

        return (
          <Table.Column {...rest} key={key}>
            <Table.HeaderCell>{label}</Table.HeaderCell>
            {cell}
          </Table.Column>
        )
      })}
    </Table>
  )
}
