import { createLazyFileRoute } from "@tanstack/react-router"
import { SettingsRoute } from "../features/settings/settings.route.tsx"

export const Route = createLazyFileRoute("/settings")({
  component: SettingsRoute,
})
