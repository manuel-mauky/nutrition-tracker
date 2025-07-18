import { Id, Ingredient, isNutrientName, Nutrients, nutrientUnit, Recipe } from "../types.ts"
import { useStore } from "../store.ts"
import { calcNutrients, calcNutrientsForIngredient, createFoodsMap } from "./recipe-utils.ts"
import { CellProps, Container, Table } from "rsuite"
import { useMemo } from "react"
import { SortType } from "rsuite-table"
import { FoodLinkCell } from "../foods/foods-table.tsx"
import { InlineNumberField } from "../../components/form-fields.tsx"
import { DeleteIngredientButton } from "./delete-ingredient-button.tsx"
import { selectSortSettings } from "../settings/settings-slice.ts"
import { ColumnType, sort } from "../../utils/sort-utils.ts"

import { useTranslation } from "react-i18next"

type IngredientData = Ingredient &
  Nutrients & {
    name: string
  }

export type IngredientColumn = ColumnType<IngredientData>

const columns: Array<IngredientColumn> = [
  {
    key: "amountInGram",
    label: "labels.amountInGram",
    width: 150,
    sortable: true,
  },
  {
    key: "name",
    label: "labels.name",
    width: 150,
    sortable: true,
  },
  {
    key: "kcal",
    label: "domain.kcal",
    width: 80,
    sortable: true,
  },
  {
    key: "carbs",
    label: "domain.carbs",
    width: 130,
    sortable: true,
  },
  {
    key: "sugar",
    label: "domain.sugar",
    width: 80,
    sortable: true,
  },
  {
    key: "fiber",
    label: "domain.fiber",
    width: 120,
    sortable: true,
  },
  {
    key: "fat",
    label: "domain.fat",
    width: 80,
    sortable: true,
  },
  {
    key: "protein",
    label: "domain.protein",
    width: 80,
    sortable: true,
  },
]

function HeaderSummary({ title, sum }: { title: string; sum: string }) {
  return (
    <div>
      <label>{title}</label>
      <div style={{ color: "var(--rs-text-primary)", fontSize: "14px" }}>{sum}</div>
    </div>
  )
}

function AmountCell({
  rowData,
  onAmountChanged,
  ...rest
}: CellProps<IngredientData> & {
  onAmountChanged: (ingredientId: Id, newValue: number) => void
}) {
  return (
    <Table.Cell {...rest}>
      {rowData && (
        <InlineNumberField
          value={rowData.amountInGram}
          onSave={(newValue) => onAmountChanged(rowData.ingredientId, newValue)}
        />
      )}
    </Table.Cell>
  )
}

function ActionsTableCell({ rowData, recipe, ...rest }: CellProps<IngredientData> & { recipe: Recipe }) {
  if (!rowData) {
    return null
  }

  const ingredientId = rowData.ingredientId

  return (
    <Table.Cell {...rest} style={{ paddingTop: "4px" }}>
      <DeleteIngredientButton recipe={recipe} ingredientId={ingredientId} hideLabel />
    </Table.Cell>
  )
}

export function IngredientTable({ recipe }: { recipe: Recipe }) {
  const { changeSortSettings, sortType, sortColumn } = useStore(selectSortSettings("recipeIngredients"))

  const { t } = useTranslation()

  const { foods, editRecipe } = useStore()

  const ingredientsData: Array<IngredientData> = useMemo(() => {
    const foodsMap = createFoodsMap(foods)
    return recipe.ingredients.map((ingredient) => {
      const food = foodsMap[ingredient.foodId]

      const nutrients = calcNutrientsForIngredient(foodsMap, ingredient)

      return {
        ingredientId: ingredient.ingredientId,
        foodId: food.id,
        name: food.name,
        amountInGram: ingredient.amountInGram,
        ...nutrients,
      }
    })
  }, [recipe, foods])

  const recipeWithNutrients = useMemo(() => {
    const foodsMap = createFoodsMap(foods)
    return calcNutrients(foodsMap, recipe)
  }, [foods, recipe])

  function getData() {
    return sort(ingredientsData, sortType, sortColumn)
  }

  function handleSortColumn(sortColumn: string, sortType?: SortType) {
    changeSortSettings({ sortType, sortColumn: sortColumn as IngredientColumn["key"] })
  }

  function onChangeAmount(ingredientId: Id, newAmount: number) {
    const newRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) =>
        ingredient.ingredientId === ingredientId
          ? {
              ...ingredient,
              amountInGram: newAmount,
            }
          : ingredient,
      ),
    }

    editRecipe(newRecipe)
  }

  return (
    <Container style={{ height: "100%" }}>
      <Table
        headerHeight={80}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        fillHeight
        data={getData()}
      >
        {columns.map((column) => {
          const { key, label, ...rest } = column

          let cell

          switch (key) {
            case "amountInGram": {
              cell = <AmountCell dataKey={key} onAmountChanged={onChangeAmount} />
              break
            }
            case "name": {
              cell = <FoodLinkCell dataKey={key} />
              break
            }
            default: {
              cell = <Table.Cell dataKey={key} />
              break
            }
          }

          return (
            <Table.Column {...rest} key={key}>
              <Table.HeaderCell>
                {isNutrientName(key) ? (
                  <HeaderSummary title={t(label)} sum={`${recipeWithNutrients[key]} ${nutrientUnit[key]}`} />
                ) : (
                  t(label)
                )}
              </Table.HeaderCell>
              {cell}
            </Table.Column>
          )
        })}

        <Table.Column key="actions">
          <Table.HeaderCell>{t("labels.actions")}</Table.HeaderCell>
          <ActionsTableCell recipe={recipe} />
        </Table.Column>
      </Table>
    </Container>
  )
}
