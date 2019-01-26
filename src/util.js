const urlEscaper = url => url.toLowerCase().replace(/(^\w+:|^)\/\//, '').replace(/[^a-z0-9]/g, '_');

const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]));

const statusMessage = (successMessage, errorMessage, error) => {
  if (error) {
    throw new Error(errorMessage);
  }
  process.stdout.write(successMessage);
};

module.exports = {
  urlEscaper,
  zip,
  statusMessage,
};
