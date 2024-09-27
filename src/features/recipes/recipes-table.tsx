import { useStore } from "../store.ts"
import { CellProps, Container, Table } from "rsuite"
import { Recipe, RecipeWithNutrients } from "../types.ts"
import { SortType } from "rsuite-table"
import { Link } from "@tanstack/react-router"
import { selectRecipesWithNutrients } from "./recipe-utils.ts"
import { selectSortSettings } from "../settings/settings-slice.ts"
import { ColumnType, sort } from "../../utils/sort-utils.ts"

export type RecipeColumn = ColumnType<RecipeWithNutrients>

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
  const { changeSortSettings, sortColumn, sortType } = useStore(selectSortSettings("recipes"))
  const recipesWithNutrients: Array<RecipeWithNutrients> = useStore(selectRecipesWithNutrients)

  function getData(): Array<RecipeWithNutrients> {
    return sort(recipesWithNutrients, sortType, sortColumn)
  }

  function handleSortColumn(sortColumn: string, sortType?: SortType) {
    changeSortSettings({ sortType, sortColumn: sortColumn as RecipeColumn["key"] })
  }

  return (
    <Container style={{ height: "100%" }}>
      <Table fillHeight sortColumn={sortColumn} sortType={sortType} onSortColumn={handleSortColumn} data={getData()}>
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
