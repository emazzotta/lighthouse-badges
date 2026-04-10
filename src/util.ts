export const urlEscaper = (url: string): string =>
  url
    .toLowerCase()
    .replace(/(^\w+:|^)\/\//, '')
    .replace(/[^a-z0-9]/g, '_');
