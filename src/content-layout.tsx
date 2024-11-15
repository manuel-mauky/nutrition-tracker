import { PropsWithChildren, ReactElement } from "react"
import { Container, Header, Panel } from "rsuite"

import "./base-layout.css"
import { GlobalQuickSettings } from "./components/global-quick-settings.tsx"

export function ContentLayout({ children, header }: PropsWithChildren<{ header?: ReactElement }>) {
  return (
    <Container id="content-layout-root">
      <GlobalQuickSettings />
      <Panel header={<Header>{header}</Header>}>{children}</Panel>
    </Container>
  )
}
