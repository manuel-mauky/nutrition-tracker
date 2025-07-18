import { FoodAmount, Id } from "../../types.ts"
import { useStore } from "../../store.ts"
import { CellProps, IconButton, Table } from "rsuite"
import { ColumnType } from "../../../utils/sort-utils.ts"
import { InlineNumberField } from "../../../components/form-fields.tsx"

import { AddRecipeFormData } from "./add-recipe-entry-form.tsx"
import { Control, useFieldArray } from "react-hook-form"
import { Icon } from "@rsuite/icons"
import { PiTrash } from "react-icons/pi"
import { AddIngredientButton, AddIngredientFormValue } from "../../recipes/add-ingredient-button.tsx"
import { useTranslation } from "react-i18next"

type FoodAmountTableData = FoodAmount & { foodName: string; fieldId: string }

type FoodsTableColumn = ColumnType<FoodAmountTableData>

const columns: Array<FoodsTableColumn> = [
  {
    key: "amountInGram",
    label: "labels.amountInGram",
    width: 150,
  },
  {
    key: "foodName",
    label: "labels.name",
    flexGrow: 1,
  },
]

function AmountCell({
  rowData,
  onAmountChanged,
  rowIndex,
  ...rest
}: CellProps<FoodAmountTableData> & {
  onAmountChanged: (index: number, foodId: Id, newValue: number) => void
}) {
  return (
    <Table.Cell {...rest}>
      {rowData && (
        <InlineNumberField
          value={rowData.amountInGram}
          onSave={(newValue) => onAmountChanged(rowIndex ?? 0, rowData.foodId, newValue)}
        />
      )}
    </Table.Cell>
  )
}

function DeleteFoodTableCell({
  rowData,
  rowIndex,
  onRemove,
  ...rest
}: CellProps<FoodAmountTableData> & { onRemove: (index: number) => void }) {
  if (!rowData || rowIndex === undefined) {
    return null
  }

  return (
    <Table.Cell {...rest} style={{ paddingTop: "4px" }}>
      <IconButton aria-label="Löschen" onClick={() => onRemove(rowIndex)} icon={<Icon as={PiTrash} />} />
    </Table.Cell>
  )
}

export function SelectedRecipeFoodsTable({ control }: { control: Control<AddRecipeFormData> }) {
  const { t } = useTranslation()
  const { foods: allFoods } = useStore()

  const { fields, update, remove, prepend } = useFieldArray({
    control,
    name: "foods",
  })

  const data: Array<FoodAmountTableData> = fields.map((field) => ({
    fieldId: field.id,
    foodId: field.foodId,
    amountInGram: field.amountInGram,
    foodName: allFoods.find((f) => f.id === field.foodId)!.name,
  }))

  if (data.length === 0) {
    return <p>{t("recipes.recipeDoesntContainFoods")}</p>
  }

  function onAmountChanged(index: number, foodId: Id, newValue: number) {
    update(index, {
      foodId,
      amountInGram: newValue,
    })
  }

  function onAddIngredient(ingredient: AddIngredientFormValue) {
    prepend({
      foodId: ingredient.foodId,
      amountInGram: ingredient.amount,
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: ".5em" }}>
      <p>{t("diary.adjustIngredients")}</p>
      <p>{t("diary.adjustIngredientsHint1")}</p>

      <AddIngredientButton onAddIngredient={onAddIngredient} existingFoods={data.map((d) => d.foodId)} />

      <div style={{ flexGrow: 1, width: "100%" }}>
        <Table fillHeight data={data}>
          {columns.map((column) => {
            const { key, label, ...rest } = column

            let cell

            switch (key) {
              case "amountInGram": {
                cell = <AmountCell dataKey={key} onAmountChanged={onAmountChanged} />
                break
              }

              default: {
                cell = <Table.Cell dataKey={key} />
              }
            }

            return (
              <Table.Column {...rest} key={key}>
                <Table.HeaderCell>{t(label)}</Table.HeaderCell>
                {cell}
              </Table.Column>
            )
          })}
          <Table.Column key="delete">
            <Table.HeaderCell>{t("common.delete")}</Table.HeaderCell>

            <DeleteFoodTableCell onRemove={remove} />
          </Table.Column>
        </Table>
      </div>
    </div>
  )
}
