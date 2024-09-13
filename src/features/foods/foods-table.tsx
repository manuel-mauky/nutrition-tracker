import { CellProps, ColumnProps, Container, Table } from "rsuite"
import { Food } from "../types.ts"
import { useStore } from "../store.ts"
import { useState } from "react"
import type { SortType } from "rsuite-table"
import { Link } from "@tanstack/react-router"
import { DeleteFoodButton } from "./delete-food-button.tsx"

type FoodColumn = ColumnProps<Food> & {
  key: keyof Food
  label: string
}

const columns: Array<FoodColumn> = [
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

export function FoodLinkCell({ rowData, ...rest }: CellProps<Food>) {
  return (
    <Table.Cell {...rest}>
      {rowData && (
        <Link to={"/foods/$foodId"} params={{ foodId: rowData.id }}>
          {rowData.name}
        </Link>
      )}
    </Table.Cell>
  )
}

function ActionsTableCell({ rowData, ...rest }: CellProps<Food>) {
  if (!rowData) {
    return null
  }

  const foodId = rowData.id

  return (
    <>
      <Table.Cell {...rest} style={{ paddingTop: "4px" }}>
        <>
          <DeleteFoodButton foodId={foodId} hideLabel />
        </>
      </Table.Cell>
    </>
  )
}

export function FoodsTable() {
  const { foods } = useStore()

  const [sortColumn, setSortColumn] = useState<FoodColumn["key"] | undefined>()
  const [sortType, setSortType] = useState<SortType | undefined>()

  function getData() {
    if (sortColumn && sortType) {
      return foods.sort((a, b) => {
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
      return foods
    }
  }

  function handleSortColumn(sortColumn: string, sortType?: SortType) {
    setSortColumn(sortColumn as FoodColumn["key"])
    setSortType(sortType)
  }

  return (
    <Container style={{ height: "100%" }}>
      <Table fillHeight sortColumn={sortColumn} sortType={sortType} onSortColumn={handleSortColumn} data={getData()}>
        {columns.map((column) => {
          const { key, label, ...rest } = column
          return (
            <Table.Column {...rest} key={key}>
              <Table.HeaderCell>{label}</Table.HeaderCell>

              {key === "name" ? <FoodLinkCell dataKey={key} /> : <Table.Cell dataKey={key} />}
            </Table.Column>
          )
        })}

        <Table.Column key="actions">
          <Table.HeaderCell>Aktionen</Table.HeaderCell>

          <ActionsTableCell />
        </Table.Column>
      </Table>
    </Container>
  )
}
