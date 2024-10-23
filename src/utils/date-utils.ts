import { DateTime } from "luxon"

export function areDatesEqual(a?: Date, b?: Date) {
  if (!!a && !!b) {
    return a.getTime() === b.getTime()
  } else {
    return false
  }
}

export function areDateTimesEqual(a?: DateTime, b?: DateTime) {
  if (!!a && !!b) {
    return a.toSeconds() === b.toSeconds()
  } else {
    return false
  }
}
