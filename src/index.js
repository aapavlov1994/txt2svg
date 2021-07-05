const path = require('path');
const getSVG = require('./helpers/svg/getSVG');
const { getFontsConverters, getDictionaryCollection } = require('./helpers/handlers');
const { writeSVG, logMessage } = require('./helpers/tools');

/**
 * Function for creating svg from text with chosen fonts and svg-styles
 *
 * @param fontsRoot { String } - path to fonts directory
 *
 * @param output { Object } - config for output
 * @param output.root { String } - path to root output directory
 * @param output.subDirs { Array } - list of subDirs (["en", "ru"])
 *
 * @param dictionary { Object | String[] | Object<string, string> } - config OR list
 * of converting phrases
 * @param dictionary.root { String } - path to root output directory
 * @param dictionary.subDirs { String } - list of subDirs (["en", "numbers", "symbols"])
 *
 * @param svgParams { Object<string, Object>}
 *
 * @return { void }
 */
function generateSVG(fontsRoot, output, dictionary, svgParams) {
  const fontsConverters = getFontsConverters(fontsRoot, svgParams);
  const { dictionaryCollection, isOneStyleForSubDir } = getDictionaryCollection(dictionary, output);

  output.subDirs.forEach((subDir) => {
    Object.keys(dictionaryCollection[subDir]).forEach((SVGName) => {
      const SVGConfig = svgParams[isOneStyleForSubDir ? subDir : SVGName];
      const text = dictionaryCollection[subDir][SVGName];
      const font = fontsConverters.get(SVGConfig.font);
      const SVGString = getSVG(SVGConfig, text, font);
      writeSVG(output.root, subDir, SVGName, SVGString);
    });
    logMessage(`SVG: ${JSON.stringify(Object.keys(dictionaryCollection[subDir]))}\n for "${subDir}" in "${path.resolve(output.root)}" generated.\n`);
  });
}

module.exports = generateSVG;
