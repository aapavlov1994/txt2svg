// You can run this example here or copy to your project (don't forget to change paths)
const path = require('path');
const fs = require('fs');
const generateSVG = require('../src');

const styles = require('./svgConfig.json');
const dict = require('./dictionary/en.json'); // needs to generate style object on fly

// create output dir
const mainRoot = path.resolve(__dirname, './output');
if (!fs.existsSync(mainRoot)) fs.mkdirSync(mainRoot);

const SVGConfig = {}; // object for elements (future svg) with their styles
/*
if you do not want to duplicate styles for different elements with same styles in config.json
u can do this here on fly
*/
Object.keys(dict).forEach((key) => {
  if (key.startsWith('message_top')) SVGConfig[key] = styles.messageTop;
  else if (key.startsWith('message_bottom')) SVGConfig[key] = styles.messageBottom;
  // if dictionary element has styles specially for him - use it
  else if (styles[key]) SVGConfig[key] = styles[key];
});
Object.assign(SVGConfig, styles);

const fontsPath = path.resolve(__dirname, './fonts');
const localesPath = path.resolve(__dirname, './output/locales');
const dictionaryPath = path.resolve(__dirname, './dictionary');
const locales = ['en', 'ru'];

const localesOutput = { root: localesPath, subDirs: locales };
const localesDictionary = { root: dictionaryPath, subDirs: locales };

generateSVG(fontsPath, localesOutput, localesDictionary, SVGConfig);

const numbersPath = path.resolve(__dirname, './output/numbers');
const numbersOutput = { root: numbersPath, subDirs: ['level', 'gold'] };
const numbers = new Array(10).fill(0).map((e, i) => `${i}`);
generateSVG(fontsPath, numbersOutput, numbers, SVGConfig);
