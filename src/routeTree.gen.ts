/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from "@tanstack/react-router"

// Import Routes

import { Route as rootRoute } from "./routes/__root"

// Create Virtual Routes

const RecipesLazyImport = createFileRoute("/recipes")()
const FoodsLazyImport = createFileRoute("/foods")()
const DiaryLazyImport = createFileRoute("/diary")()
const IndexLazyImport = createFileRoute("/")()

// Create/Update Routes

const RecipesLazyRoute = RecipesLazyImport.update({
  path: "/recipes",
  getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/recipes.lazy").then((d) => d.Route))

const FoodsLazyRoute = FoodsLazyImport.update({
  path: "/foods",
  getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/foods.lazy").then((d) => d.Route))

const DiaryLazyRoute = DiaryLazyImport.update({
  path: "/diary",
  getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/diary.lazy").then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/index.lazy").then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    "/diary": {
      id: "/diary"
      path: "/diary"
      fullPath: "/diary"
      preLoaderRoute: typeof DiaryLazyImport
      parentRoute: typeof rootRoute
    }
    "/foods": {
      id: "/foods"
      path: "/foods"
      fullPath: "/foods"
      preLoaderRoute: typeof FoodsLazyImport
      parentRoute: typeof rootRoute
    }
    "/recipes": {
      id: "/recipes"
      path: "/recipes"
      fullPath: "/recipes"
      preLoaderRoute: typeof RecipesLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  DiaryLazyRoute,
  FoodsLazyRoute,
  RecipesLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/diary",
        "/foods",
        "/recipes"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/diary": {
      "filePath": "diary.lazy.tsx"
    },
    "/foods": {
      "filePath": "foods.lazy.tsx"
    },
    "/recipes": {
      "filePath": "recipes.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
