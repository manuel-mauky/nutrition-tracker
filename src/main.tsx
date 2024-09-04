import React from "react"
import ReactDOM from "react-dom/client"
import { CustomProvider } from "rsuite"

import deDE from "rsuite/locales/de_DE"

import "./index.css"
import "rsuite/dist/rsuite.min.css"

import { routeTree } from "./routeTree.gen.ts"
import { createRouter, RouterProvider } from "@tanstack/react-router"

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CustomProvider theme="light" locale={adjustedLocaleDeDE}>
      <RouterProvider router={router} />
    </CustomProvider>
  </React.StrictMode>,
)
