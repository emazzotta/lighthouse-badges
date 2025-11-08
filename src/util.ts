export const urlEscaper = (url: string): string => {
  return url.toLowerCase()
    .replace(/(^\w+:|^)\/\//, '')
    .replace(/[^a-z0-9]/g, '_');
};

export const zip = <T>(rows: T[][]): T[][] => {
  return rows[0].map((_, c) => rows.map((row) => row[c]));
};

export const statusMessage = (successMessage: string, errorMessage: string, error: Error | null | undefined): void => {
  if (error) {
    throw new Error(errorMessage);
  }
  process.stdout.write(successMessage);
};

