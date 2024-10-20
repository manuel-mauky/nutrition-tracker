import { SortType } from "rsuite-table"
import { ColumnProps } from "rsuite"
import { DateTime } from "luxon"

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

export function sortDateTime(a: string | DateTime, b: string | DateTime): number {
  return (
    (typeof a === "string" ? DateTime.fromISO(a) : a).toSeconds() -
    (typeof b === "string" ? DateTime.fromISO(b) : b).toSeconds()
  )
}
