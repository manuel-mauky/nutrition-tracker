import { ColumnProps, Container, Table } from "rsuite"
import { Food } from "../types.ts"
import { useStore } from "../store.ts"
import { useState } from "react"
import type { SortType } from "rsuite-table"

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
      <Table sortColumn={sortColumn} sortType={sortType} onSortColumn={handleSortColumn} autoHeight data={getData()}>
        {columns.map((column) => {
          const { key, label, ...rest } = column
          return (
            <Table.Column {...rest} key={key}>
              <Table.HeaderCell>{label}</Table.HeaderCell>
              <Table.Cell dataKey={key} />
            </Table.Column>
          )
        })}
      </Table>
    </Container>
  )
}