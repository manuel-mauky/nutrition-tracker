import { Button, CellProps, ColumnProps, Container, IconButton, Modal, Table } from "rsuite"
import { Food, Id } from "../types.ts"
import { useStore } from "../store.ts"
import { useState } from "react"
import type { SortType } from "rsuite-table"
import { Link } from "@tanstack/react-router"
import { PiTrash } from "react-icons/pi"
import { Icon } from "@rsuite/icons"

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

function LinkCell({ rowData, ...rest }: CellProps<Food>) {
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

function ActionsTableCell({ rowData, deleteAction, ...rest }: CellProps<Food> & { deleteAction: (id: Id) => void }) {
  if (!rowData) {
    return null
  }

  const foodId = rowData.id

  return (
    <>
      <Table.Cell {...rest} style={{ paddingTop: "4px" }}>
        <>
          <IconButton onClick={() => deleteAction(foodId)} aria-label="Löschen" icon={<Icon as={PiTrash} />} />
        </>
      </Table.Cell>
    </>
  )
}

function DeleteFoodWarningDialog({
  foodId,
  handleOk,
  handleCancel,
}: {
  foodId: Id | undefined
  handleOk: () => void
  handleCancel: () => void
}) {
  const { foods } = useStore()

  if (!foodId) {
    return null
  }

  const food = foods.find((food) => food.id === foodId)

  if (!food) {
    return null
  }

  return (
    <Modal open={true} role="alertdialog" backdrop="static" autoFocus>
      <Modal.Header>
        <Modal.Title>Lebensmittel löschen?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Möchten Sie "{food.name}" wirklich löschen?</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleOk} appearance="primary">
          Ok
        </Button>
        <Button onClick={handleCancel} appearance="subtle">
          Abbrechen
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export function FoodsTable() {
  const { foods, removeFood } = useStore()

  const [deleteClickedId, setDeleteClickedId] = useState<Id | undefined>()

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

  function handleDeleteAction(id: Id) {
    setDeleteClickedId(id)
  }

  function handleDeleteOk() {
    if (deleteClickedId) {
      removeFood(deleteClickedId)
    }

    setDeleteClickedId(undefined)
  }

  function handleDeleteCancel() {
    setDeleteClickedId(undefined)
  }

  return (
    <Container style={{ height: "100%" }}>
      <DeleteFoodWarningDialog foodId={deleteClickedId} handleOk={handleDeleteOk} handleCancel={handleDeleteCancel} />

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

        <Table.Column key="actions">
          <Table.HeaderCell>Aktionen</Table.HeaderCell>

          <ActionsTableCell deleteAction={handleDeleteAction} />
        </Table.Column>
      </Table>
    </Container>
  )
}
