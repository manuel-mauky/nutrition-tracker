import { useStore } from "../store.ts"
import { CellProps, ColumnProps, Container, Table } from "rsuite"
import { Recipe, RecipeWithNutrients } from "../types.ts"
import { useState } from "react"
import { SortType } from "rsuite-table"
import { Link } from "@tanstack/react-router"
import { selectRecipesWithNutrients } from "./recipe-utils.ts"

type RecipeColumn = ColumnProps<RecipeWithNutrients> & {
  key: keyof RecipeWithNutrients
  label: string
}

const columns: Array<RecipeColumn> = [
  {
    key: "name",
    label: "Name",
    width: 150,
    sortable: true,
  },
  {
    key: "kcal",
    label: "KCal",
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

function LinkCell({ rowData, ...rest }: CellProps<Recipe>) {
  return (
    <Table.Cell {...rest}>
      {rowData && (
        <Link to={"/recipes/$recipeId"} params={{ recipeId: rowData.id }}>
          {rowData.name}
        </Link>
      )}
    </Table.Cell>
  )
}

export function RecipesTable() {
  const recipesWithNutrients: Array<RecipeWithNutrients> = useStore(selectRecipesWithNutrients)

  const [sortColumn, setSortColumn] = useState<RecipeColumn["key"] | undefined>()
  const [sortType, setSortType] = useState<SortType | undefined>()

  function getData(): Array<RecipeWithNutrients> {
    if (sortColumn && sortType) {
      return recipesWithNutrients.sort((a, b) => {
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
      return recipesWithNutrients
    }
  }

  function handleSortColumn(sortColumn: string, sortType?: SortType) {
    setSortColumn(sortColumn as RecipeColumn["key"])
    setSortType(sortType)
  }

  return (
    <Container style={{ height: "100%" }}>
      <Table sortColumn={sortColumn} sortType={sortType} onSortColumn={handleSortColumn} autoHeight data={getData()}>
        {columns.map((column) => {
          const { key, label, ...rest } = column

          return (
            <Table.Column {...rest} key={key}>
              <Table.HeaderCell>{label}</Table.HeaderCell>

              {key === "name" ? <LinkCell dataKey={key} /> : <Table.Cell dataKey={key} />}
            </Table.Column>
          )
        })}
      </Table>
    </Container>
  )
}
