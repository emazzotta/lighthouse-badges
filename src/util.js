export const urlEscaper = (url) => url.toLowerCase().replace(/(^\w+:|^)\/\//, '').replace(/[^a-z0-9]/g, '_');

export const zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));

export const statusMessage = (successMessage, errorMessage, error) => {
  if (error) {
    throw new Error(errorMessage);
  }
  process.stdout.write(successMessage);
};

