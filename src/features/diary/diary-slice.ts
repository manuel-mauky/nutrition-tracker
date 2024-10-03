import { DiaryEntry, IsoDateString, Id, FoodDiaryEntry, RecipeDiaryEntry } from "../types.ts"
import { StateCreator } from "zustand"
import { RootStore, RootStoreMutators } from "../store.ts"
import { nanoid } from "nanoid"
import { diaryEntries } from "../../test-data.ts"
import { DateTime } from "luxon"

type DiaryState = {
  diaryEntries: Record<IsoDateString, Array<DiaryEntry>>
}

const initialState: DiaryState = {
  diaryEntries: diaryEntries,
}

export type DiarySlice = DiaryState & {
  addDiaryEntry: (newEntry: Omit<FoodDiaryEntry, "id"> | Omit<RecipeDiaryEntry, "id">) => Id | undefined
  editDiaryEntry: (editedEntry: DiaryEntry) => void
  removeDiaryEntry: (entryOrId: DiaryEntry | Id) => void
}

export const createDiarySlice: StateCreator<RootStore, RootStoreMutators, [], DiarySlice> = (set) => ({
  ...initialState,
  addDiaryEntry: (newEntry) => {
    const id = nanoid()

    set((state) => {
      const day = DateTime.fromISO(newEntry.date).toISODate()

      if (!day) {
        console.warn("Cannot add diary entry. Date is not valid")
        return
      }

      const entriesOfDay = state.diaryEntries[day]

      if (!entriesOfDay) {
        state.diaryEntries[day] = []
      }

      const entry: DiaryEntry = {
        id,
        ...newEntry,
      }

      state.diaryEntries[day].push(entry)
    })

    return id
  },
  editDiaryEntry: (editedEntry) => {
    set((state) => {
      const day = DateTime.fromISO(editedEntry.date).toISODate()

      if (day && state.diaryEntries[day]) {
        state.diaryEntries[day] = state.diaryEntries[day].map((entry) =>
          entry.id === editedEntry.id ? editedEntry : entry,
        )
      }
    })
  },
  removeDiaryEntry: (entryOrId) => {
    set((state) => {
      const id = typeof entryOrId === "string" ? entryOrId : entryOrId.id

      let deleteDay: string | undefined

      Object.entries(state.diaryEntries).forEach(([day, entries]) => {
        const entry = entries.find((entry) => entry.id === id)

        if (entry) {
          const i = entries.indexOf(entry)

          delete entries[i]

          if (entries.length === 0) {
            deleteDay = day
          }
        }
      })

      if (deleteDay) {
        delete state.diaryEntries[deleteDay]
      }
    })
  },
})

export function selectDiaryEntryById(id: Id) {
  return function (state: RootStore): DiaryEntry | undefined {
    return Object.values(state.diaryEntries)
      .flatMap((list) => list)
      .find((entry) => entry.id === id)
  }
}
