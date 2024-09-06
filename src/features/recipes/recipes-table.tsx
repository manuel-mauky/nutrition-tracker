import { RootStore, useStore } from "../store.ts"
import { CellProps, ColumnProps, Container, Table } from "rsuite"
import { Food, Id, Ingredient, nutrientNames, Nutrients, Recipe } from "../types.ts"
import { useState } from "react"
import { SortType } from "rsuite-table"
import { createSelector } from "reselect"
import { Link } from "@tanstack/react-router"

type RecipeWithNutrients = Omit<Recipe, "ingredients"> & Nutrients

type RecipeColumn = ColumnProps<RecipeWithNutrients> & {
  key: keyof RecipeWithNutrients
  label: string
}

const columns: Array<RecipeColumn> = [
  {
    key: "name",
    label: "Name",
    width: 150,
    sortable: true,
  },
  {
    key: "kcal",
    label: "KCal",
    sortable: true,
  },
  {
    key: "carbs",
    label: "Kohlenhydrate",
    width: 130,
    sortable: true,
  },
  {
    key: "sugar",
    label: "Zucker",
    width: 80,
    sortable: true,
  },
  {
    key: "fiber",
    label: "Balaststoffe",
    width: 120,
    sortable: true,
  },
  {
    key: "fat",
    label: "Fett",
    width: 80,
    sortable: true,
  },
  {
    key: "protein",
    label: "Eiweiß",
    width: 80,
    sortable: true,
  },
]

/**
 * Calculate a specific nutrient (by key) for a given ingredient.
 * In food, nutrients are persisted in amount by 100g.
 * In recipes the amount is defined by ingredients.
 * This function calculates the nutrient amount for this ingredient
 *
 * @param food
 * @param ingredient
 * @param key
 */
function calcNutrientForFood(food: Food, ingredient: Ingredient, key: keyof Nutrients): number {
  return Math.floor((food[key] / 100) * ingredient.amountInGram)
}

/**
 * Calculate the sum of all nutrients for a given recipe.
 *
 * @param foodsMap a map of all foods. This is needed to take the basic nutrient values for foods
 * @param recipe
 */
function calcNutrients(foodsMap: Record<Id, Food>, recipe: Recipe): RecipeWithNutrients {
  // transform all ingredients to a list of nutrients.
  const nutrients: Array<Nutrients> = recipe.ingredients.map((ingredient) => {
    const food = foodsMap[ingredient.foodId]

    // for every nutrient we calculate the nutrient amount of that ingredient
    return nutrientNames.reduce((prev, nutrientName) => {
      const value = calcNutrientForFood(food, ingredient, nutrientName)
      return {
        ...prev,
        [nutrientName]: value,
      }
    }, {}) as Nutrients
  })

  // first need a record of nutrientName to 0 that is used
  // as a starting value for the next reduce step
  const initial = nutrientNames.reduce((prev, nutrientName) => {
    return {
      ...prev,
      [nutrientName]: 0,
    }
  }, {}) as Nutrients

  // now we can go through all nutrients and sum up all nutrient values to get the nutrients of the whole recipe
  const sumValues: Nutrients = nutrients.reduce((sumValues, nutrient) => {
    // for this, we go through all nutrientNames and sum up the values
    return nutrientNames.reduce((prev, nutrientName) => {
      return {
        ...prev,
        [nutrientName]: sumValues[nutrientName] + nutrient[nutrientName],
      }
    }, {}) as Nutrients
  }, initial)

  return {
    ...recipe,
    ...sumValues,
  }
}

const selectRecipesWithNutrients = createSelector(
  [(state: RootStore) => state.foods, (state: RootStore) => state.recipes],
  (foods, recipes) => {
    const foodsMap: Record<Id, Food> = foods.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.id]: curr,
      }
    }, {})

    return recipes.map((recipe) => calcNutrients(foodsMap, recipe))
  },
)

function LinkCell({ rowData, ...rest }: CellProps<Recipe>) {
  return (
    <Table.Cell {...rest}>
      {rowData && (
        <Link to={"/recipes/$recipeId"} params={{ recipeId: rowData.id }}>
          {rowData.name}
        </Link>
      )}
    </Table.Cell>
  )
}

export function RecipesTable() {
  const recipesWithNutrients: Array<RecipeWithNutrients> = useStore(selectRecipesWithNutrients)

  const [sortColumn, setSortColumn] = useState<RecipeColumn["key"] | undefined>()
  const [sortType, setSortType] = useState<SortType | undefined>()

  function getData(): Array<RecipeWithNutrients> {
    if (sortColumn && sortType) {
      return recipesWithNutrients.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]

        if (typeof x === "string") {
          x = x.charCodeAt(0)
        }

        if (typeof y === "string") {
          y = y.charCodeAt(0)
        }

        if (sortType === "asc") {
          return x - y
        } else {
          return y - x
        }
      })
    } else {
      return recipesWithNutrients
    }
  }

  function handleSortColumn(sortColumn: string, sortType?: SortType) {
    setSortColumn(sortColumn as RecipeColumn["key"])
    setSortType(sortType)
  }

  return (
    <Container style={{ height: "100%" }}>
      <Table sortColumn={sortColumn} sortType={sortType} onSortColumn={handleSortColumn} autoHeight data={getData()}>
        {columns.map((column) => {
          const { key, label, ...rest } = column

          return (
            <Table.Column {...rest} key={key}>
              <Table.HeaderCell>{label}</Table.HeaderCell>

              {key === "name" ? <LinkCell dataKey={key} /> : <Table.Cell dataKey={key} />}
            </Table.Column>
          )
        })}
      </Table>
    </Container>
  )
}
