const convertObject2Tag = require('./object2tag');
const getFilter = require('./getFilter');
const getLinearGradient = require('./getLinearGradient');

module.exports = function getDefs(object) {
  const insetrions = getFilter(object.filter) + getLinearGradient(object.linearGradient);
  return convertObject2Tag('defs', {}, insetrions);
};
