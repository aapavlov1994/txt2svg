# txt2svg
_Это утилита для конвертации из текста в выбранном шрифте в изображение SVG с сохранением стилей._

В папке example приведен рабочий пример, который состоит из node-скрипта, json-конфига со стилями,
папки с шрифтами, папкой со словарями для необходимых локалей и папкой для выгрузки, где будут созданы
папки с соотв. локалями и svg-изображениями в них.

### Гайд по node-скрипту:

Подключяем утилиту и path пакет для получения абсолютных путей:
```javascript
const path = require('path');
const txt2svg = require('../index.js'); // если это пакет => 'txt2svg'
```

Если стили имеют простую логику, т.е. каждому слову из словаря,
есть соотв. объект в json конфиге, то просто подключаем конфиг и идем дальше -
объект со стилями готов.
```javascript
const styles = require('./svgConfig.json');
```
    
Часто бывает, что стили дублируются для разных фраз.
В этом случае лучше создать объект со стилями на лету (можно взять за основу json конфиг).
В приведенном примере мы хотим получить два месседжа для двух ориентаций, поэтому
 мы присваиваем элементам, начинающимся с `'message_top'` соотв. стиль. Тоже самое для
 `'message_bottom'`. Если ключу из словаря есть соотв. в конфиге - присваеваем,
 для всех остальных элементов используется стиль для цифр.
```javascript
const dict = require('./dictionary/en.json'); // needs to generate style object on fly
const txt2svgStyles = {}; // object for elements (future svg) with their styles
Object.keys(dict).forEach((key) => {
  if (key.startsWith('message_top')) txt2svgStyles[key] = styles.messageTop;
  else if (key.startsWith('message_bottom')) txt2svgStyles[key] = styles.messageBottom;
  // if dictionary element has styles specially for him - use it
  else if (styles[key]) txt2svgStyles[key] = styles[key];
  // use number style for all others elements (digits)
  else txt2svgStyles[key] = styles.number;
});
```

Указываем абсолютные пути к папкам со шрифтами, выгрузки свг и словарю:
```javascript
const fontsPath = path.resolve(__dirname, './fonts');
const distPath = path.resolve(__dirname, './output');
const dictionaryPath = path.resolve(__dirname, './dictionary');
```

Отлавливаем локали в консоли либо задаем вручную
(если локали не заданы, то генерация будет проходить по всем доступным локалям):
```javascript
const locales = process.argv.slice(2);
```

Пробрасываем настройки и запускаем генерацию:
```javascript
txt2svg.setLocales(locales);
txt2svg.setStyles(styles);
txt2svg.setFontsPath(fontsPath);
txt2svg.setDistPath(distPath);
txt2svg.setDictionaryPath(dictionaryPath);
txt2svg.run();
```

### Гайд по json-конфигу:

Для элемента указывается шрифт вместе с расширением (должен находиться в указанной папке),
padding - межстрочное расстояние для элементов-мультистрок, styles - непоспредственно свг стили,
где `stroke-width / stroke` - ширины обводки с цветом, `fill` - простая заливка, если нужна градиентная,
то используем блок `linearGradient`, для фильтров ипользуем блок фильтр, в котором вы можете
оформить будующий тег с атрибутами в виде объекта с соотв свойствами. Для генерации
сложных фильтров также можно использовать сво-во `HTML_INSERTION`,
куда вы можете передать все фильтры в виде строки (посмотрите в папке с примером):

```json
"messageTop": {
    "font": "riffic-bold.ttf",
    "padding": -40,
    "styles": {
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
```
