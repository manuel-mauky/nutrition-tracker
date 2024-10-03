import { ContentLayout } from "../../content-layout.tsx"
import { Text } from "rsuite"
import { useStore } from "../store.ts"
import { DateTime } from "luxon"
import { useMemo } from "react"
import { DiaryEntry, FoodDiaryEntry, IsoDateString, RecipeDiaryEntry } from "../types.ts"

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

function RecipeEntry({ entry }: { entry: RecipeDiaryEntry }) {
  const { recipes } = useStore()

  const recipe = recipes.find((recipe) => recipe.id === entry.recipeId)!

  return (
    <div>
      {entry.portions} x {recipe.name}
    </div>
  )
}

function FoodEntry({ entry }: { entry: FoodDiaryEntry }) {
  const { foods } = useStore()

  const food = foods.find((food) => food.id === entry.foodId)!

  return (
    <div>
      {entry.amountInGram}g {food.name}
    </div>
  )
}

function DayDiaryView({ day }: { day: DateTime }) {
  const { diaryEntries } = useStore()
  const asIsoDate = day.toISODate()

  if (!asIsoDate) {
    return null
  }

  const entries = diaryEntries[asIsoDate] ?? []

  return (
    <div>
      <h2>{asIsoDate}</h2>

      {entries.length > 0 ? (
        <>
          <ul>
            {entries.map((entry) => (
              <li key={entry.id}>
                <div>
                  {entry.mealType === "food" && <FoodEntry entry={entry} />}
                  {entry.mealType === "recipe" && <RecipeEntry entry={entry} />}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p>no entries</p>
        </>
      )}
    </div>
  )
}

export function DiaryRoute() {
  const { diaryEntries } = useStore()

  const today = useMemo(() => DateTime.now(), [])

  const oldestDay = DateTime.fromISO(getOldestDay(diaryEntries))

  const listOfDays = useMemo(() => getListOfDatesBetween(oldestDay, today), [])

  return (
    <ContentLayout header={<Text>Tagebuch</Text>}>
      <ul>
        {listOfDays.map((day) => (
          <li key={day.toISODate()}>
            <DayDiaryView day={day} />
          </li>
        ))}
      </ul>
    </ContentLayout>
  )
}
