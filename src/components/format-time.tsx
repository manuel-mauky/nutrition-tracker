import { DateTime } from "luxon"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

export function FormatTime({ date }: { date: string | DateTime }): ReactNode {
  const { t } = useTranslation()
  const dateTime = typeof date === "string" ? DateTime.fromISO(date) : date
  const timeString = dateTime.toLocaleString(DateTime.TIME_24_SIMPLE)

  return (
    <time className="format-time" dateTime={timeString}>
      {t("labels.time", { timeString })}
    </time>
  )
}
