
module.exports = function(fn) {
	// return instance
	return function (target, formOps, opts) {
		opts = opts || {};
		// defaults
		var form = {
			formSettings: {
				action: target, 
				method: opts.method || 'POST'
			}, 
			settings: {
				pre: 'frm_',
				escape: true
			},
			datas: {},
			labels: {}
		};

		fn.mergeObject(form.formSettings, formOps);
		fn.mergeObject(form.settings, opts);

		// get or set for form datas
		form.data = function (keyOrObj, value) {
			if ( typeof keyOrObj === 'string' && typeof value !== 'undefined' ) {
				fn.path.set(keyOrObj, value, form.datas); // key-value setting
				return form;
			} else if ( typeof keyOrObj === 'string' && typeof value === 'undefined' ) {
				return fn.path.get(keyOrObj, form.datas); // get data
			}
			fn.mergeObject(form.datas, typeof keyOrObj.toJSON === 'function' ? keyOrObj.toJSON() : keyOrObj ); // merge datas
			return form;
		};

		// set the labels
		form.labels = function (labelsObj) {
			form.labels = labelsObj;
		};

		form.dataEscapeIf = function (name) {
			var data = form.data(name);
			if ( !data )
				return data;
			return form.settings.escape ? fn.e(data) : data;
		}

		// convert dot notation to array for display
		form.resolveName = function (name) {
			if ( name.indexOf('.') === -1 )
				return name;

			name = name.replace('.', '[');

			if ( name.indexOf('.') !== -1 )
				name = name.replace(/\./g, '][');

			return name + ']';
		};

		form.resolveId = function (name) {
			return form.settings.pre + name.replace(/\./g, '_');
		};

		form.begin = function (pTarget, pOpts) {
			return fn.form.begin(pTarget || form.formSettings.action, pOpts || form.formSettings );
		};

		form.end = function () { return '</form>'; };

		form.label = function (name, label, opts) {
			opts 		= opts || {};
			opts.for 	= form.resolveId(name);

			return fn.form.label(label || fn.ucFirst(name), opts);
		};

		form.inputField = function (name, opts) {
			if (name) {
				opts 		= opts || {};
				opts.name 	= form.resolveName(name);
				opts.id 	= form.resolveId(name);
				opts.value 	= form.dataEscapeIf(name);

				if ( opts.type === 'checkbox' || opts.type === 'radio' )
					opts.checked = opts.value ? 'checked': null;
			}
			return fn.form.inputField(opts);
		};

		form.textField = function (name, opts) {
			return form.inputField(name, opts);
		};

		form.passwordField = function (name, opts) {
			opts 		= opts || {};
			opts.type 	= 'password';

			return form.inputField(name, opts);
		};

		form.fileField = function (name, opts) {
			opts 		= opts || {};
			opts.type 	= 'file';

			return form.inputField(name, opts);
		};

		form.textArea = function (name, opts) {
			opts 		= opts || {};
			opts.name 	= form.resolveName(name);
			opts.id 	= form.resolveId(name);

			return '<textarea'+ fn.toAttr(opts) +'>'+ form.dataEscapeIf(name) +'</textarea>';
		};

		form.dropDownList = function (name, elements, opts) {
			opts		= opts || {},
			opts.name 	= form.resolveName(name),
			opts.id 	= form.resolveId(name);

			var cLabel	= null,
				cValue	= null;
				val 	= form.dataEscapeIf(name);

			// empty box
			var empty = opts.empty ? 
				'\t<option'+ fn.toAttr({ value: '', selected: !val && typeof val !== 'number' ? 'selected': null }) +'>'+ opts.empty +'</option>\n' : '';
			delete opts.empty;
			// detect key, value
			if (opts.label || opts.value) {
				cLabel = opts.label || 'label';
				cValue = opts.value || 'value';
				delete opts.label;
				delete opts.value;
			}

			var output = '<select'+ fn.toAttr(opts) +'>\n'+ empty;

			if (cValue) {
				for (var i in elements) {
					var el = typeof elements[i].toJSON !== 'undefined' ? elements[i].toJSON() : elements[i];
					if (el.hasOwnProperty(cValue) && el.hasOwnProperty(cLabel)) {
						output += '\t<option'+ fn.toAttr({ value: el[cValue], selected: el[cValue] == val ? 'selected' : null }) +'>'+ el[cLabel] +'</option>\n';
					}
				}
			} else if (Array.isArray(elements)) {
				for (var i in elements) {
					output += '\t<option'+ fn.toAttr({ value: i, selected: i == val ? 'selected' : null }) +'>'+ elements[i] +'</option>\n';
				}
			} else {
				for (var i in elements) {
					if (elements.hasOwnProperty(i)) {
						output += '\t<option'+ fn.toAttr({ value: i, selected: i == val ? 'selected' : null }) +'>'+ elements[i] +'</option>\n';
					}
				}
			}

			return output + '</select>';
		};

		form.checkBox = function (name, opts) {
			opts 		= opts || {};
			opts.type 	= 'checkbox';

			return form.inputField(name, opts);
		};

		form.radioButton = function (name, opts) {
			opts 		= opts || {};
			opts.type 	= 'radio';

			return form.inputField(name, opts);
		};

		form.button = function (label, opts) {
			opts 		= opts || {};
			opts.value 	= label || opts.value || null;

			return '<button'+ fn.toAttr(opts)+' />';
		};

		form.resetButton = function (label, opts) {
			opts 		= opts || {};
			opts.type 	= 'reset';
			opts.value 	= label;

			var name = opts.name ? opts.name : null;
			delete opts.name;

			return form.inputField(name, opts);
		};

		form.submitButton = function (label, opts) {
			opts 		= opts || {};
			opts.type 	= 'submit';
			opts.value 	= label;

			var name = opts.name ? opts.name : null;
			delete opts.name;

			return form.inputField(name, opts);
		};

		return form;
	};
};