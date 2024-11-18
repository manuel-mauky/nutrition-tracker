import { Dropdown, IconButton, Stack } from "rsuite"
import { useStore } from "../features/store.ts"
import { PiSunFill, PiMoonStarsFill, PiTranslate } from "react-icons/pi"
import { availableLanguages, Language } from "../i18n.ts"

export function GlobalQuickSettings() {
  const { theme, changeTheme, language, changeLanguage } = useStore()

  function onChangeTheme() {
    changeTheme(theme === "light" ? "dark" : "light")
  }

  function onChangeLanguage(key: string) {
    if (Object.keys(availableLanguages).includes(key)) {
      changeLanguage(key as Language)
    }
  }

  return (
    <Stack id="global-quick-settings">
      <IconButton onClick={onChangeTheme} icon={theme === "light" ? <PiMoonStarsFill /> : <PiSunFill />} />

      <Dropdown
        activeKey={language}
        onSelect={onChangeLanguage}
        title={availableLanguages[language]}
        icon={<PiTranslate />}
      >
        {Object.entries(availableLanguages).map(([key, label]) => (
          <Dropdown.Item key={key} eventKey={key}>
            {label}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </Stack>
  )
}
