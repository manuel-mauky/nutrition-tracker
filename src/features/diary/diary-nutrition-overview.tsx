import { DateTime } from "luxon"
import { Text } from "rsuite"
import { PropsWithChildren, useMemo } from "react"
import { useStore } from "../store.ts"
import { Nutrients } from "../types.ts"
import { calcNutrientsOfDay, createFoodsMap } from "../recipes/recipe-utils.ts"
import { useTranslation } from "react-i18next"

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

  const { t } = useTranslation()

  const nutrients: Nutrients = useMemo(() => {
    const foodsMap = createFoodsMap(foods)

    return calcNutrientsOfDay(foodsMap, diaryEntries, day)
  }, [foods, diaryEntries, day])

  return (
    <div className="diary-view-nutrition-overview">
      <Label variant="main">{t("domain.kcal")}</Label>
      <Value variant="main" value={nutrients.kcal} />

      <Label variant="main">{t("domain.protein")}</Label>
      <Value variant="main" value={nutrients.protein} />

      <Label>{t("domain.fiber")}</Label>
      <Value value={nutrients.fiber} />

      <Label>{t("domain.fat")}</Label>
      <Value value={nutrients.fat} />

      <Label>{t("domain.sugar")}</Label>
      <Value value={nutrients.sugar} />

      <Label>{t("domain.carbs")}</Label>
      <Value value={nutrients.carbs} />
    </div>
  )
}
