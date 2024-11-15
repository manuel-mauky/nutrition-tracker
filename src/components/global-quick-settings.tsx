import { IconButton, Stack } from "rsuite"
import { useStore } from "../features/store.ts"
import { PiSunFill, PiMoonStarsFill } from "react-icons/pi"

export function GlobalQuickSettings() {
  const { theme, changeTheme } = useStore()

  function onClick() {
    changeTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Stack id="global-quick-settings">
      <IconButton onClick={onClick} icon={theme === "light" ? <PiMoonStarsFill /> : <PiSunFill />} />
    </Stack>
  )
}
