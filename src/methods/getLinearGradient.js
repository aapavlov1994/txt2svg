const convertObject2Tag = require('./object2tag');

module.exports = function getLinearGradient(object) {
  if (object && object.offsets) {
    let stops = '';
    Object.keys(object.offsets).forEach((stopKey) => {
      const stopObject = {
        ...object.offsets[stopKey],
        offset: stopKey,
      };
      stops += convertObject2Tag('stop', stopObject, false);
    });
    const gradientObject = { ...object, id: 'gradient' };
    delete gradientObject.offsets;
    return convertObject2Tag('linearGradient', gradientObject, stops);
  }
  return '';
};
