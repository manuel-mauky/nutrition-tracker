import { ContentLayout } from "../../content-layout.tsx"
import { Text } from "rsuite"
import { useStore } from "../store.ts"
import { DateTime } from "luxon"
import { useMemo } from "react"
import { DiaryEntry, IsoDateString } from "../types.ts"

import "./diary.css"
import { sortDateTime } from "../../utils/sort-utils.ts"
import { DiaryDayView } from "./diary-day-view.tsx"
import { useTranslation } from "react-i18next"

// The overview can be scrolled to the oldest day in the diary + this amount of days
const oldestDayAdditionalRange = 7

function getOldestDay(diaryEntries: Record<IsoDateString, Array<DiaryEntry>>) {
  const allDays = Object.keys(diaryEntries).toSorted()

  if (allDays.length > 0) {
    return allDays[0]
  } else {
    return DateTime.now().toISODate()
  }
}

function getListOfDatesBetween(start: DateTime, end: DateTime) {
  const list: Array<DateTime> = []

  let tmp = start

  while (tmp <= end) {
    list.push(tmp)
    tmp = tmp.plus({ day: 1 })
  }

  return list
}

export function DiaryRoute() {
  const { t } = useTranslation()
  const { diaryEntries } = useStore()

  const today = useMemo(() => DateTime.now(), [])

  const oldestDay = DateTime.fromISO(getOldestDay(diaryEntries))

  oldestDay.plus({ day: oldestDayAdditionalRange })

  const listOfDays = useMemo(
    () =>
      getListOfDatesBetween(oldestDay.minus({ day: oldestDayAdditionalRange }), today).toSorted((a, b) =>
        sortDateTime(b, a),
      ),
    [oldestDay, today],
  )

  return (
    <ContentLayout header={<Text>{t("diary.title")}</Text>}>
      <div id="diary-root">
        <ul className="diary-list-of-days">
          {listOfDays.map((day) => (
            <li key={day.toISODate()}>
              <DiaryDayView day={day} />
            </li>
          ))}
        </ul>
      </div>
    </ContentLayout>
  )
}
