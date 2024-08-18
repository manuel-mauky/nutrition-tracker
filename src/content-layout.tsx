import { PropsWithChildren } from "react"
import { Container, Content, Header, Text } from "rsuite"

import "./base-layout.css"

export function ContentLayout({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <Container id="content-layout-root">
      <Header>
        <Text>{title}</Text>
      </Header>
      <Content>{children}</Content>
    </Container>
  )
}
