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
 * @param isOneStyleForSubDir { Boolean } [isOneStyleForSubDir = false] - if you want apply
 * style to whole output.subDir - use this option (need for numbers or symbols first of all)
 *
 * @return { void }
 */
function generateSVG(fontsRoot, output, dictionary, svgParams, isOneStyleForSubDir = false) {
  const fontsConverters = getFontsConverters(fontsRoot, svgParams);
  const dictionaryCollection = getDictionaryCollection(dictionary, output);

  output.subDirs.forEach((subDir) => {
    Object.keys(dictionaryCollection[subDir]).forEach((SVGName) => {
      const SVGConfig = svgParams[isOneStyleForSubDir ? subDir : SVGName];
      const text = dictionaryCollection[subDir][SVGName];
      const font = fontsConverters.get(SVGConfig.font);
      const SVGString = getSVG(SVGConfig, text, font);
      writeSVG(output.root, subDir, SVGName, SVGString);
    });
    logMessage(` All SVG for "${subDir}" output subDir generated.`);
  });
}

module.exports = generateSVG;
