const convertObject2Tag = require('./object2tag');

const getInnerShadow = (dx = 1, dy = 1, stdDeviation = 1, color = 'black', opacity = 0.5) => (`
  <feOffset dx="${dx}" dy="${dy}"/>
  <feGaussianBlur stdDeviation="${stdDeviation}" result="offset-blur"/>
  <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
  <feFlood flood-color="${color}" flood-opacity="${opacity}" result="color"/>
  <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
  <feComposite operator="over" in="shadow" in2="SourceGraphic"/>`
);

module.exports = function getFilter(object) {
  if (object) {
    const filterObject = { id: 'filter' };
    let filters = '';
    Object.keys(object).forEach((key) => {
      if (key === 'outerShadows') { // need for few "feDropShadow" tags
        object[key].forEach((shadow) => {
          filters += convertObject2Tag('feDropShadow', shadow, false);
        });
      } else if (key === 'insertedFilterTags') filters += object[key];
      else if (key === 'innerShadow') {
        const {
          dx, dy, stdDeviation, color, opacity,
        } = object[key];
        filters += getInnerShadow(dx, dy, stdDeviation, color, opacity);
      } else filters += convertObject2Tag(key, object[key]);
    });
    return convertObject2Tag('filter', filterObject, filters);
  }
  return '';
};
