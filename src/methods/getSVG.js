const getDefs = require('./getDefs');
const getStyle = require('./getStyle');
const convertObject2Tag = require('./object2tag');
const getSVGParams = require('./getSVGParams');

module.exports = function getSVG(svgConfig, phrase, TextToSVG) {
  const { paths, width, height } = getSVGParams(svgConfig, phrase, TextToSVG);
  const style = getStyle(svgConfig.styles);
  const defs = getDefs(svgConfig.styles);
  const viewBox = `0 0 ${width} ${height}`;
  const svgOptions = {
    xmlns: 'http://www.w3.org/2000/svg',
    width,
    height,
    viewBox,
  };
  return convertObject2Tag('svg', svgOptions, defs + style + paths);
};
