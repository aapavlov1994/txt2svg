const path = require('path');
const TextToSVG = require('text-to-svg');
const { logMessage, validateProps, throwError } = require('./tools');

const getFontsConverters = (fontsRoot, svgParams) => {
  const fontsNames = new Set();
  const fontConverters = new Map();
  Object.keys(svgParams).forEach((key) => { fontsNames.add(svgParams[key].font); });
  fontsNames.forEach((fontName) => {
    try {
      fontConverters.set(fontName, TextToSVG.loadSync(`${fontsRoot}/${fontName}`));
    } catch (e) {
      logMessage(`Can't find "${fontName}" in "${fontsRoot}".`, true);
    }
  });

  return fontConverters;
};

const getDictionaryCollection = (dictionary, output) => {
  const dictionaryCollection = {};
  if (typeof dictionary === 'object') {
    if (Array.isArray(dictionary)) {
      const dict = {};
      dictionary.forEach((el) => { dict[el] = el; });
      output.subDirs.forEach((subDir) => { dictionaryCollection[subDir] = dict; });
    } else if (validateProps(dictionary, 'root', 'subDirs')) {
      const { root, subDirs } = dictionary;
      subDirs.forEach((subDir) => {
        const dictPath = path.resolve(root, subDir);
        dictionaryCollection[subDir] = require(dictPath);
      });
    } else output.subDirs.forEach((subDir) => { dictionaryCollection[subDir] = dictionary; });

    return dictionaryCollection;
  }
  return throwError('Wrong dictionary attribute structure.');
};

module.exports = { getDictionaryCollection, getFontsConverters };
