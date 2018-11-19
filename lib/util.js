const urlEscaper = url => url.toLowerCase().replace(/(^\w+:|^)\/\//, '').replace(/[^a-z0-9]/g, '_');
const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]));

module.exports = {
  urlEscaper,
  zip,
};
