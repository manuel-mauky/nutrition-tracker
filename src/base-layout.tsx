import { Container, Divider, HStack, IconButton, Nav, Sidebar, Sidenav, Stack, Text } from "rsuite"
import { PropsWithChildren, useState } from "react"

import { Icon } from "@rsuite/icons"

import { PiAvocado, PiBowlSteam, PiCaretLeft, PiCaretRight, PiPepper, PiListBullets, PiSliders } from "react-icons/pi"
import { Link, LinkProps, Outlet, useLinkProps } from "@tanstack/react-router"
import { IconType } from "react-icons"

import "./base-layout.css"
import { useTranslation } from "react-i18next"

function Brand({ expand }: { expand: boolean }) {
  const { t } = useTranslation()
  return (
    <HStack className="brand" spacing={12}>
      <Icon as={PiPepper} />
      {expand && <Text>{t("common.appTitle")}</Text>}
    </HStack>
  )
}

function NavToggle({ expand, onChange }: { expand: boolean; onChange: () => void }) {
  return (
    <Stack className="nav-toggle" justifyContent={expand ? "flex-end" : "center"}>
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

function BaseLayout() {
  const { t } = useTranslation()
  const [expand, setExpand] = useState(true)

  return (
    <Container className="app-base-layout">
      <Sidebar className="app-sidebar" width={expand ? 250 : 56} collapsible>
        <Sidenav.Header>
          <Brand expand={expand} />
        </Sidenav.Header>
        <Sidenav expanded={expand} defaultOpenKeys={["1"]} appearance="subtle">
          <Sidenav.Body>
            <Nav defaultActiveKey="1">
              <NavLink to="/diary" icon={PiListBullets}>
                {t("diary.navLink")}
              </NavLink>
              <NavLink to="/foods" icon={PiAvocado}>
                {t("foods.navLink")}
              </NavLink>
              <NavLink to="/recipes" icon={PiBowlSteam}>
                {t("recipes.navLink")}
              </NavLink>
              <Divider style={{ margin: "12px 0px" }} />
              <NavLink to="/settings" icon={PiSliders}>
                {t("settings.navLink")}
              </NavLink>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </Sidebar>
      <Outlet />
    </Container>
  )
}

export default BaseLayout
