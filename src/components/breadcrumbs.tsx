import { forwardRef, PropsWithChildren } from "react"
import { Link, LinkProps } from "@tanstack/react-router"

export const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<{
    href: LinkProps["to"]
    title?: HTMLAnchorElement["title"]
    target?: HTMLAnchorElement["target"]
  }>
>(({ href, title, target, children }, ref) => {
  return (
    <Link ref={ref} to={href} title={title} target={target}>
      {children}
    </Link>
  )
})
