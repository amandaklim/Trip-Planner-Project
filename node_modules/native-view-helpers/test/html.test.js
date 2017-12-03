var assert = require("assert"),
	helper = require("../index")

describe('#html', function(){
	describe('el', function () {
		it('should use el', function() {
			assert.equal(helper.html.el('p'), '<p></p>')
		})
		it('should use el with attributes', function() {
			assert.equal(helper.html.el('p', { class: 'className', id: 'ID', 'data-id': 'dataid' }), '<p class="className" id="ID" data-id="dataid"></p>')
		})
		it('should use el with value and attributes', function() {
			assert.equal(
				helper.html.el('p', { class: 'className', id: 'ID', 'data-id': 'dataid', html: 'inner html' }), 
				'<p class="className" id="ID" data-id="dataid">inner html</p>')
		})
	})
	describe('charset', function () {
		it('should use meta charset with defaults (utf-8)', function() {
			assert.equal(helper.html.charset(), '<meta charset="utf-8" />')
		})
		it('should use meta charset with utf-8', function() {
			assert.equal(helper.html.charset('utf-8'), '<meta charset="utf-8" />')
		})
		it('should use meta charset with another', function() {
			assert.equal(helper.html.charset('iso-8859-2'), '<meta charset="iso-8859-2" />')
		})
	})
	describe('css (link href)', function () {
		it('should use default link href', function () {
			assert.equal(helper.html.css('style.css'), '<link href="style.css" rel="stylesheet" type="text/css" media="all" />')
		})
		it('should use for print', function () {
			assert.equal(helper.html.css('style.css', { media: 'print'}), '<link href="style.css" rel="stylesheet" type="text/css" media="print" />')
		})
	})
	describe('script source', function () {
		it('should use script', function () {
			assert.equal(helper.html.script('/app.js'), '<script src="/app.js" type="text/javascript"></script>')
		})
	})
	describe('a', function () {
		it('should use a', function () {
			assert.equal(helper.html.a('/url', 'url label'), '<a href="/url">url label</a>')
		})
		it('should use a with attributes', function () {
			assert.equal(helper.html.a('/url', 'url label', { class: 'link' }), '<a href="/url" class="link">url label</a>')
		})
	})
	describe('img', function () {
		it('should use img', function () {
			assert.equal(helper.html.img('/img.png', 'image label'), '<img src="/img.png" alt="image label" />')
		})
		it('should use img with attributes', function () {
			assert.equal(helper.html.img('/img.png', 'image label', { width: 100, height: 100 }), '<img src="/img.png" alt="image label" width="100" height="100" />')
		})
	})
	describe('imgText', function () {
		it('should use imgText', function () {
			assert.equal(helper.html.imgText('No Image'), '<img src="http://www.placehold.it/291x170/EFEFEF/AAAAAA&amp;text=No%20Image" />')	
		})
	})
	describe('refresh', function () {
		it('should use refresh', function () {
			assert.equal(helper.html.refresh('http://domain.com/'), '<meta http-equiv="refresh" content="5,URL=http://domain.com/" />')
			assert.equal(helper.html.refresh('http://domain.com/', 10), '<meta http-equiv="refresh" content="10,URL=http://domain.com/" />')
		})
	})
})