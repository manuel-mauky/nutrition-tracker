import { DateTime } from "luxon"
import { ReactNode } from "react"

export function FormatTime({ date }: { date: string | DateTime }): ReactNode {
  const dateTime = typeof date === "string" ? DateTime.fromISO(date) : date
  const timeString = dateTime.toLocaleString(DateTime.TIME_24_SIMPLE)

  return (
    <time className="format-time" dateTime={timeString}>
      {timeString} Uhr
    </time>
  )
}
