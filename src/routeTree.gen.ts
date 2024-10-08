/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from "@tanstack/react-router"

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as IndexImport } from "./routes/index"
import { Route as RecipesRecipeIdImport } from "./routes/recipes.$recipeId"
import { Route as FoodsFoodIdImport } from "./routes/foods.$foodId"

// Create Virtual Routes

const SettingsLazyImport = createFileRoute("/settings")()
const DiaryLazyImport = createFileRoute("/diary")()
const RecipesIndexLazyImport = createFileRoute("/recipes/")()
const FoodsIndexLazyImport = createFileRoute("/foods/")()

// Create/Update Routes

const SettingsLazyRoute = SettingsLazyImport.update({
  path: "/settings",
  getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/settings.lazy").then((d) => d.Route))

const DiaryLazyRoute = DiaryLazyImport.update({
  path: "/diary",
  getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/diary.lazy").then((d) => d.Route))

const IndexRoute = IndexImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const RecipesIndexLazyRoute = RecipesIndexLazyImport.update({
  path: "/recipes/",
  getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/recipes.index.lazy").then((d) => d.Route))

const FoodsIndexLazyRoute = FoodsIndexLazyImport.update({
  path: "/foods/",
  getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/foods.index.lazy").then((d) => d.Route))

const RecipesRecipeIdRoute = RecipesRecipeIdImport.update({
  path: "/recipes/$recipeId",
  getParentRoute: () => rootRoute,
} as any)

const FoodsFoodIdRoute = FoodsFoodIdImport.update({
  path: "/foods/$foodId",
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/diary": {
      id: "/diary"
      path: "/diary"
      fullPath: "/diary"
      preLoaderRoute: typeof DiaryLazyImport
      parentRoute: typeof rootRoute
    }
    "/settings": {
      id: "/settings"
      path: "/settings"
      fullPath: "/settings"
      preLoaderRoute: typeof SettingsLazyImport
      parentRoute: typeof rootRoute
    }
    "/foods/$foodId": {
      id: "/foods/$foodId"
      path: "/foods/$foodId"
      fullPath: "/foods/$foodId"
      preLoaderRoute: typeof FoodsFoodIdImport
      parentRoute: typeof rootRoute
    }
    "/recipes/$recipeId": {
      id: "/recipes/$recipeId"
      path: "/recipes/$recipeId"
      fullPath: "/recipes/$recipeId"
      preLoaderRoute: typeof RecipesRecipeIdImport
      parentRoute: typeof rootRoute
    }
    "/foods/": {
      id: "/foods/"
      path: "/foods"
      fullPath: "/foods"
      preLoaderRoute: typeof FoodsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    "/recipes/": {
      id: "/recipes/"
      path: "/recipes"
      fullPath: "/recipes"
      preLoaderRoute: typeof RecipesIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  DiaryLazyRoute,
  SettingsLazyRoute,
  FoodsFoodIdRoute,
  RecipesRecipeIdRoute,
  FoodsIndexLazyRoute,
  RecipesIndexLazyRoute,
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
        "/settings",
        "/foods/$foodId",
        "/recipes/$recipeId",
        "/foods/",
        "/recipes/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/diary": {
      "filePath": "diary.lazy.tsx"
    },
    "/settings": {
      "filePath": "settings.lazy.tsx"
    },
    "/foods/$foodId": {
      "filePath": "foods.$foodId.tsx"
    },
    "/recipes/$recipeId": {
      "filePath": "recipes.$recipeId.tsx"
    },
    "/foods/": {
      "filePath": "foods.index.lazy.tsx"
    },
    "/recipes/": {
      "filePath": "recipes.index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
