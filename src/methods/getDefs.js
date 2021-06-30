const convertObject2Tag = require('./object2tag');
const getFilter = require('./getFilter');
const getLinearGradient = require('./getLinearGradient');

module.exports = function getDefs(object) {
  const insertions = getFilter(object.filter) + getLinearGradient(object.linearGradient);
  return insertions && convertObject2Tag('defs', {}, insertions);
};
