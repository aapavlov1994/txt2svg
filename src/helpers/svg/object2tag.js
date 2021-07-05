module.exports = function object2tag(tagName, tagObject, insertions = '') {
  let output = `<${tagName}`;
  Object.keys(tagObject).forEach((key) => {
    output += ` ${key}="${tagObject[key]}"`;
  });
  if (insertions === false) output += '/>';
  else output += `>${insertions}</${tagName}>`;
  return output;
};
