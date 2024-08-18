import { createLazyFileRoute } from "@tanstack/react-router"
import { DiaryRoute } from "../features/diary/diary.route.tsx"

export const Route = createLazyFileRoute("/diary")({
  component: DiaryRoute,
})
