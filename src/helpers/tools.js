const fs = require('fs');
const path = require('path');

const logMessage = (message, isError = false) => {
  // eslint-disable-next-line no-console
  console.log(`\x1b[3${isError ? 1 : 4}m`, message, '\x1b[0m');
};
const throwError = (message) => { throw new Error(message); };
const validateProps = (object, ...props) => (
  props.every((property) => Object.prototype.hasOwnProperty.call(object, property))
);

const writeSVG = (root, subDir, SVGName, SVGString) => {
  const dist = path.resolve(root, subDir);
  if (!fs.existsSync(root)) fs.mkdirSync(root);
  if (!fs.existsSync(dist)) fs.mkdirSync(dist);
  fs.writeFileSync(`${dist}/${SVGName}.svg`, SVGString);
};

module.exports = {
  logMessage,
  throwError,
  validateProps,
  writeSVG,
};
