module.exports = function getStyle(object) {
  if (object) {
    const styleObject = { ...object };

    if (styleObject.linearGradient) {
      delete styleObject.linearGradient;
      styleObject.fill = 'url(#gradient)';
    }
    if (styleObject.filter) styleObject.filter = 'url(#filter)';
    const stringStyle = Object.keys(styleObject)
      .reduce((acc, key) => `${acc}\n${key}: ${styleObject[key]};`, '');

    return `<style>path {${stringStyle}}</style>`;
  }
  return '';
};
