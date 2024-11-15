import { PropsWithChildren, ReactElement } from "react"
import { Container, Header, Panel } from "rsuite"

import "./base-layout.css"

export function ContentLayout({ children, header }: PropsWithChildren<{ header?: ReactElement }>) {
  return (
    <Container id="content-layout-root">
      <Panel header={<Header>{header}</Header>}>{children}</Panel>
    </Container>
  )
}
