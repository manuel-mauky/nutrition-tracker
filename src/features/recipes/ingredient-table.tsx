import { Ingredient, isNutrientName, Nutrients, nutrientUnit, Recipe } from "../types.ts"
import { useStore } from "../store.ts"
import { calcNutrients, calcNutrientsForIngredient, createFoodsMap } from "./recipe-utils.ts"
import { ColumnProps, Container, Table } from "rsuite"
import { useMemo, useState } from "react"
import { SortType } from "rsuite-table"
import { FoodLinkCell } from "../foods/foods-table.tsx"

type IngredientData = Omit<Ingredient, "foodId"> &
  Nutrients & {
    name: string
  }

type IngredientColumn = ColumnProps<IngredientData> & {
  key: keyof IngredientData
  label: string
}

const columns: Array<IngredientColumn> = [
  {
    key: "amountInGram",
    label: "Menge (in g)",
    width: 120,
    sortable: true,
  },
  {
    key: "name",
    label: "Name",
    width: 150,
    sortable: true,
  },
  {
    key: "kcal",
    label: "KCal",
    width: 80,
    sortable: true,
  },
  {
    key: "carbs",
    label: "Kohlenhydrate",
    width: 130,
    sortable: true,
  },
  {
    key: "sugar",
    label: "Zucker",
    width: 80,
    sortable: true,
  },
  {
    key: "fiber",
    label: "Balaststoffe",
    width: 120,
    sortable: true,
  },
  {
    key: "fat",
    label: "Fett",
    width: 80,
    sortable: true,
  },
  {
    key: "protein",
    label: "Eiweiß",
    width: 80,
    sortable: true,
  },
]

function HeaderSummary({ title, sum }: { title: string; sum: string }) {
  return (
    <div>
      <label>{title}</label>
      <div style={{ color: "var(--rs-text-primary)", fontSize: "14px" }}>{sum}</div>
    </div>
  )
}

export function IngredientTable({ recipe }: { recipe: Recipe }) {
  const { foods } = useStore()

  const ingredientsData: Array<IngredientData> = useMemo(() => {
    const foodsMap = createFoodsMap(foods)
    return recipe.ingredients.map((ingredient) => {
      const food = foodsMap[ingredient.foodId]

      const nutrients = calcNutrientsForIngredient(foodsMap, ingredient)

      return {
        name: food.name,
        amountInGram: ingredient.amountInGram,
        ...nutrients,
      }
    })
  }, [recipe, foods])

  const recipeWithNutrients = useMemo(() => {
    const foodsMap = createFoodsMap(foods)
    return calcNutrients(foodsMap, recipe)
  }, [foods, recipe])

  const [sortColumn, setSortColumn] = useState<IngredientColumn["key"] | undefined>()
  const [sortType, setSortType] = useState<SortType | undefined>()

  function getData() {
    if (sortColumn && sortType) {
      return ingredientsData.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]

        if (typeof x === "string") {
          x = x.charCodeAt(0)
        }
        if (typeof y === "string") {
          y = y.charCodeAt(0)
        }

        if (sortType === "asc") {
          return x - y
        } else {
          return y - x
        }
      })
    } else {
      return ingredientsData
    }
  }

  function handleSortColumn(sortColumn: string, sortType?: SortType) {
    setSortColumn(sortColumn as IngredientColumn["key"])
    setSortType(sortType)
  }

  return (
    <Container style={{ height: "100%" }}>
      <Table
        headerHeight={80}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        autoHeight
        data={getData()}
      >
        {columns.map((column) => {
          const { key, label, ...rest } = column

          return (
            <Table.Column {...rest} key={key}>
              <Table.HeaderCell>
                {isNutrientName(key) ? (
                  <HeaderSummary title={label} sum={`${recipeWithNutrients[key]} ${nutrientUnit[key]}`} />
                ) : (
                  label
                )}
              </Table.HeaderCell>

              {key === "name" ? <FoodLinkCell dataKey={key} /> : <Table.Cell dataKey={key} />}
            </Table.Column>
          )
        })}
      </Table>
    </Container>
  )
}
