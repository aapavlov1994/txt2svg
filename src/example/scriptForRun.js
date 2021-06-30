// You can run this example here or copy to your project (don't forget to change paths)
const path = require('path');
const txt2svg = require('../index.js');

const styles = require('./svgConfig.json');
const dict = require('./dictionary/en.json'); // needs to generate style object on fly

const txt2svgStyles = {}; // object for elements (future svg) with their styles
/*
if you do not want to duplicate styles for different elements with same styles in config.json
u can do this here on fly
*/
Object.keys(dict).forEach((key) => {
  if (key.startsWith('message_top')) txt2svgStyles[key] = styles.messageTop;
  else if (key.startsWith('message_bottom')) txt2svgStyles[key] = styles.messageBottom;
  // if dictionary element has styles specially for him - use it
  else if (styles[key]) txt2svgStyles[key] = styles[key];
  // use number style for all others elements (digits)
  else txt2svgStyles[key] = styles.number;
});

const fontsPath = path.resolve(__dirname, './fonts');
const distPath = path.resolve(__dirname, './output');
const dictionaryPath = path.resolve(__dirname, './dictionary');
const locales = process.argv.slice(2);

txt2svg.setLocales(locales);
// if your dictionary elements are identical to styles elements past style object bellow
txt2svg.setStyles(txt2svgStyles);
txt2svg.setFontsPath(fontsPath);
txt2svg.setDistPath(distPath);
txt2svg.setDictionaryPath(dictionaryPath);
txt2svg.run();
