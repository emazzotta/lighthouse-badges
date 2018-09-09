const urlEscaper = url => url.toLowerCase().replace(/(^\w+:|^)\/\//, '').replace(/[^a-z0-9]/g, '_');
const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]));

const objectAttributesToObject = objectAttributes => Object.assign({},
  ...zip([Object.keys(objectAttributes), Object.values(objectAttributes)]).map((x) => {
    const [key, value] = x;
    return { [key]: value };
  }));


module.exports = {
  urlEscaper,
  zip,
  objectAttributesToObject,
};
