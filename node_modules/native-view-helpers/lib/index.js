(function (fn){
	"use strict";

    var qs      = require('querystring'),
        url     = require('url');
        fn.path = require('mpath');

    // for escape
    var escapeExp = /[&<>"]/,
        escapeAmpExp = /&/g,
        escapeLtExp = /</g,
        escapeGtExp = />/g,
        escapeQuotExp = /"/g,
        regExpEscape = function (str) {
            return String(str).replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1');
        };

    // --- escape ----------
    fn.e = function (text) {
        if (text == null) {
            return '';
        }
        var result = text.toString();
        if (!escapeExp.test(result)) {
            return result;
        }
        return result.replace(escapeAmpExp, '&#38;').replace(escapeLtExp, '&#60;').replace(escapeGtExp, '&#62;').replace(escapeQuotExp, '&#34;');
    };

    fn.url = function (urlStr) {
        var urlProcessor = {
            url     : null,
            query   : null,

            setQs   : function (key, value) {
                this.query[key] = value;
                this.url.query = qs.stringify(this.query);
                this.url.search = '?'+ this.url.query;
                return this;
            },
            getQs   : function (key) {
                return this.query[key];
            },
            getUrl  : function () {
                return url.format (this.url);
            }
        };

        urlProcessor.url    = url.parse(urlStr);
        urlProcessor.query  = qs.parse(urlProcessor.url.query);

        return urlProcessor;
    };

    // http://kevin.vanzonneveld.net - PHP style number_format
    fn.number_format = function(number, decimals, dec_point, thousands_sep) {
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    };

    fn.numberFormat = function (number, opts) {
    	opts = opts || {};
    	if (typeof opts.decpoint === 'undefined')
    		opts.decpoint = '.';
    	if (typeof opts.sep === 'undefined')
    		opts.sep = ',';
    	if (typeof opts.decimals === 'undefined')
    		opts.decimals = 0;
    	return fn.number_format(number, opts.decimals, opts.decpoint, opts.sep);
    };

    // simple merge objects
    fn.mergeObject = function(to, from) {
        if (to == null && from == null)
            return to;
        if (to == null && from != null)
            to = {};
        for (var key in from)
    	    if (from.hasOwnProperty(key)){
    	    	if (typeof from[key] === 'object')
    	    		to[key] = fn.mergeObject(to[key], from[key]);
    	    	else	
    	    		to[key] = from[key];
    	    }
        return to;
	}

    // --- for FROM helpers { name: 'Foo'} -> name="Foo", { data: { id: 5 } } -> data-id="5", { fo: { bar: 'val' } } -> fo-bar="val"
    fn.toAttr = function (Obj, escape) {
    	escape = escape || false;
    	var attributes = '';

    	for (var key in Obj) {
    		var val = Obj[key];
    		if ( val != null && typeof val !== 'undefined' ) {
                if ( typeof val === 'function' )
                    attributes += ' '+ key + '="'+ ( escape ? fn.e(val()) : val() ) +'"';
                else    
                    attributes += ' '+ key + '="'+ ( escape ? fn.e(val) : val ) +'"';
            }
    	}
    	return attributes;
    };

    fn.repeat = function(sep, count){
        var out = '';
        for(var i=0; i<count; i++)
            out += sep;
        return out;
    };

    fn.date2Digit = function(num){
      if (num.toString().length == 1)
        return "0"+ num.toString();
      return num;
    };

    // http://phpjs.org/functions/nl2br/ , http://kevin.vanzonneveld.net
    fn.nl2br = function (str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>'; // Adjust comment to avoid issue on phpjs.org display
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    };

    fn.htmlspecialchars = function (string, quote_style, charset, double_encode) {
        // http://kevin.vanzonneveld.net
        var optTemp = 0,
        i = 0,
        noquotes = false;
        if (typeof quote_style === 'undefined' || quote_style === null) {
            quote_style = 2;
        }
        string = string.toString();
        if (double_encode !== false) { // Put this first to avoid double-encoding
            string = string.replace(/&/g, '&amp;');
        }
        string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        var OPTS = {
            'ENT_NOQUOTES': 0,
            'ENT_HTML_QUOTE_SINGLE': 1,
            'ENT_HTML_QUOTE_DOUBLE': 2,
            'ENT_COMPAT': 2,
            'ENT_QUOTES': 3,
            'ENT_IGNORE': 4
        };
        if (quote_style === 0) {
            noquotes = true;
        }
        if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
                // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
                if (OPTS[quote_style[i]] === 0) {
                    noquotes = true;
                }
                else if (OPTS[quote_style[i]]) {
                    optTemp = optTemp | OPTS[quote_style[i]];
                }
        }
        quote_style = optTemp;
        }
        if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, '&#039;');
        }
        if (!noquotes) {
        string = string.replace(/"/g, '&quot;');
        }

        return string;
    };

    fn.strip_tags = function (input, allowed) {
        // http://kevin.vanzonneveld.net
        allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        });
    };

    fn.ucFirst = function (text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    fn.countChars = function(regex, str) {
        if (! regex.global) {
            throw new Error('Please set flag /g of regex');
        }
        var origLastIndex = regex.lastIndex;  // store
        regex.lastIndex = 0;

        var count = 0;
        while (regex.test(str)) count++;

        regex.lastIndex = origLastIndex;  // restore
        return count;
    };

    // for express router - app.use(require('native-view-helpers').use)
    /*
    fn.use = function (varName) {
        varName = varName || '$';
        return function (req, res, next) {
            res.locals[varName] = res.locals[varName] || {};

            res.locals[varName].xhr = req.xhr;
            res.locals[varName].isAjax = function () { return req.xhr; };
            res.locals[varName].qs = req.query;
            next();
        };
    };
    */

    // --- load more plugins ----------------------
    require('fs').readdirSync(__dirname).forEach(function (file) {
		var name = file.substr(0, file.indexOf('.'));
		if ( name.length && name !== 'index' )
			fn[name] = require(__dirname + '/'+ name)(fn);
	});

})(module.exports);