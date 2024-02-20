export function objectValuesToControls(obj: Record<string, string>, control = 'select') {
  return {
    control,
    options: Object.keys(obj),
  }
}
