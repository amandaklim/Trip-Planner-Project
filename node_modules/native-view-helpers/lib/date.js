module.exports = function(fn) {
	// the php function from http://phpjs.org/functions/
	var date = {};

	// php style timestamp
	date.time = function (date) {
		if (date)
			date = date instanceof Date ? date : new Date(date);
		else
			date = new Date();
		return Math.floor(date.getTime() / 1000);
	};

	// --- PHP style functions from : http://phpjs.org/functions   ------------------------

	date.date = function (format, timestamp) {
		// http://kevin.vanzonneveld.net
		var that = this,
	  	jsdate,
	  	f,
	  	// Keep this here (works, but for code commented-out
	  	// below for file size reasons)
	  	//, tal= [],
	  	txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	  	// trailing backslash -> (dropped)
	  	// a backslash followed by any character (including backslash) -> the character
	  	// empty string -> empty string
	  	formatChr = /\\?(.?)/gi,
	  	formatChrCb = function (t, s) {
	  		return f[t] ? f[t]() : s;
	  	},
	  	_pad = function (n, c) {
	  		n = String(n);
	  		while (n.length < c) {
	  			n = '0' + n;
	  		}
	  		return n;
	  	};
	  f = {
	  	// Day
	  	d: function () { // Day of month w/leading 0; 01..31
	  		return _pad(f.j(), 2);
	  	},
	  	D: function () { // Shorthand day name; Mon...Sun
	  		return f.l().slice(0, 3);
	  	},
	  	j: function () { // Day of month; 1..31
	  		return jsdate.getDate();
	  	},
	  	l: function () { // Full day name; Monday...Sunday
	  		return txt_words[f.w()] + 'day';
	  	},
	  	N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
	  		return f.w() || 7;
	  	},
	  	S: function () { // Ordinal suffix for day of month; st, nd, rd, th
	  		var j = f.j(),
	  			i = j % 10;
	  		if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
	  			i = 0;
	  		}
	  		return ['st', 'nd', 'rd'][i - 1] || 'th';
	  	},
	  	w: function () { // Day of week; 0[Sun]..6[Sat]
	  		return jsdate.getDay();
	  	},
	  	z: function () { // Day of year; 0..365
	  		var a = new Date(f.Y(), f.n() - 1, f.j()),
	  			b = new Date(f.Y(), 0, 1);
	  		return Math.round((a - b) / 864e5);
	  	},

	  	// Week
	  	W: function () { // ISO-8601 week number
	  		var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
	  			b = new Date(a.getFullYear(), 0, 4);
	  		return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
	  	},

	  	// Month
	  	F: function () { // Full month name; January...December
	  		return txt_words[6 + f.n()];
	  	},
	  	m: function () { // Month w/leading 0; 01...12
	  		return _pad(f.n(), 2);
	  	},
	  	M: function () { // Shorthand month name; Jan...Dec
	  		return f.F().slice(0, 3);
	  	},
	  	n: function () { // Month; 1...12
	  		return jsdate.getMonth() + 1;
	  	},
	  	t: function () { // Days in month; 28...31
	  		return (new Date(f.Y(), f.n(), 0)).getDate();
	  	},

	  	// Year
	  	L: function () { // Is leap year?; 0 or 1
	  		var j = f.Y();
	  		return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
	  	},
	  	o: function () { // ISO-8601 year
	  		var n = f.n(),
	  			W = f.W(),
	  			Y = f.Y();
	  		return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
	  	},
	  	Y: function () { // Full year; e.g. 1980...2010
	  		return jsdate.getFullYear();
	  	},
	  	y: function () { // Last two digits of year; 00...99
	  		return f.Y().toString().slice(-2);
	  	},

	  	// Time
	  	a: function () { // am or pm
	  		return jsdate.getHours() > 11 ? "pm" : "am";
	  	},
	  	A: function () { // AM or PM
	  		return f.a().toUpperCase();
	  	},
	  	B: function () { // Swatch Internet time; 000..999
	  		var H = jsdate.getUTCHours() * 36e2,
	  			// Hours
	  			i = jsdate.getUTCMinutes() * 60,
	  			// Minutes
	  			s = jsdate.getUTCSeconds(); // Seconds
	  		return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
	  	},
	  	g: function () { // 12-Hours; 1..12
	  		return f.G() % 12 || 12;
	  	},
	  	G: function () { // 24-Hours; 0..23
	  		return jsdate.getHours();
	  	},
	  	h: function () { // 12-Hours w/leading 0; 01..12
	  		return _pad(f.g(), 2);
	  	},
	  	H: function () { // 24-Hours w/leading 0; 00..23
	  		return _pad(f.G(), 2);
	  	},
	  	i: function () { // Minutes w/leading 0; 00..59
	  		return _pad(jsdate.getMinutes(), 2);
	  	},
	  	s: function () { // Seconds w/leading 0; 00..59
	  		return _pad(jsdate.getSeconds(), 2);
	  	},
	  	u: function () { // Microseconds; 000000-999000
	  		return _pad(jsdate.getMilliseconds() * 1000, 6);
	  	},

	  	// Timezone
	  	e: function () { // Timezone identifier; e.g. Atlantic/Azores, ...
	  		// The following works, but requires inclusion of the very large
	  		// timezone_abbreviations_list() function.
	  		/*              return that.date_default_timezone_get();
	  		 */
	  		throw 'Not supported (see source code of date() for timezone on how to add support)';
	  	},
	  	I: function () { // DST observed?; 0 or 1
	  		// Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
	  		// If they are not equal, then DST is observed.
	  		var a = new Date(f.Y(), 0),
	  			// Jan 1
	  			c = Date.UTC(f.Y(), 0),
	  			// Jan 1 UTC
	  			b = new Date(f.Y(), 6),
	  			// Jul 1
	  			d = Date.UTC(f.Y(), 6); // Jul 1 UTC
	  		return ((a - c) !== (b - d)) ? 1 : 0;
	  	},
	  	O: function () { // Difference to GMT in hour format; e.g. +0200
	  		var tzo = jsdate.getTimezoneOffset(),
	  			a = Math.abs(tzo);
	  		return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
	  	},
	  	P: function () { // Difference to GMT w/colon; e.g. +02:00
	  		var O = f.O();
	  		return (O.substr(0, 3) + ":" + O.substr(3, 2));
	  	},
	  	T: function () { // Timezone abbreviation; e.g. EST, MDT, ...
	  		// The following works, but requires inclusion of the very
	  		// large timezone_abbreviations_list() function.
	  		return 'UTC';
	  	},
	  	Z: function () { // Timezone offset in seconds (-43200...50400)
	  		return -jsdate.getTimezoneOffset() * 60;
	  	},

	  	// Full Date/Time
	  	c: function () { // ISO-8601 date.
	  		return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
	  	},
	  	r: function () { // RFC 2822
	  		return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
	  	},
	  	U: function () { // Seconds since UNIX epoch
	  		return jsdate / 1000 | 0;
	  	}
	  };

	  this.date = function (format, timestamp) {
	  	that = this;
	  	jsdate = (timestamp === undefined ? new Date() : // Not provided
	  		(timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
	  		new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
	  	);
	  	return format.replace(formatChr, formatChrCb);
	  };
	  return this.date(format, timestamp);
	};

	date.format = date.date; // alias

	date.parse = function (date) {
		// http://kevin.vanzonneveld.net
		// +   original by: Brett Zamir (http://brett-zamir.me)
		// -    depends on: strtotime
		// *     example 1: date_parse('2006-12-12 10:00:00.5');
		// *     returns 1: {year : 2006, month: 12, day: 12, hour: 10, minute: 0, second: 0, fraction: 0.5, warning_count: 0, warnings: [], error_count: 0, errors: [], is_localtime: false}
		// BEGIN REDUNDANT
		this.php_js = this.php_js || {};
		// END REDUNDANT

		var warningsOffset = this.php_js.warnings ? this.php_js.warnings.length : null;
		var errorsOffset = this.php_js.errors ? this.php_js.errors.length : null;

		try {
			var ts = this.strtotime(date);
		} finally {
			if (!ts) {
				return false;
			}
		}

		var dt = new Date(ts * 1000);

		var retObj = { // Grab any new warnings or errors added (not implemented yet in strtotime()); throwing warnings, notices, or errors could also be easily monitored by using 'watch' on this.php_js.latestWarning, etc. and/or calling any defined error handlers
			warning_count: warningsOffset !== null ? this.php_js.warnings.slice(warningsOffset).length : 0,
			warnings: warningsOffset !== null ? this.php_js.warnings.slice(warningsOffset) : [],
			error_count: errorsOffset !== null ? this.php_js.errors.slice(errorsOffset).length : 0,
			errors: errorsOffset !== null ? this.php_js.errors.slice(errorsOffset) : []
		};
		retObj.year = dt.getFullYear();
		retObj.month = dt.getMonth() + 1;
		retObj.day = dt.getDate();
		retObj.hour = dt.getHours();
		retObj.minute = dt.getMinutes();
		retObj.second = dt.getSeconds();
		retObj.fraction = parseFloat('0.' + dt.getMilliseconds());
		retObj.is_localtime = dt.getTimezoneOffset !== 0;

		return retObj;
	};

	return date;
};