
module.exports = function(fn) {
	var qs		= require('querystring'),
        url     = require('url'),
		widgets	= {};

    widgets.i18nData = {
        shippingChooser: {
            en: {
                days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                empty: "-- choose the shipping date --",
                thisWeek: "This week",
                nextWeek: "Next week",
                later: "Later",
                today: "Today",        
                tomorrow: "Tomorrow",
                dateFormat: 'F j, Y'
            },
            hu: {
                days: ["Vasárnap", "Hétfő", "Kedd","Szerda","Csütörtök", "Péntek","Szombat"],
                empty: "-- szállítás időpontja --",
                thisWeek: "Ezen a héten",
                nextWeek: "Következő héten",
                later: "Késöbb",
                today: "Ma",
                tomorrow: "Holnap",
                dateFormat: 'Y.m.d'
            }
        }
    };

    widgets.getI18n = function (module, lang) {
        if (typeof widgets.i18nData[module] === 'undefined')
            return {};
        if ( typeof widgets.i18nData[module][lang] === 'undefined' )
            return widgets.i18nData[module].en;
        return widgets.i18nData[module][lang];
    };

	widgets.pagination = function(opt) {
        opt         = opt           || {};
        opt.count   = opt.count     || 0,
        opt.limit   = opt.limit     || 10,
        opt.page    = opt.page      || 1,
        opt.pages   = opt.pages     || ( Math.floor(opt.count / opt.limit) ) || 1,
        opt.range   = opt.range     || 6,
        opt.url     = opt.url       || '',
        opt.query   = opt.query     || 'page',
        opt.active  = opt.active    || 'active',
        opt.class   = opt.class     || 'pagination';

        var url     = fn.url(opt.url);
            half    = Math.floor(opt.range / 2),
            start   = ( opt.page - half > 0 ) ? ( opt.page - half ) : (1),
            end     = ( opt.page + half < opt.pages ) ? ( opt.page + half ) : ( opt.page + (opt.pages - opt.page) ),
            out     = '';

        if (opt.page > 1)
            out += '\t<li><a href="'+ url.setQs(opt.query, 1).getUrl() +'">«</a></li>\n';

        for (var i = start; i <= end; i++) {
            if (i < opt.page)
                out += '\t<li><a href="'+ url.setQs(opt.query, i).getUrl() +'">'+i+'</a></li>\n';
            if (i === opt.page)
                out += '\t<li class="'+ opt.active +'"><a href="'+ url.setQs(opt.query, i).getUrl() +'">'+ i +'</a></li>\n';
            if (i > opt.page)
                out += '\t<li><a href="'+ url.setQs(opt.query, i).getUrl() +'">'+i+'</a></li>\n';
        }

        if (opt.page < opt.pages)
            out += '\t<li><a href="'+ url.setQs(opt.query, opt.pages).getUrl() +'">»</a></li>\n';

        return '<ul class="'+ opt.class +'">\n'+ out + '</ul>\n';
    };

    widgets.nestedList = function (list, callback, params, lvl) {
        if (typeof callback !== 'function' ) {
            throw new Error('nested list missing tpl parameret.');
        }

        params          = params || {};
        params.ulClass  = params.ulClass || '';
        params.liClass  = params.liClass || '';
        lvl = lvl || 0;

        var out = '<ul class="'+ params.ulClass +'">\n';
        for (var i in list) {
            out += '\t<li>'+ callback(fn, list[i], lvl);
            if (list[i].children) {
                out += fn.widgets.nestedList(list[i].children, callback, params, lvl + 1);
            }
            out += '</li>\n';
        }
        return out + '</ul>\n';
    };

    // make shipping date chooser
    widgets.shippingChooser = function(name, opts) {
        opts            = opts || {};
        sunDay          = opts.sunDay || false;
        var labels      = widgets.getI18n('shippingChooser', opts.lang);
        var days        = labels.days;
        var date        = opts.date ? new Date(opts.date) : new Date();
        var oneDay      = 24*60*60*1000; // 1 day in millisecond
        var firstWeek   = true;

        var out = ['<select name="'+ name +'" id="frm_'+ name +'">\n'];
        out.push('\t<option value="">'+ labels.empty +'</option>\n');
        out.push('\t<optgroup label="'+ labels.thisWeek +'">\n');

        for (var i=0; i < 14; i++) {
            if (firstWeek && date.getDay() === 1 && i !== 0){
                out.push('\t</optgroup>\n\t<optgroup label="'+ labels.nextWeek +'">\n');
                firstWeek = false;
            } else if (!firstWeek && date.getDay() === 1){
                out.push('\t</optgroup>\n\t<optgroup label="'+ labels.later +'">\n');
            }
            // vasárnapot is belevegyük-e
            if (date.getDay() === 0 && !sunDay){
                date.setTime(date.getTime() + oneDay);
                continue;
            }

            out.push('\t\t<option value="'+ date.getTime()+'">');
            out.push(fn.date.format(labels.dateFormat, fn.date.time(date)) +' ');
            //out.push(date.getFullYear()+'.');
            //out.push(fn.date2Digit(date.getMonth()+1)+'.');
            //out.push(fn.date2Digit(date.getDate())+' ');
            out.push(days[date.getDay()]);

            if (i === 0)
                out.push(" ("+ labels.today +")");
            if (i === 1)
                out.push(" ("+ labels.tomorrow +")");

            out.push('</option>\n');
            date.setTime(date.getTime() + oneDay);
        }
        out.push('\t</optgroup>\n');
        out.push('</select>\n') ;
        return out.join('');
    };

	return widgets;
};