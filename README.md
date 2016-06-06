# SCUD

SCUD - это простой, легковесный и производительный JS шаблонизатор.

Он не содержит логическийх операторов таких как **if** или **switch**, и создан исключительно для шаблонизации данных, а не для построния логики, благодаря этому он весьма поизводителен и легковесен. Однако, при этом вам доступны простейшие операции вложения шаблонов и обработки шаблонов в цикле, благодаря операторам **INC** и **EACH**.

## Установка
Чтобы начать использовать шаблонизацию на вашем сайте, необходимо подключить всего один скрипт. Так как SCUD использует jQuery для загрузки шаблонов, его надо подключать после подключения фреймворка. 
Добавьте в тег <head> следующий код, заменив "/path/to/sj/" на путь до папки в которой лежит шаблонизатор:

```Javascript
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
<script src="/path/to/sj/scud.min.js"></script>
```

**SCUD** может загружать шаблоны динамически, по потребности, или при инициализации объекта. В шаблонизатор встроена система кэширования шаблонов, которая позволяет не обращаться повторно на сервер за шаблоном каждый раз. Для того чтобы загрузить шаблоны при инициализации объекта, и не тратить время на загрузку шаблона при первом его использовании, достаточно передать параметр **"patterns"** в объект параметров.

## Пример использования
Ниже приведен пример простого использования с циклом.
```html
<!-- /tps/list-contact-item.tpl -->

<div>
    <div>{name}</div>
    <div>{lastName}</div>
    <div>
        <label>Должность</label>
        <select>
           {EACH:employeePositions:option-template}
        </select>
    </div>
    <a href="{detailPageURL}">Подробнее о {buttonText}</a>
</div>

<!-- /tps/option-template.tpl -->

<option value="{positionID}" {selected}>{positionName}</option>
```

```javascript
var params = {
   patterns : ['list-contact-item']
};
var someDataObject = {
    name : 'John',
    employeePositions : [
        {
            positionID : 1,
            positionName : 'Admin',
            ...
        },
        ...
    ],
    ...
};

var template = new scud(params);
template.process_pattern(someDataObject, 'list-contact-item', function(html){
    // do something with it =)
});
```

Еще примеры и более подробное описание на [сайте](http://scud-js.ru/) проекта
