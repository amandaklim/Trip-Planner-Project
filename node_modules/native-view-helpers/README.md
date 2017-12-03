# Native view helpers for NodeJS

[![Build Status](https://travis-ci.org/janez89/native-view-helpers.png?branch=master)](https://travis-ci.org/janez89/native-view-helpers)
[![NPM version](https://badge.fury.io/js/native-view-helpers.png)](http://badge.fury.io/js/native-view-helpers)

A collection of helper for NodeJS templates.

`npm install native-view-helpers`

## Overview

* [Usage](#usage)
* [Helpers API](#helpers-api)
	* [Summary](#summary)
	* [Basic](#basic)
		* [e](#e---escape)
		* [url](#url)
		* [numberFormat](#numberformat)
		* [mergeObject](#mergeobject)
		* [toAttr](#toattr)
		* [repeat](#repeat)
		* [nl2br](#nl2br)
		* [htmlspecialchars](#htmlspecialchars)
		* [strip_tags](#strip_tags)
		* [ucFirst](#ucfirst)
		* [countChars](#countchars)
	* [HTML](#html)
		* [a](#a)
		* [el](#el)
		* [beginEl](#beginel)
		* [endEl](#endel)
		* [charset](#charset)
		* [css](#css)
		* [script](#script)
		* [img](#img)
		* [imgText](#imgtext)
		* [refresh](#refresh)
	* [Date](#date)
		* [time](#time)
		* [format](#format)
		* [parse](#parse)
	* [Form](#form)
		* [begin](#begin)
		* [end](#end)
		* [label](#label)
		* [inputField](#inputfield)
		* [hiddenField](#hiddenfield)
		* [textField](#textfield)
		* [passwordField](#passwordfield)
		* [fileField](#filefield)
		* [textArea](#textarea)
		* [dropDownList](#dropdownlist)
		* [checkBox](#checkbox)
		* [radioButton](#radiobutton)
		* [radioButtonList](#radiobuttonlist)
		* [button](#button)
		* [resetButton](#resetbutton)
		* [submitButton](#submitbutton)
	* [ActiveForm - unstable!](#activeform)
		* [Active Form Usage](#active-form-usage)
		* [data](#data)
	* [Widgets](#widgets)
		* [pagination](#pagination)
		* [nestedList](#nestedList)
		* [shippingChooser](#shippingChooser)
* [Changelog](#changelog)
* [Authors and contributors](#authors-and-contributors)
* [License](#license)

<a name="usage"></a>
## Usage

Node native helpers use with express
```javascript
// for static helpers
app.locals.$ = require('native-view-helpers');

// or inside and in examples
var helper = require('native-view-helpers');
```

Use in templates

EJS templates:

```
<%- $.nl2br('\r\n') %> // out: <br />
<%- $.ucFirst('message') %> // out: Message
<%- $.date.format('Y/m/d H:i:s') %>
<%- $.html.a('/url-address', 'Label') %>
<%- $.html.charset() %>

> Use form

<%- $.form.begin('/target') %>

<%- $.form.label('Username') %>
<%- $.form.textField('username') %>

<%- $.form.label('Password') %>
<%- $.form.passwordField('password') %>

<%- $.form.submitButton('Login') %>

<%- $.form.end() %>

> Or active form

<% var form = $.activeForm('/target') %>
<%- form.begin() %>

<%- form.label('username') %>
<%- form.textField('username', { placeholder: 'Username'}) %>

<%- form.label('Password') %>
<%- form.passwordField('password', { placeholder: 'Password'}) %>

<%- form.submitButton('Login') %>
<%- form.end() %>

> Use dropDownList

<%- $.form.dropDownList('category', null, ['Category 1', 'Category 2', 'Category 3'], { empty: '-- Select --'}) %>
<%- $.form.dropDownList('category', 'val3', { val1: 'Category 1', val2: 'Category 2', val3: 'Category 3'}) %>
<%- $.form.dropDownList('category', 12, [{ id: 10, name: 'Category 1'}, { id: 12, name: 'Category 2'}], { value: 'id', label: 'name'}) %>

> Use radio button list

// in javascript
var radioButtonList = {
	"value1": "Label 1",
	"value2": "Label 2",
	"value3": "Label 3" 
};

<%- $.form.radioButtonList('name', 'value1', radioButtonList) %>

> radio button list with custom template

<%- $.form.radioButtonList('name', 'value1', radioButtonList, { template: '{input} &lt;span&gt;{label}&lt;/span&gt;' }) %>

> Use pagination

<%- $.widgets.pagination({page: 1, pages: 12 }) %>
<%- $.widgets.pagination({page: 1, count: 120, limit: 10 }) %>
<%- $.widgets.pagination({page: 1, pages: 12, url: '/index?sort=name' }) %> out: /index?sort=name&page=[num]
<%- $.widgets.pagination({page: 1, pages: 12, url: '/index?sort=name', query: 'p' }) %> out: /index?sort=name&p=[num]

> Building tree

var list = [
	{ 
		id: 1, 
		name: 'Main Category', 
		children: [ 
			{ id: 2, name: 'Sub Category 1' }, 
			{ id: 2, name: 'Sub Category 1'	} 
		]
	}
];

<%- $.widgets.nestedList(list, function (fn, el, lvl) { return fn.html.a('/info/'+ el.id, el.name); }) %>

```

[Go to contents](#overview)

***

## Helpers API

### Basic

#### e - escape

> escape string <br>
> e(string)

```javascript
helper.e('escape this content');
```

#### url

> url helper <br>
> url(url\_string)

```javascript
var url = helper.url('http://example.com/?show=name');
url.setQs('name', 'value'); // set Query string name=value
url.getUrl(); // return http://example.com/?shown=name&name=value

// alternative linked solution
helper.url('http://ex.com/?page=5').setQs('page',10).getUrl();

```

#### numberFormat

> PHP number format method <br>
> numberFormat(number, options) <br>
> number_fromat(number, decimals, dec_point, thousands_sep) <br>

```javascript
helper.numberFormat(10000.11111, { sep: ',', decimals: 2});
// return 10,000.11

// PHP style - snake case version
helper.number_format(10000.1111, 2, '.', ',');
// return 10,000.11
```

> numberFormat(number, options)

Options:

* sep: thousands separator
* decpoint: decimal separator
* decimals: number of decimals

> number_format(number, decimals, dec_point, thousands_sep)

#### mergeObject

> Merge to JSON object <br>
> mergeObject(toObject, fromObject) 

```javascript
var obj1 = { name: 'Name' };
var obj2 = { age: 25 };
obj1 = helper.mergeObject(obj1, obj2);
// obj1 return: { name: 'Name', age: 25 }
```

#### toAttr

> Convert JSON object to html key value format. <br>
> toAttr(object)

```javascript
helper.toAttr({ name: "email", value:"mail@mailbox.com" });
// return string: name="email" value="mail@mailbox.com"
```

#### repeat

> The method repeat the string <br>
> repeat(string, count)

```javascript
helper.repeat('=', 10);
// return: ==========
```

#### nl2br

> Convert \r\n, \n\r, \r, \n to &lt;br /&gt; <br>
> nl2br(string)

```javascript
helper.nl2br('New\nData');
// return: New\n<br />Data
```

#### htmlspecialchars

> PHP style htmlspecialchars <br>
> htmlspecialchars(string, [options])

```javascript
helper.htmlspecialchars('<a href="link">label</a>', 'ENT_QUOTES');
// return: &lt;a href=&quot;link&quot;&gt;label&lt;/a&gt;
```

#### strip_tags

> PHP style strip_tags <br>
> strip_tags(string, [allowable_tags])

```javascript
helper.strip_tags('<p><a href="/target">Link</a> Text</p>', '<p>');
// return: <p>Link Text</p>
```

#### ucFirst

> upper case the first charater <br>
> ucFirst(string)

```javascript
helper.ucFirst('the string ...');
// return: The string ...
```

#### countChars

> count chars <br>
> countChars(RegEx, string)

```javascript
helper.countChars(/a/g, 'amazone');
// return: 2
```

[Go to contents](#overview)

***

### HTML

#### a

> Create HTML a element <br>
> html.a(link_string, label_string, [options])

```javascript
helper.html.a('/target', 'Link');
// return: <a hreff="/target">Link</a>

helper.html.a('/target', 'Link', { title: 'Link', class: 'cls' });
// return: <a hreff="/target" title="Link" class="cls">Link</a>
```

#### beginEl

> Create only open tag with parameters <br>
> html.beginEl(name_of_element, options)

```javascript
helper.html.beginEl('p', { class: 'content'});
// return: <p class="content">
```

#### endEl

> Create element only close tag <br>
> html.endEl(name_of_element)

```javascript
helper.html.endEl('p');
// return: </p>
```

#### el

> Create element with close tag <br>
> html.el(name_of_element, options)

```javascript
helper.html.el('p', { class: 'content', html: 'The text'});
// return: <p class="content">The text</p>
```

#### charset

> Create meta element for charset <br>
> html.charset(charset_string [default: 'uft8'])

```javascript
helper.html.charset();
// return: <meta charset="utf8" />

helper.html.charset('other');
// return: <meta charset="other" />
```

#### css

> Create link element for style <br>
> html.css(url_string, options)

```javascript
helper.html.css('style.css');
// return: <link href="style.css" rel="stylesheet" type="text/css" media="all" />

helper.html.css('style.css', { media: 'print'});
// return: <link href="style.css" rel="stylesheet" type="text/css" media="print" />
```

#### script

> Create script source element <br>
> html.script(source_string, options)

```javascript
helper.html.script('app.js');
// return: <script src="app.js" type="text/javascript"></script>
```
#### img

> Create img element <br>
> html.img(image_path, alt, options)

```javascript
helper.html.img('pic.png');
// return: <img src="pic.png" />

helper.html.img('pic.png', 'Big moon');
// return: <img src="pic.png" alt="big moon" />

helper.html.img('pic.png', 'Big moon', { width: 320 });
// return: <img src="pic.png" alt="big moon" width="320" />
```

#### imgText

> Create image element with remote url text caption <br>
> helper.html.imgText(message, options)

```javascript
helper.html.imgText('No Image');
// return: <img src="http://www.placehold.it/291x170/EFEFEF/AAAAAA&text=No Image"  />

helper.html.imgText('No Image', { w: 320, h: 240});
// return: <img src="http://www.placehold.it/320x240/EFEFEF/AAAAAA&text=No Image"  />
```

#### refresh

> Create meta element for refresh <br>
> html.refresh(url, time\_in\_secounds\_after\_redirect, options)

```javascript
helper.refresh('http://target.com');
// return: <meta http-equiv="5,http://target.com" />
```

[Go to contents](#overview)

***

### Date

#### time

> Create unix timestamp <br>
> date.time([new Date Or '2013-08-28 19:45 ])

```javascript
helper.date.time(); // retun timestamp in seconds
// return 1377715631

helper.date.time('2013-08-28 19:45');
// return 1377737100

helper.date.time(new Date()); 
// return 1377715631
```

#### format

> PHP style date format <br>
> date.format(format_string, [date\_or\_timestamp])

```javascript
helper.date.format('m/d/Y H:i:s', new Date());
// return 08/28/2013 19:45

helper.date.format('m/d/Y H:i:s', 1377737100);
// return 08/28/2013 19:45 

helper.date.format('m/d/Y H:i:s');
// return 08/28/2013 19:45
```

#### parse

> PHP style date parse <br>
> date.format(date_string) <br>
> return object: { year, month, day, hour, minute, second, fraction, is\_localtime }

[php date format options](http://php.net/manual/en/function.date.php)

[Go to contents](#overview)

***

### Form

#### begin

> Create &lt;form&gt; element <br>
> form.begin(target\_url, options) <br>

```javascript
helper.form.begin();
// return: <form action="" method="POST">

helper.form.begin(null, { method: 'GET' })
// return: <form action="" method="GET">

helper.form.begin('/target', { upload: true, class: 'form' });
// return: <form action="/target" class="form" method="POST" enctype="multipart/form-data">
```

> form begin options <br>
> method: form method, default: POST <br>
> upload: set true for file upload, default: false <br>
> htmlElementName: use object key for other html attribute. id, class <br>

#### end

> Crate &lt;/form&gt; element <br>
> form.end()

#### label

> Create &lt;label&gt; element <br>
> form.label(shown\_label, html\_options) <br>

```javascript
helper.form.label('Username');
// return <label>Username</label>

helper.form.label('Username', { for: 'username' });
// return <label for="username">Username</label>
```

#### inputField 

> Create input field <br>
> form.inputField(html\_options) <br>
> default type text

#### hiddenField

> Create hidden input field <br>
> form.hiddenField(name, value, html\_options)

#### textField

> Create text type input field. <br>
> form.textField(name, value, html\_options)

```javascript
helper.form.textField('username', null, { palceholder: 'Username', class: 'input' });
```

#### passwordField

> Create password type input field <br>
> form.passwordField(name, value, html\_options)

#### fileField

> Create field for file upload <br>
> form.fileField(name, html\_options)

#### textArea

> Create textarea <br>
> form.textArea(name, value, html\_options)

#### dropDownList

> Create select element <br>
> form.dropDownList(name, value, array\_json, html\_options)

```javascript
var list = ["Label 1", "Label 2", "Label 3"]; // index value
helper.form.dropDownList('name', null, list);
helper.form.dropDownList('name', 1, list); // selected 2nd

// with empty chooser
helper.form.dropDownList('name', null, list, { empty: '-- Select --'});

// drop down from JSON
var list = { "val1": "Label 1", "val2": "Label 2", "val3": "Label 3" };
helper.form.dropDownList('name', 'val2', list);

// JSON based Array
var list = [
	{ "id": 1, "name": "Label 1" },
	{ "id": 2, "name": "Label 2" },
    { "id": 3, "name": "Label 3" }
];

helper.form.dropDownList('name', 2, list, { value: "id", label: "name"});

```

> html_options <br>
> value: select value from Object <br>
> label: select label from Object <br>
> empty: empty label <br>

#### checkBox

> Create checkbox type input field <br>
> form.checkBox(name, checked, html\_options)

#### radioButton

> Create radio button <br>
> form.radioButton(name, value, html\_options)

#### radioButtonList

> Create radio button list <br>
> form.radioButtonList(name, value, list, html\_options)

```javascript
var list = {
	'value1': 'Label 1',
	'value2': 'Label 2',
	'value3': 'Label 3'
};

helper.form.radioButtonList('name', null, list );

helper.form.radioButtonList('name', 'value2', list ); // selected value2

// custom template
helper.form.radioButtonList('name', 'value2', list, { template: '{input}<br>{label}' } ); // selected value2

```

#### button

> Create button element <br>
> form.button(label, html\_options)

#### resetButton

> Create reset type input <br>
> form.resetButton(label, html\_options)

#### submitButton

> Create submit type input <br>
> form.submitButton(label, html\_options)



[Go to contents](#overview)

***

### ActiveForm

[Go to contents](#overview)

***

### Widgets

#### pagination

> Generate client side pagination <br>
> widgets.pagination(options)

```javascript
helper.widgets.pagination({ page: 1, pages: 10});
// generate: ul -> li -> a elements
// ...
// <li><a href="?page=[page number]">[page number]</a></li>
// ...

// options page and pages with limit
helper.widgets.pagination({ page: 1, pages: 10, limit: 5 });
// from count
helper.widgets.pagination({ page: 1, count: 105, limit: 10 });
// custom url
helper.widgets.pagination({ page: 1, pages: 10, url: '/site'});
// /site?page=[num]
helper.widgets.pagination({ page: 1, pages: 10, url: '/site?name=data'});
// /site?name=date&page=[num]
helper.widgets.pagination({ page: 1, pages: 10, url: '/site', query: 'p'});
// /stie?p=[num]

// with custom range
helper.widgets.pagination({ page: 1, pages: 10, range: 10 });
```

> pagination options <br>
> page: current page, default: 1 <br>
> pages: number of pages <br>
> limit: number of pages per side, default: 10 <br>
> count: number of elements <br>
> range: number of shown links, default: 6 <br>
> url: site url and query elements <br>
> query: page query variable name, default: page <br>
> active: active link class, default: active <br>
> class: ul element class, default: empty <br>

#### nestedList

> Create &lt;ul&gt;,&lt;li&gt; based hierarchical list. <br>
> widgets.nestedList(List, callback, params) <br>

```javascript
var list = [{ 
	"id": 1, 
	"name": "Main Category", 
	"children": [ 
		{ "id": 2, "name": "Sub Category 1" }, 
		{ "id": 2, "name": "Sub Category 1"	} 
	] 
}];

helper.widgets.nestedList(list, function (fn, el, lvl) { return el.name; })

```

> callback(helperFunctions, element, level) <br>
> nestedList options <br>
> ulClass: ul element class, recursive <br>
> liClass: li element class, recursive <br>

#### shippingChooser

> Create drop down date list for deliver <br>
> widgets.shippingChooser(name\_of\_select, options) <br>

```javascript
helper.widgets.shippingChooser('deliver');
// generate drop down list

helper.widgets.shippingChooser('deliver', { date: new Date('2013-08-28') } );
// generate drop down list from 08/28/2013
```

> shipping chooser options <br>
> date: instance of Date, from calulate. Default: Now <br>
> lang: language, values: en, hu, default: en <br>
> sunDay: shown list sun day, default: false <br>


[Go to contents](#overview)

***

## Changelog

### Aug 28, 2013 - version: 0.1.3

* added form.radioButtonList
* fixed form.checkBox
* added form tests
* updated README.md API description

### Aug 27, 2013 - version: 0.1.2

* fix console.log
* enhacement activeForm dropDownList

### Aug 22, 2013 - version: 0.1.1
* fixed widgets test issue

### Aug 22, 2013 - version: 0.1.0

* added defaults
* added date plugin
* added html plugin
* added form plugin
* added active form plugin
* added widgets
* added tests

## Missing, Todo

* API documentation
* activeForm tests
* more template engine example
* examples

[Go to contents](#overview)

***

## Authors and contributors

* Janos Meszaros: [https://github.com/janez89](https://github.com/janez89)
* For PHP style functions (number_format, date, strip_tags, htmlspeicalchars, nl2br) [http://phpjs.org/functions](http://phpjs.org/functions)

[Go to contents](#overview)

***

## License

The MIT License (MIT)

Copyright (c) 2013 Janez

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[Go to contents](#overview)

***
