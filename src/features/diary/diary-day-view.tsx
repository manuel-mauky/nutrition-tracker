import { DateTime } from "luxon"
import { Fragment, useMemo } from "react"
import { Heading, IconButton } from "rsuite"
import { useStore } from "../store.ts"
import { sortDateTime } from "../../utils/sort-utils.ts"
import { DiaryEntry, FoodDiaryEntry, RecipeDiaryEntry } from "../types.ts"
import { FormatTime } from "../../components/format-time.tsx"
import { AddDiaryEntryDialog } from "./add-diary-entry/add-diary-entry-dialog.tsx"
import { DiaryNutritionOverview } from "./diary-nutrition-overview.tsx"
import { PiX } from "react-icons/pi"

function RecipeEntryRow({ entry }: { entry: RecipeDiaryEntry }) {
  const { recipes, removeDiaryEntry } = useStore()

  let name = undefined

  if (entry.recipeId) {
    const recipe = recipes.find((recipe) => recipe.id === entry.recipeId)

    if (recipe) {
      name = recipe.name
    }
  }

  if (!name) {
    name = entry.recipeName ?? ""
  }

  function handleDelete() {
    removeDiaryEntry(entry.id)
  }

  return (
    <tr>
      <td>
        <FormatTime date={entry.date} />
      </td>
      <td>{entry.portions} x</td>
      <td>{name}</td>
      <td>
        <IconButton appearance="subtle" size="xs" icon={<PiX />} onClick={handleDelete} />
      </td>
    </tr>
  )
}

function FoodEntryRow({ entry }: { entry: FoodDiaryEntry }) {
  const { foods, removeDiaryEntry } = useStore()

  const food = foods.find((food) => food.id === entry.foodId)!

  function handleDelete() {
    removeDiaryEntry(entry.id)
  }

  return (
    <tr>
      <td>
        <FormatTime date={entry.date} />
      </td>
      <td>{entry.amountInGram}g</td>
      <td>{food.name}</td>
      <td>
        <IconButton appearance="subtle" size="xs" icon={<PiX />} onClick={handleDelete} />
      </td>
    </tr>
  )
}

export function DiaryDayView({ day }: { day: DateTime }) {
  const { diaryEntries } = useStore()
  const asIsoDate = day.toISODate()

  const entries: DiaryEntry[] = useMemo(() => {
    if (asIsoDate) {
      return diaryEntries[asIsoDate]?.toSorted((a, b) => sortDateTime(a.date, b.date)) ?? []
    } else {
      return []
    }
  }, [asIsoDate, diaryEntries])

  if (!asIsoDate) {
    return null
  }

  return (
    <div className="diary-day-overview-entry">
      <header className="diary-view-entries-header">
        <Heading level={3}>{asIsoDate}</Heading>
        <AddDiaryEntryDialog date={day} />
      </header>
      <div className="diary-view-nutrition-header">
        <Heading level={5}>Nährwerte</Heading>
      </div>
      <div className="diary-view-entries-container">
        {entries.length > 0 ? (
          <table style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col className="time-col" />
              <col className="amount-col" />
              <col className="name-col" />
              <col className="delete-col" />
            </colgroup>
            <tbody>
              {entries.map((entry) => (
                <Fragment key={entry.id}>
                  {entry.mealType === "food" && <FoodEntryRow entry={entry} />}
                  {entry.mealType === "recipe" && <RecipeEntryRow entry={entry} />}
                </Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Keine Einträge</p>
        )}
      </div>
      <div className="diary-view-nutrition-container">
        <DiaryNutritionOverview day={day} />
      </div>
    </div>
  )
}
