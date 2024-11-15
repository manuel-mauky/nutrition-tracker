import { CustomProvider } from "rsuite"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import deDE from "rsuite/esm/locales/de_DE"
import { routeTree } from "./routeTree.gen.ts"
import { useStore } from "./features/store.ts"

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const adjustedLocaleDeDE: typeof deDE = {
  ...deDE,
  Plaintext: {
    ...deDE.Plaintext,
    unfilled: "",
  },
}

export function App() {
  const { theme } = useStore()

  return (
    <CustomProvider theme={theme} locale={adjustedLocaleDeDE}>
      <RouterProvider router={router} />
    </CustomProvider>
  )
}
