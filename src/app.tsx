import { Container, Content, Header, HStack, IconButton, Nav, Sidebar, Sidenav, Stack, Text } from "rsuite"
import { PropsWithChildren, useState } from "react"

import { Icon } from "@rsuite/icons"

import { PiAvocado, PiBowlSteam, PiCaretLeft, PiCaretRight, PiPepper, PiListBullets } from "react-icons/pi"
import { Link, LinkProps, Outlet, useLinkProps } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { IconType } from "react-icons"

function Brand({ expand }: { expand: boolean }) {
  return (
    <HStack
      style={{
        height: "50px",
        padding: "10px 15px",
        fontSize: "20px",
        overflow: "hidden",
      }}
      spacing={12}
    >
      <Icon style={{ minHeight: "25px", minWidth: "25px" }} as={PiPepper} />
      {expand && <Text style={{ whiteSpace: "nowrap" }}>Nutrition Tracker</Text>}
    </HStack>
  )
}

const borderStyle = "1px solid var(--rs-border-primary)"

function NavToggle({ expand, onChange }: { expand: boolean; onChange: () => void }) {
  return (
    <Stack style={{ borderTop: borderStyle, padding: "6px" }} justifyContent={expand ? "flex-end" : "center"}>
      <IconButton onClick={onChange} appearance="subtle" size="lg" icon={expand ? <PiCaretLeft /> : <PiCaretRight />} />
    </Stack>
  )
}

function NavLink({ children, icon, to }: PropsWithChildren<{ icon: IconType } & LinkProps>) {
  const linkProps = useLinkProps({ to })

  // @ts-expect-error 'data-status' is not part of the link attributes type
  const isActive = linkProps["data-status"] === "active"

  return (
    <Nav.Item active={isActive} to={to} as={Link} icon={<Icon as={icon} />}>
      {children}
    </Nav.Item>
  )
}

function App() {
  const [expand, setExpand] = useState(true)

  return (
    <Container style={{ height: "100%" }}>
      <Sidebar
        style={{ display: "flex", flexDirection: "column", borderRight: borderStyle }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav.Header>
          <Brand expand={expand} />
        </Sidenav.Header>
        <Sidenav style={{ height: "100%" }} expanded={expand} defaultOpenKeys={["1"]}>
          <Sidenav.Body>
            <Nav defaultActiveKey="1">
              <NavLink to="/diary" icon={PiListBullets}>
                Tagebuch
              </NavLink>
              <NavLink to="/foods" icon={PiAvocado}>
                Lebensmittel
              </NavLink>
              <NavLink to="/recipes" icon={PiBowlSteam}>
                Rezepte
              </NavLink>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </Sidebar>

      <Container>
        <Header className="page-header"></Header>
        <Content>
          <Outlet />
          <TanStackRouterDevtools />
        </Content>
      </Container>
    </Container>
  )
}

export default App
