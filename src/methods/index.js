const fs = require('fs');
const TextToSVG = require('text-to-svg');
const getSVG = require('./getSVG');

const txt2svg = {
  styles: null,
  dictionary: {},
  locales: [],
  fontsPath: '',
  distPath: '',
  dictionaryPath: '',
  loadedFonts: {},
  setStyles(object) { this.styles = object; },
  setDictionaryPath(path) { this.dictionaryPath = path; },
  setFontsPath(path) { this.fontsPath = path; },
  setDistPath(path) { this.distPath = path; },
  setLocales(localesArr = ['en']) { this.locales = localesArr; },

  getLocalesFromDictionaryPath() {
    this.locales = fs
      .readdirSync(this.dictionaryPath)
      .filter((file) => file !== 'styles.json')
      .map((item) => item.replace(/\.json$/, ''));
  },
  loadFonts() {
    const fontsNames = new Set();
    Object.keys(this.styles).forEach((key) => { fontsNames.add(this.styles[key].font); });
    fontsNames.forEach((fontName) => {
      try {
        this.loadedFonts[fontName] = TextToSVG.loadSync(`${this.fontsPath}/${fontName}`);
      } catch (e) {
        console.log('\x1b[31m', `Can't find "${fontName}".`, '\x1b[0m');
      }
    });
  },
  getSvgFor(element, locale) {
    const svgConfig = this.styles[element];
    const { font } = svgConfig;
    const phrase = this.dictionary[locale][element];

    // styling path with styles from json and get svg string
    const svgString = getSVG(svgConfig, phrase, this.loadedFonts[font]);

    // write svg
    const dist = `${this.distPath}/${locale}`;
    if (!fs.existsSync(dist)) fs.mkdirSync(dist);
    fs.writeFileSync(`${dist}/${element}.svg`, svgString);
  },
  run() {
    this.loadFonts();
    if (this.locales.length === 0) this.getLocalesFromDictionaryPath();
    this.locales.forEach((locale) => {
      // developer can set dictionary without json file
      try {
        this.dictionary[locale] = require(`${this.dictionaryPath}/${locale}.json`); // eslint-disable-line
        // generate svg for each element and locale
        Object.keys(this.dictionary[locale]).forEach((element) => {
          this.getSvgFor(element, locale);
        });
        console.log('\x1b[34m', `SVG for "${locale}" locale generated.`, '\x1b[0m');
      } catch (e) {
        console.log('\x1b[31m', `No "${locale}.json" for SVG generation.`, '\x1b[0m');
      }
    });
  },
};

module.exports = txt2svg;
