const fs = require('fs');
const path = require('path');
const cssToObject = require('css-to-object');

const filepath = path.join(__dirname, 'node_modules/tachyons/css/tachyons.css');

const css = fs.readFileSync(filepath, 'utf8');

const obj = cssToObject(css);

const cache = new Map();

const hyph = s => s.replace(/[A-Z]|^ms/g, '-$&').toLowerCase();

const createDeclarations = obj =>
  Object.keys(obj)
    .map(prop => {
      return hyph(prop) + ':' + obj[prop];
    })
    .join(';');

const createKeyValueObj = (key, value) => {
  let pseudoClass;
  const convert = (str, p1, p2) => {
    pseudoClass = p2;
    return p1;
  };
  if (/(\w+):/.test(key)) {
    return {
      k: key
        .replace(/^\./, '')
        .replace(/\-/g, '_')
        .replace(/(\w+):+(\w+)/, convert),
      v: '&:' + pseudoClass + '{' + createDeclarations(value) + '}'
    };
  }
  return {
    k: key.replace(/^\./, '').replace(/\-/g, '_'),
    v: createDeclarations(value)
  };
};

const parsed = Object.keys(obj)
  .filter(key => /^[@.]/.test(key))
  .map(key => ({
    key,
    value: obj[key]
  }))
  .map(({ key, value }) => {
    if (/^@/.test(key)) {
      return Object.keys(value).map(k => {
        return {
          key: k.replace(/^\./, '').replace(/\-/g, '_'),
          value: key + createDeclarations(value[k])
        };
      });
    }

    const { k, v } = createKeyValueObj(key, value);

    if (cache.has(k)) {
      const newValue = cache.get(k) + v;
      cache.set(k, newValue);
      return {
        key: k,
        value: newValue
      };
    }

    cache.set(k, v);
    return {
      key: k,
      value: v
    };
  })
  // flatten
  .reduce((a, b) => [...a, ...(Array.isArray(b) ? b : [b])], [])
  .reduce((a, b) => Object.assign(a, { [b.key]: b.value }), {});

const json = JSON.stringify(parsed, null, 2);

fs.writeFileSync(path.join(__dirname, 'dist', 'tachyons.json'), json);

console.log('parsed CSS to JSON');
