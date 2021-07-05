// You can run this example here or copy to your project (don't forget to change paths)
const path = require('path');
const fs = require('fs');
const generateSVG = require('../src');

const styles = require('./svgConfig.json');

// create output dir
const mainRoot = path.resolve(__dirname, './output');
if (!fs.existsSync(mainRoot)) fs.mkdirSync(mainRoot);

// set styles for txt elements
const SVGConfig = {
  phrase1: styles.gold,
  phrase2: styles.gold,
  message_bottom_v: styles.messageBottom,
  message_bottom_h: styles.messageBottom,
  message_top_v: styles.messageTop,
  message_top_h: styles.messageTop,
  levelNumbers: styles.level,
  goldNumbers: styles.gold,
};

// resolve paths
const fontsPath = path.resolve(__dirname, './fonts');
const localesPath = path.resolve(__dirname, './output/locales');
const dictionaryPath = path.resolve(__dirname, './dictionary');
const numbersPath = path.resolve(__dirname, './output/numbers');

const locales = ['en', 'ru'];
const localesOutput = { root: localesPath, subDirs: locales };
const exampleDictionary = {
  en: {
    phrase1: 'Hello there',
    phrase2: 'General Kenobi',
  },
  ru: {
    phrase1: 'Ну привет',
    phrase2: 'Генерал Кеноби',
  },
};

generateSVG(fontsPath, localesOutput, exampleDictionary, SVGConfig);

const localesDictionary = { root: dictionaryPath, subDirs: locales };
generateSVG(fontsPath, localesOutput, localesDictionary, SVGConfig);

const numbersOutput = { root: numbersPath, subDirs: ['levelNumbers', 'goldNumbers'] };
const numbers = new Array(10).fill(0).map((e, i) => `${i}`);
generateSVG(fontsPath, numbersOutput, numbers, SVGConfig);
