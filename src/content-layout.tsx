import { PropsWithChildren, ReactElement } from "react"
import { Container, Content, Header } from "rsuite"

import "./base-layout.css"

export function ContentLayout({ children, header }: PropsWithChildren<{ header?: ReactElement }>) {
  return (
    <Container id="content-layout-root">
      <Header>{header}</Header>
      <Content>{children}</Content>
    </Container>
  )
}
