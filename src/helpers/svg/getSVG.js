const getDefs = require('./getDefs');
const getStyle = require('./getStyle');
const convertObject2Tag = require('./object2tag');
const getSVGParams = require('./getSVGParams');
/**
 * Function for creating SVG string using passed config
 * @param svgConfig
 * @param svgConfig.font { String } - font name
 * @param svgConfig.styles { Object } - SVG Styles described in Object
 * @param svgConfig.lineSpacing { Number } [lineSpacing = 0]
 * @param svgConfig.height { Number } [height = 500] SVG height
 * @param svgConfig.width { Number } [width] SVG width
 * @param svgConfig.paddingX { Number } [paddingX = 0] will be added to SVG width
 * @param svgConfig.paddingY { Number } [paddingY = 0] will be added to SVG height
 * @param svgConfig.alignX { String } [alignX = 'center']
 * @param svgConfig.alignY { String } [alignY = 'top']
 *
 * @param phrase { String }
 *
 * @param TextToSVG { Object }
 *
 * @returns { String } - svg in string format
 */
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
