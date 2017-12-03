
module.exports = function(fn) {
	var form = {};

	form.begin = function (target, opts) {
		opts = opts || {};
		opts.action = opts.action || target || '';
		opts.method = opts.method || 'POST';
		if (opts.upload || opts.multipart) {
			delete opts.upload;
			delete opts.multipart;
			opts.enctype = 'multipart/form-data';
		}

		return '<form'+ fn.toAttr(opts) +'>';
	};

	form.end = function () {
		return '</form>';
	};

	form.label = function (label, opts) {
		return '<label'+ fn.toAttr(opts)+'>'+ label +'</label>';
	};

	form.inputField = function (opts) {
		opts = opts || {};
		opts.type = opts.type || 'text';
		opts.disabled = opts.disabled ? 'disabled' : null;

		return '<input'+ fn.toAttr(opts) +' />';
	};

	form.hiddenField = function (name, val, opts) {
		return form.inputField(fn.mergeObject({ type: 'hidden', name: name, value: val }, opts) );
	};

	form.textField = function (name, val, opts) {
		return form.inputField(fn.mergeObject({ type: 'text', name: name, value: val }, opts) );
	};

	form.passwordField = function (name, val, opts) {
		return form.inputField(fn.mergeObject({ type: 'password', name: name, value: val }, opts) );
	};

	form.textArea = function (name, val, opts) {
		opts = opts || {};
		opts.name = name;
		val = val || '';
		return '<textarea'+ fn.toAttr(opts) +'>'+ val +'</textarea>';
	};

	form.dropDownList = function (name, val, elements, opts) {
		opts	= opts || {},
		label	= null,
		value	= null;
		// empty box
		var empty = opts.empty ? 
			'\t<option'+ fn.toAttr({ value: '', selected: !val && typeof val !== 'number' ? 'selected': null }) +'>'+ opts.empty +'</option>\n' : '';
		delete opts.empty;
		// detect key, value
		if (opts.label || opts.value) {
			label = opts.label || 'label';
			value = opts.value || 'value';
			delete opts.label;
			delete opts.value;
		}

		var output = '<select'+ fn.toAttr(fn.mergeObject({name: name}, opts)) +'>\n'+ empty;
		
		if (value) {
			// json elements in array version
			for (var i in elements) {
				var el = elements[i];
				if (el.hasOwnProperty(value) && el.hasOwnProperty(label)) {
					output += '\t<option'+ fn.toAttr({ value: el[value], selected: el[value] == val ? 'selected' : null }) +'>'+ el[label] +'</option>\n';
				}
			}
		} else if (Array.isArray(elements)) {
			// simple array
			for (var i in elements) {
				output += '\t<option'+ fn.toAttr({ value: i, selected: i == val ? 'selected' : null }) +'>'+ elements[i] +'</option>\n';
			}
		} else {
			// simple json
			for (var i in elements) {
				if (elements.hasOwnProperty(i)) {
					output += '\t<option'+ fn.toAttr({ value: i, selected: i == val ? 'selected' : null }) +'>'+ elements[i] +'</option>\n';
				}
			}
		}

		return output + '</select>';
	};

	form.dateSelector = function (name, value, opts) {
		throw new Error('Not implemented method!');
	};

	form.timeSelector = function (name, value, opts) {
		throw new Error('Not implemented method!');
	};

	form.dateTimeSelector = function (name, value, opts) {
		throw new Error('Not implemented method!');
	};

	form.checkBox = function (name, checked, opts) {
		opts = opts || {};
		opts.type = 'checkbox';
		opts.name = name;
		opts.value= 1;
		opts.checked = checked ? 'checked': null;

		return form.inputField(opts);
	};

	form.radioButton = function (name, val, opts) {
		opts = opts || {};
		opts.type = 'radio';
		opts.name = name;
		opts.value = val || '';
		opts.checked = opts.checked ? 'checked': null;

		return form.inputField(opts);
	};

	form.radioButtonList = function (name, value, list, opts) {
		opts = opts || {};
		var template = opts.template || '{input} {label}';
		delete opts.template;
		var out = '';
		for (var val in list) {
			label = list[val];
			out += template.replace('{input}', form.radioButton(name, val, { checked: val == value })).replace('{label}', label)+'\n';
		}
		return out;
	};

	form.fileField = function (name, opts) {
		opts = opts || {};
		opts.type = 'file';
		opts.name = name;

		return form.inputField(opts);
	};

	form.button = function (label, opts) {
		opts = opts || {};
		opts.value = label;
		return '<button'+ fn.toAttr(opts)+' />';
	};

	form.resetButton = function (label, opts) {
		opts = opts || {};
		if (label)
			opts.value = label;
		opts.type = 'reset';
		return form.inputField(opts);
	};

	form.submitButton = function (label, opts) {
		opts = opts || {};
		if (label)
			opts.value = label;
		opts.type = 'submit';
		return form.inputField(opts);
	};

	return form;
};