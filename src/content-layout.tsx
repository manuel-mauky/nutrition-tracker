import { PropsWithChildren, ReactElement } from "react"
import { Header } from "rsuite"

import "./base-layout.css"
import { GlobalQuickSettings } from "./components/global-quick-settings.tsx"

export function ContentLayout({ children, header }: PropsWithChildren<{ header?: ReactElement }>) {
  return (
    <div id="content-container-root">
      <div className="content-container-header">
        <Header>{header}</Header>
        <GlobalQuickSettings />
      </div>
      <div className="content-container-body">{children}</div>
    </div>
  )
}
