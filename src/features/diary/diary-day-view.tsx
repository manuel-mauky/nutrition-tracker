import { DateTime } from "luxon"
import { Fragment, useMemo } from "react"
import { Button, Heading } from "rsuite"
import { useStore } from "../store.ts"
import { sortDateTime } from "../../utils/sort-utils.ts"
import { FoodDiaryEntry, RecipeDiaryEntry } from "../types.ts"
import { FormatTime } from "../../components/format-time.tsx"

function RecipeEntryRow({ entry }: { entry: RecipeDiaryEntry }) {
  const { recipes } = useStore()

  const recipe = recipes.find((recipe) => recipe.id === entry.recipeId)!

  return (
    <tr>
      <td>
        <FormatTime date={entry.date} />
      </td>
      <td>{entry.portions} x</td>
      <td>{recipe.name}</td>
    </tr>
  )
}

function FoodEntryRow({ entry }: { entry: FoodDiaryEntry }) {
  const { foods } = useStore()

  const food = foods.find((food) => food.id === entry.foodId)!

  return (
    <tr>
      <td>
        <FormatTime date={entry.date} />
      </td>
      <td>{entry.amountInGram}g</td>
      <td>{food.name}</td>
    </tr>
  )
}

export function DiaryDayView({ day }: { day: DateTime }) {
  const { diaryEntries } = useStore()
  const asIsoDate = day.toISODate()

  const entries = useMemo(() => {
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
      <header>
        <Heading level={3}>{asIsoDate}</Heading>
        <Button>Eintrag Hinzufügen</Button>
      </header>

      <div className="diary-view-container">
        <div className="entries-table">
          {entries.length > 0 ? (
            <table style={{ tableLayout: "fixed" }}>
              <colgroup>
                <col className="time-col" />
                <col className="amount-col" />
                <col className="name-col" />
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

        <div className="nutrition-overview">
          <Heading level={5}>Nährwerte</Heading>
        </div>
      </div>
    </div>
  )
}
