import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/diary")({
  component: DiaryPage,
})

function DiaryPage() {
  return (
    <div>
      <h3>Tagebuch</h3>
    </div>
  )
}
