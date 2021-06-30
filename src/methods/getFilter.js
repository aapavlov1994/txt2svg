const convertObject2Tag = require('./object2tag');

module.exports = function getFilter(object) {
  if (object) {
    const filterObject = { id: 'filter' };
    let filters = '';
    Object.keys(object).forEach((key) => {
      if (key === 'shadows') { // need for few "feDropShadow" tags
        Object.keys(object[key]).forEach((shadow) => {
          filters += convertObject2Tag('feDropShadow', object[key][shadow], false);
        });
      } else if (key === 'HTML_INSERTION') filters += object[key];
      else filters += convertObject2Tag(key, object[key]);
    });
    return convertObject2Tag('filter', filterObject, filters);
  }
  return '';
};
