import React from "react"
import ReactDOM from "react-dom/client"

import "./index.css"
import "rsuite/dist/rsuite.min.css"

import { App } from "./app.tsx"

import "./i18n.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
