import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/foods")({
  component: FoodsPage,
})

function FoodsPage() {
  return (
    <div>
      <h3>Lebensmittel</h3>
    </div>
  )
}
