const path = require('path');
const TextToSVG = require('text-to-svg');
const { validateProps, throwError } = require('./tools');

const getFontsConverters = (fontsRoot, svgParams) => {
  const fontsNames = new Set();
  const fontConverters = new Map();
  Object.keys(svgParams).forEach((key) => { fontsNames.add(svgParams[key].font); });
  fontsNames.forEach((fontName) => {
    try {
      fontConverters.set(fontName, TextToSVG.loadSync(`${fontsRoot}/${fontName}`));
    } catch (e) {
      throwError(`Can't find "${fontName}" in "${fontsRoot}".`);
    }
  });

  return fontConverters;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const getDictionaryCollection = (dictionary, output) => {
  if (typeof dictionary === 'object') {
    if (Array.isArray(dictionary) && dictionary.every((el) => typeof el === 'string')) {
      const dictionaryCollection = {};
      const dict = {};
      dictionary.forEach((el) => {
        dict[el] = el;
      });
      output.subDirs.forEach((subDir) => {
        dictionaryCollection[subDir] = dict;
      });

      return { dictionaryCollection, isOneStyleForSubDir: true };
    }

    if (validateProps(dictionary, 'root', 'subDirs')
      && Array.isArray(dictionary.subDirs) && dictionary.subDirs.length
      && Object.keys(dictionary).length === 2
    ) {
      const dictionaryCollection = {};
      const { root, subDirs } = dictionary;
      subDirs.forEach((subDir) => {
        const dictPath = path.resolve(root, subDir);
        try {
          dictionaryCollection[subDir] = require(dictPath);
        } catch (e) {
          throwError(`There is no dictionary "${subDir}" in ${path.resolve(root)}`);
        }
      });

      return { dictionaryCollection, isOneStyleForSubDir: false };
    }

    if (Object.keys(dictionary).length && Object.keys(dictionary).every((locale) => (
      typeof dictionary[locale] === 'object'
      && Object.keys(dictionary).length && Object.keys(dictionary[locale]).every((name) => (
        typeof dictionary[locale][name] === 'string'
      ))
    ))) {
      return { dictionaryCollection: dictionary, isOneStyleForSubDir: false };
    }

    if (Object.keys(dictionary).length
      && Object.keys(dictionary).every((key) => typeof dictionary[key] === 'string')) {
      const dictionaryCollection = {};
      output.subDirs.forEach((subDir) => { dictionaryCollection[subDir] = dictionary; });

      return { dictionaryCollection, isOneStyleForSubDir: true };
    }

    return throwError(`Wrong dictionary argument structure: ${JSON.stringify(dictionary)}.`);
  }
  return throwError('Dictionary argument should be an object.');
};

module.exports = { getDictionaryCollection, getFontsConverters };
