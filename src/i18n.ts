import i18n from "i18next"
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
