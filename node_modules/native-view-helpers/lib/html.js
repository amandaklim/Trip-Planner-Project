
module.exports = function(fn) {
	var qs		= require('querystring'),
		html	= {};

	html.el = function (name, opts) {
		return  html.beginEl(name, opts) + html.endEl(name);
	};

	html.beginEl = function (name, opts) {
		opts = opts || {};

		var innerHTML = opts && typeof opts.val !== 'undefined' ? fn.e(opts.val) : ''; // escaped value
		delete opts.val;
		if (opts && typeof opts.html !== 'undefined') {
			innerHTML =  opts.html;
			delete opts.html;
		}
		return '<'+ name + fn.toAttr(opts) +'>'+ innerHTML;
	};

	html.endEl = function (name) {
		return '</'+ name +'>';
	};

	// meta charset
	html.charset = function (charset) {
		charset = charset || 'utf-8';
		return '<meta charset="'+ charset +'" />';
	};

	html.css = function (href, opts) {
		return '<link'+ fn.toAttr(fn.mergeObject({ href: href, rel: 'stylesheet', type: 'text/css', media: 'all'}, opts)) +' />';
	};

	html.script = function (src, opts) {
		return '<script'+ fn.toAttr(fn.mergeObject({ src: src, type: 'text/javascript'}, opts)) +'></script>';
	};

	html.a = function(link, text, opts) {
		return '<a'+ fn.toAttr(fn.mergeObject({ href: link }, opts)) +'>'+ text +'</a>';
	};

	html.img = function (src, alt, opts) {
		return '<img'+ fn.toAttr(fn.mergeObject({ src: src, alt: alt }, opts)) +' />';
	};

	html.imgText = function(text, opt) {
        opt = opt || {};
        var fgColor = opt.fgColor || 'EFEFEF';
        var bgColor = opt.bgColor || 'AAAAAA';
        var w = opt.w || 291;
        var h = opt.h || 170;
        text = text || 'nincs kép';
        // http://www.placehold.it/291x170/EFEFEF/AAAAAA&amp;text=nincs+kép
        return '<img src="http://www.placehold.it/'+w+'x'+h+'/'+fgColor+'/'+bgColor+'&amp;text='+qs.escape(text)+'" />';
    };

    html.refresh = function (url, sec, opts) {
    	if (!sec)
    		sec = 5;
    	return '<meta'+ fn.toAttr(fn.mergeObject({ 'http-equiv': 'refresh', content: sec +',URL='+ url }, opts)) +' />';
    };

	return html;
};