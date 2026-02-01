export function sanitizeFilename(filename: string) {
  return filename
    .replace(/[^a-zA-Z0-9-_.]/g, '-') //jack-12Abgpa.png -> jack.png
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}