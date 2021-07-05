# txt2svg
Tool for creating svg from text with chosen fonts and svg-styles.

****

### Usage

`npm i --save-dev txt2svg`

### Guide

```javascript
const generateSVG = require('txt2svg');
/*
...some code
*/
generateSVG(fontsRoot, output, dictionary, svgParams, isOneStyleForSubDir);
```

_generateSVG_ function has 4 necessary arguments and 1 unnecessary:

* **fontsRoot** - is path to directory with fonts. Fonts should be placed 
  in this directory.
    ```javascript
    const fontsPath = path.resolve(__dirname, './fonts');
    ```

* **output** - is config of your output.

    ```javascript
    const localesOutput = {
      root: path.resolve(__dirname, './output/locales'),
      subDirs: ['en', 'ru', 'ge', 'fr', 'it']
    };
    ```

  * **output.root** - is root path to your output directory (may not exist).
    
  * **output.subDirs** - is array of sub-directories in the root directory
    (may not exist). Need for cycling by locales or by styles-type.


* **dictionary** - is config for your dictionary.
You can configure dictionary like **output** passing root and subDirs arguments -
  in this case phrase collections (jsons) should exist in the root dictionary with
  subDirs naming (useful for creating txt-svg for different locales).

    ```javascript
    const dictionary = {
    root: path.resolve(__dirname, './dictionary'),
    subDirs: ['en', 'ru', 'ge', 'fr', 'it']
    };
    ```

  Also, you can pass here an collection of dictionaries with string-subDirs keys:

    ```javascript
    const dictionary = {
        en: {
          phrase1: 'Hello there',
          phrase2: 'General Kenobi',    
        },
        ru: {
          phrase1: 'Ну привет',
          phrase2: 'Генерал Кеноби',    
        },
    };
    ```

  Or you can pass one dictionary (there is no cycle by locales in this case):

    ```javascript
    const dictionary = {
      phrase1: 'Hello there',
      phrase2: 'General Kenobi',
    };
    // also possible (in this case value === name of future svg)
    const dictionary1 = ['Hello there', 'General Kenobi'];
    const dictionary2 = [1, 2, 3];
    ```
* **svgParams** - this is config for your svg
    ```javascript
    const svgParams = {
      phrase1: {
        font: "riffic-bold.ttf",
        width : 590, // unnecessary param
        height : 590, // unnecessary param
        lineSpacing: 10, // unnecessary param
        paddingX: 5, // unnecessary param
        paddingY: 5, // unnecessary param
        alignX: 'center', // unnecessary param
        alignY: 'top', // unnecessary param
        styles: {
          "stroke-width": "4px",
          "stroke": "#321a1e",
          "filter": {
            "feDropShadow": {
              "dx": "0",
              "dy": "7",
              "stdDeviation": "0",
              "flood-color": "black",
              "flood-opacity": "0.7"
            }
          },
          "linearGradient": {
            "x1": "0%",
            "y1": "0%",
            "x2": "0%",
            "y2": "100%",
            "offsets": {
              "0%": {
                "stop-color": "#facc22"
              },
              "100%": {
                "stop-color": "#f83600"
              }
            }
          }
        }
      }
    };
    ```
