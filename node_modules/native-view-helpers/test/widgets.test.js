var assert = require("assert"),
	helper = require("../index")

describe('#widgets', function() {
	describe('pagination', function () {
		it('should pagination', function () {
			assert.equal(helper.widgets.pagination({page: 1, pages: 5 }),
				'<ul class="pagination">\n'+
				'\t<li class="active"><a href="?page=1">1</a></li>\n' +
				'\t<li><a href="?page=2">2</a></li>\n' +
				'\t<li><a href="?page=3">3</a></li>\n' +
				'\t<li><a href="?page=4">4</a></li>\n' +
				'\t<li><a href="?page=5">»</a></li>\n' +
				'</ul>\n'
			)	
		})

		it('should pagination', function () {
			assert.equal(helper.widgets.pagination({page: 3, pages: 5 }),
				'<ul class="pagination">\n'+
				'\t<li><a href="?page=1">«</a></li>\n' +
				'\t<li><a href="?page=1">1</a></li>\n' +
				'\t<li><a href="?page=2">2</a></li>\n' +
				'\t<li class="active"><a href="?page=3">3</a></li>\n' +
				'\t<li><a href="?page=4">4</a></li>\n' +
				'\t<li><a href="?page=5">5</a></li>\n' +
				'\t<li><a href="?page=5">»</a></li>\n' +
				'</ul>\n'
			)	
		})

		it('should pagination with custom arguments', function () {
			assert.equal(helper.widgets.pagination({page: 1, count: 101, limit: 10 }),
				'<ul class="pagination">\n'+
				'\t<li class="active"><a href="?page=1">1</a></li>\n' +
				'\t<li><a href="?page=2">2</a></li>\n' +
				'\t<li><a href="?page=3">3</a></li>\n' +
				'\t<li><a href="?page=4">4</a></li>\n' +
				'\t<li><a href="?page=10">»</a></li>\n' +
				'</ul>\n'
			)	
		})

		it('should pagination with custom arguments', function () {
			assert.equal(helper.widgets.pagination({page: 1, pages: 10, url: 'http://localhost/index.php?filter=name' }),
				'<ul class="pagination">\n'+
				'\t<li class="active"><a href="http://localhost/index.php?filter=name&page=1">1</a></li>\n' +
				'\t<li><a href="http://localhost/index.php?filter=name&page=2">2</a></li>\n' +
				'\t<li><a href="http://localhost/index.php?filter=name&page=3">3</a></li>\n' +
				'\t<li><a href="http://localhost/index.php?filter=name&page=4">4</a></li>\n' +
				'\t<li><a href="http://localhost/index.php?filter=name&page=10">»</a></li>\n' +
				'</ul>\n'
			)	
		})

		it('should pagination with custom arguments', function () {
			assert.equal(helper.widgets.pagination({page: 1, count: 101, limit: 10, query: 'p' }),
				'<ul class="pagination">\n'+
				'\t<li class="active"><a href="?p=1">1</a></li>\n' +
				'\t<li><a href="?p=2">2</a></li>\n' +
				'\t<li><a href="?p=3">3</a></li>\n' +
				'\t<li><a href="?p=4">4</a></li>\n' +
				'\t<li><a href="?p=10">»</a></li>\n' +
				'</ul>\n'
			)	
		})
	})

	describe('nestedList', function () {
		var list = [{ 
			id: 1, 
			name: 'Main', 
			children: [
				{ id: 2, name: 'Sub 1' },
				{ id: 3, name: 'Sub 2', children: [
					{ id: 4, name: 'Sub 2.1' }
				] },
			]
		}];

		it('should use nestedList', function () {
			var result = helper.widgets.nestedList(list, function(fn, el, lvl) { return el.id +':'+el.name; })
			assert.equal(result,
				'<ul class="">\n'+
				'\t<li>1:Main<ul class="">\n'+
					'\t<li>2:Sub 1</li>\n'+
					'\t<li>3:Sub 2<ul class="">\n'+
						'\t<li>4:Sub 2.1</li>\n'+
					'</ul>\n'+
					'</li>\n'+
				'</ul>\n'+
				'</li>\n'+
				'</ul>\n'
			)
		})
	})

	describe('shippingChooser', function () {
		it('should use shippingChooser', function () {
			var date = new Date('2013-08-22 00:00')
			var day = 24*60*60*1000;
			assert.equal(helper.widgets.shippingChooser('name', { date: date }), 
				'<select name="name" id="frm_name">\n' +
				'\t<option value="">-- choose the shipping date --</option>\n'+
				'\t<optgroup label="This week">\n'+
				'\t\t<option value="'+ date.getTime() +'">August 22, 2013 Thursday (Today)</option>\n'+
				'\t\t<option value="'+ (date.getTime()+ day) +'">August 23, 2013 Friday (Tomorrow)</option>\n'+
				'\t\t<option value="'+ (date.getTime()+ 2*day) +'">August 24, 2013 Saturday</option>\n'+
				'\t</optgroup>\n'+
				'\t<optgroup label="Next week">\n'+
				'\t\t<option value="'+ (date.getTime()+ 4*day) +'">August 26, 2013 Monday</option>\n'+
				'\t\t<option value="'+ (date.getTime()+ 5*day) +'">August 27, 2013 Tuesday</option>\n'+
				'\t\t<option value="'+ (date.getTime()+ 6*day) +'">August 28, 2013 Wednesday</option>\n'+
				'\t\t<option value="'+ (date.getTime()+ 7*day) +'">August 29, 2013 Thursday</option>\n'+
				'\t\t<option value="'+ (date.getTime()+ 8*day) +'">August 30, 2013 Friday</option>\n'+
				'\t\t<option value="'+ (date.getTime()+ 9*day) +'">August 31, 2013 Saturday</option>\n'+
				'\t</optgroup>\n'+
				'\t<optgroup label="Later">\n'+
				'\t\t<option value="'+ (date.getTime()+ 11*day) +'">September 2, 2013 Monday</option>\n'+
				'\t\t<option value="'+ (date.getTime()+ 12*day) +'">September 3, 2013 Tuesday</option>\n'+
				'\t\t<option value="'+ (date.getTime()+ 13*day) +'">September 4, 2013 Wednesday</option>\n'+
				'\t</optgroup>\n'+
				'</select>\n'
			)
		})
	})
})
