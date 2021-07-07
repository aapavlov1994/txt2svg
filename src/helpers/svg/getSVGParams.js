const pathParser = require('parse-svg-path');
const pathSerializer = require('serialize-svg-path');
const pathRounder = require('round-svg-path');
const object2tag = require('./object2tag');

const defaultOptions = {
  lineSpacing: 0,
  height: 500,
  paddingX: 0,
  paddingY: 0,
  alignX: 'center',
  alignY: 'top',
};

const getProperty = (property, passedOptions) => (
  Object.prototype.hasOwnProperty.call(passedOptions, property)
    ? passedOptions[property]
    : defaultOptions[property]
);

const getMaxWidth = (svgConverter, lines, svgOptions) => (
  lines.reduce((result, line) => {
    const width = Math.round(svgConverter.getWidth(line, svgOptions));
    return width > result ? width : result;
  }, 0)
);

module.exports = function getSVGParams(styles, phrase, svgConverter) {
  const lines = phrase.split('\n');

  const lineSpacing = getProperty('lineSpacing', styles);
  const alignX = getProperty('alignX', styles);
  const alignY = getProperty('alignY', styles);
  const paddingX = getProperty('paddingX', styles);
  const paddingY = getProperty('paddingY', styles);

  const isSVGWidthPassed = typeof getProperty('width', styles) !== 'undefined';
  const isSVGHeightPassed = typeof getProperty('height', styles) !== 'undefined';

  let svgWidth = getProperty('width', styles);
  let svgHeight = isSVGWidthPassed && !isSVGHeightPassed
    ? svgWidth
    : getProperty('height', styles);

  // calc font size
  const { unitsPerEm, ascender, descender } = svgConverter.font;
  const lineHeight = ((svgHeight + lineSpacing) / lines.length) - lineSpacing;
  let fontSize = Math.trunc((unitsPerEm * lineHeight) / (ascender - descender));
  const svgOptions = { fontSize, anchor: `${alignY} ${alignX}` };

  // calc max width
  let maxWidth = getMaxWidth(svgConverter, lines, svgOptions);
  if (isSVGWidthPassed && maxWidth >= svgWidth) {
    const scale = svgWidth / maxWidth;
    fontSize = Math.trunc((scale * unitsPerEm * lineHeight) / (ascender - descender));
    svgOptions.fontSize = fontSize;
    maxWidth = getMaxWidth(svgConverter, lines, svgOptions);
  }

  // generate paths with translates
  const roundedLineHeight = Math.round(svgConverter.getHeight(fontSize));
  const svgRealHeight = roundedLineHeight * lines.length + lineSpacing * (lines.length - 1);
  if (!isSVGHeightPassed || (svgRealHeight > svgHeight)) svgHeight = svgRealHeight;
  if (!isSVGWidthPassed) svgWidth = maxWidth;

  const diffTop = (svgHeight - svgRealHeight) / 2;
  const translateX = svgWidth * 0.5 + paddingX;
  const paths = lines.map((line, i) => {
    const outline = svgConverter.getPath(line, svgOptions).slice(9, -3);
    const parsedPath = pathParser(outline);
    const translateY = diffTop + paddingY + (roundedLineHeight + lineSpacing) * i;
    const pathOptions = {
      transform: `translate(${translateX},${translateY})`,
      id: `path${i}`,
      d: pathSerializer(pathRounder(parsedPath, 0)),
    };
    return object2tag('path', pathOptions, false);
  });

  const mainPaths = object2tag('g', { id: 'main' }, paths.join(''));
  const usedTags = paths.map((e, i) => (
    object2tag('use', { href: `#path${i}`, fill: 'none' }, false)));
  const borderPaths = object2tag('g', { id: 'border' }, usedTags.join(''));

  return {
    paths: mainPaths + borderPaths,
    width: svgWidth + paddingX * 2,
    height: svgHeight + paddingY * 2,
  };
};
