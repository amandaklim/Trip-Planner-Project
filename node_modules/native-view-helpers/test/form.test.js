var assert = require("assert"),
	helper = require("../index"),
	form   = helper.form;

describe('#form', function() {
	it('should use begin', function (){
		assert.equal(form.begin(), '<form action="" method="POST">')
		assert.equal(form.begin('/target'), '<form action="/target" method="POST">')
		assert.equal(form.begin('/target', {method: 'GET'}), '<form method="GET" action="/target">')
		assert.equal(form.begin('/target', {upload: true }), '<form action="/target" method="POST" enctype="multipart/form-data">')
		assert.equal(form.begin('/target', {upload: true, class: 'form' }), '<form class="form" action="/target" method="POST" enctype="multipart/form-data">')
	})

	it('should use label', function () {
		assert.equal(form.label('Caption'), '<label>Caption</label>')
		assert.equal(form.label('Caption', {for: 'name'}), '<label for="name">Caption</label>')
		assert.equal(form.label('Caption', {for: 'name', class: 'required'}), '<label for="name" class="required">Caption</label>')
	})

	it('should use hidden field', function () {
		assert.equal(form.hiddenField('Name'), '<input type="hidden" name="Name" />')
		assert.equal(form.hiddenField('Name', 'Value'), '<input type="hidden" name="Name" value="Value" />')
		assert.equal(form.hiddenField('Name', 'Value', { id: 'no'}), '<input type="hidden" name="Name" value="Value" id="no" />')
	})

	it('should use text field', function () {
		assert.equal(form.textField('email'), '<input type="text" name="email" />')
		assert.equal(form.textField('email', ''), '<input type="text" name="email" value="" />')
		assert.equal(form.textField('email', 'test@test.com'), '<input type="text" name="email" value="test@test.com" />')
		assert.equal(form.textField('email', 'val', { class: 'mail' }), '<input type="text" name="email" value="val" class="mail" />')
	})

	it('should use password field', function () {
		assert.equal(form.passwordField('pw'), '<input type="password" name="pw" />')
		assert.equal(form.passwordField('pw1', ''), '<input type="password" name="pw1" value="" />')
		assert.equal(form.passwordField('pw2', 'pass'), '<input type="password" name="pw2" value="pass" />')
		assert.equal(form.passwordField('pw3', 'val', { class: 'pass' }), '<input type="password" name="pw3" value="val" class="pass" />')
	})

	it('should use text area', function () {
		assert.equal(form.textArea('ta'), '<textarea name="ta"></textarea>')
		assert.equal(form.textArea('ta', 'value'), '<textarea name="ta">value</textarea>')
		assert.equal(form.textArea('ta', 'value', { rows: 4, cols: 10, class: 'cl'}), '<textarea rows="4" cols="10" class="cl" name="ta">value</textarea>')
	})

	it('should use checkBox', function () {
		assert.equal(form.checkBox('name') ,'<input type="checkbox" name="name" value="1" />')
		assert.equal(form.checkBox('name', true) ,'<input type="checkbox" name="name" value="1" checked="checked" />')
		assert.equal(form.checkBox('name', 1) ,'<input type="checkbox" name="name" value="1" checked="checked" />')
		assert.equal(form.checkBox('name', false) ,'<input type="checkbox" name="name" value="1" />')
		assert.equal(form.checkBox('name', 0) ,'<input type="checkbox" name="name" value="1" />')
	})

	it('should use radio button', function () {
		var radioBtnList = {
			'value1': 'Label 1',
			'value2': 'Label 2',
			'value3': 'Label 3'
		};

		assert.equal(form.radioButtonList('name', null, radioBtnList), 
			'<input type="radio" name="name" value="value1" /> Label 1\n'+
			'<input type="radio" name="name" value="value2" /> Label 2\n'+
			'<input type="radio" name="name" value="value3" /> Label 3\n'
		)

		assert.equal(form.radioButtonList('name', 'value2', radioBtnList), 
			'<input type="radio" name="name" value="value1" /> Label 1\n'+
			'<input checked="checked" type="radio" name="name" value="value2" /> Label 2\n'+
			'<input type="radio" name="name" value="value3" /> Label 3\n'
		)
		// custom style
		assert.equal(form.radioButtonList('name', null, radioBtnList, { template: '{input}<br>{label}'}), 
			'<input type="radio" name="name" value="value1" /><br>Label 1\n'+
			'<input type="radio" name="name" value="value2" /><br>Label 2\n'+
			'<input type="radio" name="name" value="value3" /><br>Label 3\n'
		)
	})

	it('should use file filed', function () {
		assert.equal(form.fileField('img'), '<input type="file" name="img" />')
	})

	it('should use button', function () {
		assert.equal(form.button('Save'), '<button value="Save" />')
		assert.equal(form.button('Save', {name: 'save'}), '<button name="save" value="Save" />')
	})

	it('should use reset button', function () {
		assert.equal(form.resetButton('Reset'), '<input value="Reset" type="reset" />')
		assert.equal(form.resetButton('Reset', { name: 'r'}), '<input name="r" value="Reset" type="reset" />')
	})

	it('should use submit button', function () {
		assert.equal(form.submitButton('Save'), '<input value="Save" type="submit" />')
		assert.equal(form.submitButton('Save', { name: 'save' }), '<input name="save" value="Save" type="submit" />')
	})

	it('should use end', function () { 
		assert.equal(form.end(), '</form>')
	})

	describe('should use drop down list', function () {
		it('array version', function () {
			assert.equal(form.dropDownList('name', null, ['el 1', 'el 2']), 
				'<select name="name">\n'+
	      		'\t<option value="0">el 1</option>\n'+
	      		'\t<option value="1">el 2</option>\n'+
	      		'</select>'
			)

			assert.equal(form.dropDownList('name', null, ['el 1', 'el 2'], { empty: '-- select --'}), 
				'<select name="name">\n'+
				'\t<option value="" selected="selected">-- select --</option>\n'+
	      		'\t<option value="0">el 1</option>\n'+
	      		'\t<option value="1">el 2</option>\n'+
	      		'</select>'
			)

			assert.equal(form.dropDownList('name', 1, ['el 1', 'el 2'], { empty: '-- select --'}), 
				'<select name="name">\n'+
				'\t<option value="">-- select --</option>\n'+
	      		'\t<option value="0">el 1</option>\n'+
	      		'\t<option value="1" selected="selected">el 2</option>\n'+
	      		'</select>'
			)
		})

		it('simple json key value version', function () {
			assert.equal(form.dropDownList('name', null, { key1: 'val 1', key2: 'val 2'}), 
				'<select name="name">\n'+
	      		'\t<option value="key1">val 1</option>\n'+
	      		'\t<option value="key2">val 2</option>\n'+
	      		'</select>'
			)

			assert.equal(form.dropDownList('name', null, { key1: 'val 1', key2: 'val 2'}, { empty: '-- select --'}), 
				'<select name="name">\n'+
				'\t<option value="" selected="selected">-- select --</option>\n'+
	      		'\t<option value="key1">val 1</option>\n'+
	      		'\t<option value="key2">val 2</option>\n'+
	      		'</select>'
			)

			assert.equal(form.dropDownList('name', 'key2', { key1: 'val 1', key2: 'val 2'}, { empty: '-- select --'}), 
				'<select name="name">\n'+
				'\t<option value="">-- select --</option>\n'+
	      		'\t<option value="key1">val 1</option>\n'+
	      		'\t<option value="key2" selected="selected">val 2</option>\n'+
	      		'</select>'
			)
		})

		it('array with json documents (custom key value version)', function () {
			var docs = [
				{ id: 1, name: 'val 1'},
				{ id: 2, name: 'val 2'},
				{ id: 3, name: 'val 3'}
			];

			assert.equal(form.dropDownList('name', null, docs, { value: 'id', label: 'name'}), 
				'<select name="name">\n'+
	      		'\t<option value="1">val 1</option>\n'+
	      		'\t<option value="2">val 2</option>\n'+
	      		'\t<option value="3">val 3</option>\n'+
	      		'</select>'
			)
			
			assert.equal(form.dropDownList('name', null, docs, { empty: '-- select --', value: 'id', label: 'name'}), 
				'<select name="name">\n'+
				'\t<option value="" selected="selected">-- select --</option>\n'+
	      		'\t<option value="1">val 1</option>\n'+
	      		'\t<option value="2">val 2</option>\n'+
	      		'\t<option value="3">val 3</option>\n'+
	      		'</select>'
			)

			assert.equal(form.dropDownList('name', 2, docs, { empty: '-- select --', value: 'id', label: 'name'}),
				'<select name="name">\n'+
				'\t<option value="">-- select --</option>\n'+
	      		'\t<option value="1">val 1</option>\n'+
	      		'\t<option value="2" selected="selected">val 2</option>\n'+
	      		'\t<option value="3">val 3</option>\n'+
	      		'</select>'
			)
		})
	})
})