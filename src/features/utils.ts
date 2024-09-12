export function validateName(value: string, entity: Array<{ name: string }>): string | undefined {
  const duplicate = entity.some((entity) => entity.name.trim() === value.trim())

  if (duplicate) {
    return "Name existiert bereits"
  } else {
    return undefined
  }
}
