import { createLazyFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/")({
  component: IndexPage,
})

function IndexPage() {
  return <Navigate to="/diary" />
}
