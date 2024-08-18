import { createLazyFileRoute } from "@tanstack/react-router"
import { ContentLayout } from "../content-layout.tsx"

export const Route = createLazyFileRoute("/foods")({
  component: FoodsPage,
})

function FoodsPage() {
  return (
    <ContentLayout title="Lebensmittel">
      <p>Lebensmittel content</p>
    </ContentLayout>
  )
}
