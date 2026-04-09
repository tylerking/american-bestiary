export function nameToImagePath(name: string): string {
  return '/images/' + name.toLowerCase().replaceAll(' ', '-') + '.png'
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}