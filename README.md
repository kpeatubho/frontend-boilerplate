# frontend-boilerplate
Шаблон сборщика корректной кроссбраузерной верстки, основанной на компонентном подходе.

Для использования шаблона необходимо выполнить следующие шаги:

1. Клонировать этот репозиторий себе
2. ```$ npm i```

После установки всех зависимостей таск-менджер gulp будет готов к сборке проекта. Соответственно сборку запускаем командой:

```$ gulp```

В таске default описана сборка всех ресурсов, наблюдение за изменениями и сервер.

Таски менеджера можно запускать отдельно (например, для сборки только css или js). За более подробной инфой смотрите в файл gulpfile.js.

В проекте применен подход объединения SVG файлов в спрайт в виде файла шрифта. Такие спрайты в HTML будут описываться классом ```iconfont iconfont-[filename]```

Также в проекте подключен модуль babel с прессетом для адаптации синтакиса es2015 для старых браузеров, так что можно смело писать на es2015 не боясь, что какие-то конструкции буут неправильно восприняты старыми браузерами.

Для шаблонизации внутри проекта испольузется два модуля:
```gulp-rigger```
и
```gulp-file-include```

### Структура проекта:

|- ajax\
|- assets\
|- |- fonts\
|- |- img\
|- |- |- iconfont\
|- |- js\
|- |- |- main.js\
|- |- scss\
|- |- |- main.scss\
|- |- |- common\
|- |- |- |- _iconfont.scss\
|- |- |- |- _template.scss\
|- |- |- import\
|- |- |- |- _mixins.scss\
|- |- |- |- _variables.scss
|- modules\
|- pages\
|- |- index.html

```ajax``` содержит статичные json файлы для эмуляции ajax-вызовов\
```assets``` содержит файлы статичных ресурсов используемых в верстке\
```assets/fonts``` содержит файлы подключаемых шрифтов\
```assets/img``` содержит файлы графических ресурсов\
```assets/img/iconfont``` содержит SVG файлы, которые в последюущем будут объеденины в файл-спрайт в виде шрифта\
```assets/js``` содержит JS файлы проекта\
```assets/js/main.js``` основной JS файл проекта, в который будет подключаться все дополнительный файлы (в проекте по дефолту подключается jquery последней версии)\
```assets/scss``` содержит SCSS файлы проекта\
```assets/scss/main.scss``` содержит подключение всех базовых стилей, переменных и миксинов\
```assets/scss/common``` содержит базовые стили присущие всем страницам проекта\
```assets/scss/common/_iconfont.scss``` при добавлении SVG файлов в ```img/iconfont``` в этот файл будут писаться стили для iconfont\
```assets/scss/common/_template.scss``` содержит базовые стили шаблона проекта\
```assets/scss/import``` содержит импоритруемые переменные и миксины проекта\
```assets/scss/import/_mixins.scss``` содержит миксины пректа\
```assets/scss/import/_variables.scss``` содержит переменные пректа
```modules``` содержит файлы подключаемых компонентов на странице\
```pages``` содержит файлы страниц\
```pages/index.html``` пример индексной страницы\

Шаблон сборщика расчитан на ситуации, когда необходимо верстать страницы для разных видов устройств. Для того чтобы верстать страницы под конкретные утсройства, необходимо создать папки:\
```desktop```\
```tablet```\
```mobile```\
в папках \
```pages```\
```modules```\
```assets```\
при этом в папке ```assets``` необходимо при создании соответствующей папки, внутрь нужно скопировать существующую структуру из кореновй папки ```assets``` (без папок ```desktop```, ```tablet```, ```mobile```).

Сборка будет проихсодить в соответствующие папки в ```build```