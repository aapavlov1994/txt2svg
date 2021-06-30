const getDefs = require('./getDefs');
const getStyle = require('./getStyle');
const convertObject2Tag = require('./object2tag');

module.exports = function getSVG(path, config) {
  const {
    styles,
    width,
    height,
  } = config;
  const style = getStyle(styles);
  const defs = getDefs(styles);
  const viewBox = `0 0 ${width} ${height}`;
  const svgOptions = {
    xmlns: 'http://www.w3.org/2000/svg',
    width,
    height,
    viewBox,
  };
  return convertObject2Tag('svg', svgOptions, defs + style + path);
};
