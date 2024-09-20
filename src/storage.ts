import { RootStore } from "./features/store.ts"

export function migrate(persistedState: unknown, version: number): object | Promise<object> {
  if (version === 1) {
    // nothing to do yet
  }

  return persistedState as RootStore
}
