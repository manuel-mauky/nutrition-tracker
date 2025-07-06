import { DateTime } from "luxon"
import { Text } from "rsuite"
import { PropsWithChildren, useMemo } from "react"
import { useStore } from "../store.ts"
import { Nutrients } from "../types.ts"
import { calcNutrientsOfDay, createFoodsMap } from "../recipes/recipe-utils.ts"

type Variant = "main" | "side"

function Value({ value, variant = "side" }: { value: number; variant?: Variant }) {
  return <Text size={variant === "main" ? "xxl" : "md"}>{value}</Text>
}

function Label({ children, variant = "side" }: PropsWithChildren<{ variant?: Variant }>) {
  return (
    <Text size={variant === "main" ? "xxl" : "md"} muted={variant === "side"} as="label">
      {children}
    </Text>
  )
}

export function DiaryNutritionOverview({ day }: { day: DateTime }) {
  const { foods, diaryEntries } = useStore()

  const nutrients: Nutrients = useMemo(() => {
    const foodsMap = createFoodsMap(foods)

    return calcNutrientsOfDay(foodsMap, diaryEntries, day)
  }, [foods, diaryEntries, day])

  return (
    <div className="diary-view-nutrition-overview">
      <Label variant="main">KCal</Label>
      <Value variant="main" value={nutrients.kcal} />

      <Label variant="main">Eiweiß</Label>
      <Value variant="main" value={nutrients.protein} />

      <Label>Balaststoffe</Label>
      <Value value={nutrients.fiber} />

      <Label>Fett</Label>
      <Value value={nutrients.fat} />

      <Label>Zucker</Label>
      <Value value={nutrients.sugar} />

      <Label>Kohlenhydrate</Label>
      <Value value={nutrients.carbs} />
    </div>
  )
}
