var assert = require("assert"),
	helper = require("../index")

describe('#default', function(){
	describe('escape', function () {
		it('should escape <script>', function(){
			assert.equal(helper.e('<script>'), '&#60;script&#62;')
		})
	})

	describe('Object To Attributes', function () {
		it('should convert', function() {
			assert.equal(helper.toAttr({ type: "text", value: "value"}), ' type="text" value="value"')
		})
		it('should use html5 data', function() {
			assert.equal(helper.toAttr({ 'data-id': 1, 'data-src': 'src'}), ' data-id="1" data-src="src"')
		})
	})

	describe('Merge Objects', function () {
		it('should marge', function(){
			var obj1 = { name: 'Name', user: 'u'}
			var obj2 = { age: 20, user: 'w'}
			var merged = helper.mergeObject(obj1, obj2)

			assert.equal(merged.name, 'Name')
			assert.equal(merged.age, 20)
			assert.equal(merged.user, 'w')
		})
		it('should marge nested', function(){
			var obj1 = { name: { first : 'First'} }
			var obj2 = { name: { last: 'Last' } }
			var merged = helper.mergeObject(obj1, obj2)

			assert.equal(merged.name.first, 'First')
			assert.equal(merged.name.last, 'Last')
		})
		it('should marge deep', function(){
			var obj1 = { age: 20 }
			var obj2 = { name: { first: 'First', last: 'Last' } }
			var merged = helper.mergeObject(obj1, obj2)

			assert.equal(merged.name.first, 'First')
			assert.equal(merged.name.last, 'Last')
			assert.equal(merged.age, 20)
		})
	})

	describe('number format', function () {
		it('should 10,000', function () {
			assert.equal(helper.numberFormat(10000), '10,000')
		})
		it('should 10,000,000', function () {
			assert.equal(helper.numberFormat(10000000), '10,000,000')
		})
		it('should 10 000 000 with space separator', function () {
			assert.equal(helper.numberFormat(10000000, { sep: ' '}), '10 000 000')
		})
		it('should 10,000.10 with 2 decimals', function () {
			assert.equal(helper.numberFormat(10000.10, { decimals: 2}), '10,000.10')
		})
	})

	describe('string', function () {
		it('should nl2br', function () {
			assert.equal(helper.nl2br('\r\n'), '<br />\r\n')
			assert.equal(helper.nl2br('\n\r'), '<br />\n\r')
			assert.equal(helper.nl2br('\r'), '<br />\r')
			assert.equal(helper.nl2br('\n'), '<br />\n')
		})
		it('should repeat', function () {
			assert.equal(helper.repeat('-', 5), '-----')
		})
		it('sholud string tags', function () {
			assert.equal(helper.strip_tags('<p>text <a href="url">link</a></p>', '<p>'), '<p>text link</p>')
			assert.equal(helper.strip_tags('<p>text <a href="url">link</a></p>'), 'text link')
		})
		it('should use html special chars', function () {
			assert.equal(helper.htmlspecialchars('<a href="link">label</a>', 'ENT_QUOTES'), '&lt;a href=&quot;link&quot;&gt;label&lt;/a&gt;')
		})
		it('should first char upper case', function () {
			assert.equal(helper.ucFirst('first case upper'), 'First case upper')
		})
		it('should count chars', function () {
			assert.equal(helper.countChars(/\-/g, '1-2 - 3-4'), 3)
		})
	})

	describe('url', function () {
		var url = helper.url('http://localhost/index?filter=name')
		it('should parse url', function () {
			assert.equal(url.getUrl(), 'http://localhost/index?filter=name')
			assert.equal(url.setQs('filter','age').getUrl(), 'http://localhost/index?filter=age')
			assert.equal(url.setQs('p',2).getUrl(), 'http://localhost/index?filter=age&p=2')
		})
	})

	describe('path', function () {
		var obj = {}
		it('should set path', function () {
			//helper.path.set('name', {})
			//assert.equal(obj.name, {})
			//helper.path.set('name.first', 'first name', obj)
			//assert.equal(obj.name.first, 'first name')
		})
	})
})