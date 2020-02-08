export const sluggify = (str: string) => {
  return str
    .toLocaleLowerCase()
    .trim()
    .replace(' ', '-')
}
