const fs = require('fs');
const TextToSVG = require('text-to-svg');
const pathRounder = require('round-svg-path');
const pathParser = require('parse-svg-path');
const pathSerializer = require('serialize-svg-path');
const getSVG = require('./getSVG');
const object2tag = require('./object2tag');

const txt2svg = {
  styles: null,
  dictionary: {},
  locales: [],
  fontsPath: '',
  distPath: '',
  dictionaryPath: '',
  loadedFonts: {},
  options: {
    fontSize: 200,
    anchor: 'top center',
  },
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
    const styles = this.styles[element];
    const { font } = styles;
    const padding = styles.padding || 0;
    const phrase = this.dictionary[locale][element];
    const lines = phrase.split('\n');

    // generate sizes array
    const pathsWidths = [];
    const pathsHeights = [];
    lines.forEach((line) => {
      const { width, height } = this.loadedFonts[font].getMetrics(line, this.options);
      pathsHeights.push(Math.round(height));
      pathsWidths.push(Math.round(width));
    });

    // generate paths with translates
    const paths = [];
    const maxWidth = Math.max(...pathsWidths);
    lines.forEach((line, i) => {
      const outline = this.loadedFonts[font].getPath(line, this.options).slice(9, -3);
      const parsedPath = pathParser(outline);
      const translateX = maxWidth * 0.5;
      const translateY = pathsHeights.slice(0, i)
        .reduce((prev, curr) => prev + curr + padding, 0);
      const pathOptions = {
        transform: `translate(${translateX},${translateY})`,
        d: pathSerializer(pathRounder(parsedPath, 0)),
      };
      const path = object2tag('path', pathOptions, false);
      paths.push(path);
    });

    // styling path with styles from json and get svg string
    const svgString = getSVG(paths.reduce((prev, curr) => prev + curr, ''), {
      ...styles,
      width: maxWidth,
      height: pathsHeights.reduce((prev, curr, index) => prev + curr + (index !== 0 && padding), 0),
    });

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
