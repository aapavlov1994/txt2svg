const pathParser = require('parse-svg-path');
const pathSerializer = require('serialize-svg-path');
const pathRounder = require('round-svg-path');
const object2tag = require('./object2tag');

const defaultOptions = {
  anchor: 'top center',
  lineSpacing: -20,
  paddingX: 0,
  paddingY: 0,
  height: 500,
};

module.exports = function getSVGParams(styles, phrase, TextToSVG) {
  const lineSpacing = styles.lineSpacing || defaultOptions.lineSpacing;
  const svgHeight = styles.height || defaultOptions.height;
  const paddingX = styles.paddingX || defaultOptions.paddingX;
  const paddingY = styles.paddingY || defaultOptions.paddingY;
  const lines = phrase.split('\n');

  // calc font size
  const { unitsPerEm, ascender, descender } = TextToSVG.font;
  const lineHeight = ((svgHeight + lineSpacing) / lines.length) - lineSpacing;
  const fontSize = Math.trunc((unitsPerEm * lineHeight) / (ascender - descender));
  const svgOptions = { fontSize, anchor: defaultOptions.anchor };

  // calc max width
  const pathsWidths = [];
  lines.forEach((line) => {
    const width = TextToSVG.getWidth(line, svgOptions);
    pathsWidths.push(Math.round(width));
  });
  const maxWidth = Math.max(...pathsWidths);

  // generate paths with translates
  const roundedLineHeight = Math.round(TextToSVG.getHeight(fontSize));
  const svgRealHeight = roundedLineHeight * lines.length + lineSpacing * (lines.length - 1);
  const diffTop = Math.round((svgHeight - svgRealHeight) / 2);
  const paths = [];
  const translateX = maxWidth * 0.5 + paddingX;
  lines.forEach((line, i) => {
    const outline = TextToSVG.getPath(line, svgOptions).slice(9, -3);
    const parsedPath = pathParser(outline);
    const translateY = diffTop + paddingY + (roundedLineHeight + lineSpacing) * i;
    const pathOptions = {
      transform: `translate(${translateX},${translateY})`,
      d: pathSerializer(pathRounder(parsedPath, 0)),
    };
    const path = object2tag('path', pathOptions, false);
    paths.push(path);
  });

  return {
    paths: paths.join(''),
    width: maxWidth + paddingX * 2,
    height: svgHeight + paddingY * 2,
  };
};
