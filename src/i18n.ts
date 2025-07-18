import i18n, { CustomTypeOptions } from "i18next"
import { initReactI18next } from "react-i18next"

import deApp from "./locales/de/app.json"
import enApp from "./locales/en/app.json"

export const defaultNS = "app"
export const resources = {
  de: {
    app: deApp,
  },
  en: {
    app: enApp,
  },
} as const

export type Language = keyof typeof resources

export const availableLanguages: Record<Language, string> = {
  de: "Deutsch",
  en: "English",
}

export const defaultLanguage: Language = "en"

i18n.use(initReactI18next).init({
  resources,
  debug: true,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  ns: ["app"],
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecursiveKeyOf<TObj extends Record<string, any>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends Record<string, any>
    ? `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`
}[keyof TObj & (string | number)]

export type TranslationKey = RecursiveKeyOf<CustomTypeOptions["resources"]["app"]>
