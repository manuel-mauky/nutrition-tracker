import { ButtonToolbar } from "rsuite"
import { ContentLayout } from "../../content-layout.tsx"
import { FoodsTable } from "./foods-table.tsx"

import { FoodsBreadcrumb } from "./foods-breadcrumb.tsx"
import { AddFoodDialog } from "./add-food-dialog.tsx"

import "./foods.css"

export function FoodsRoute() {
  return (
    <ContentLayout header={<FoodsBreadcrumb />}>
      <div id="foods-root">
        <ButtonToolbar>
          <AddFoodDialog />
        </ButtonToolbar>
        <div style={{ flexGrow: 1 }}>
          <FoodsTable />
        </div>
      </div>
    </ContentLayout>
  )
}
