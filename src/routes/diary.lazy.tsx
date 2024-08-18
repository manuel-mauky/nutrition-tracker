import { createLazyFileRoute } from "@tanstack/react-router"
import { ContentLayout } from "../content-layout.tsx"

export const Route = createLazyFileRoute("/diary")({
  component: DiaryPage,
})

function DiaryPage() {
  return (
    <ContentLayout title="Tagebuch">
      <p>tagebuch content</p>
    </ContentLayout>
  )
}
