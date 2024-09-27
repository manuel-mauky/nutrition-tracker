import { SortType } from "rsuite-table"
import { ColumnProps } from "rsuite"

type Row = {
  [key: string]: string | number
}

export type ColumnType<T extends Row> = ColumnProps<T> & {
  key: keyof T
  label: string
}

export function sort<T extends Row, C extends ColumnType<T>>(
  items: Array<T>,
  sortType: SortType | undefined,
  sortColumn: C["key"] | undefined,
) {
  if (sortColumn && sortType) {
    return items.toSorted((a, b) => {
      let x: string | number = a[sortColumn]
      let y: string | number = b[sortColumn]

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
    return items
  }
}
