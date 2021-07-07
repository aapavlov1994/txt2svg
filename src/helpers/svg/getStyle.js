const getStyleFromObject = (object) => (
  Object.keys(object)
    .reduce((acc, key) => `${acc}${key}: ${object[key]};\n`, '\n'));

module.exports = function getStyle(object) {
  if (object) {
    const mainObject = { ...object };
    const borderObject = { stroke: object.stroke, 'stroke-width': object['stroke-width'] };

    delete mainObject.stroke;
    delete mainObject['stroke-width'];

    if (mainObject.linearGradient) {
      delete mainObject.linearGradient;
      mainObject.fill = 'url(#gradient)';
    }
    if (mainObject.filter) mainObject.filter = 'url(#filter)';
    const mainStyle = getStyleFromObject(mainObject);
    const borderStyle = getStyleFromObject(borderObject);

    return `
    <style>
      #main {${mainStyle}}
      #border {${borderStyle}}
    </style>
    `;
  }
  return '';
};
