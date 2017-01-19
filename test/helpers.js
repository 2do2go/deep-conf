'use strict';

var expect = require('expect.js');
var helpers = require('../lib/helpers');

describe('helpers', function() {
	describe('.slice()', function() {
		it('with empty array', function() {
			var res = helpers.slice([], 10);
			expect(res).to.be.an('array');
			expect(res).to.be.empty();
		});

		it('with one arg', function() {
			var res = helpers.slice([1, 2, 3, 4, 5], 2);
			expect(res).to.be.an('array');
			expect(res).to.eql([3, 4, 5]);
		});

		it('with args range', function() {
			var res = helpers.slice([1, 2, 3, 4, 5], 2, 4);
			expect(res).to.be.an('array');
			expect(res).to.eql([3, 4]);
		});
	});

	describe('.has()', function() {
		it('with empty object', function() {
			expect(helpers.has({}, 'a')).to.not.be.ok();
		});

		it('with good object', function() {
			expect(helpers.has({a: 1}, 'a')).to.be.ok();
		});
	});

	describe('.isObject()', function() {
		it('with number arg', function() {
			expect(helpers.isObject(5)).to.not.be.ok();
		});

		it('with string arg', function() {
			expect(helpers.isObject('3')).to.not.be.ok();
		});

		it('with object arg', function() {
			expect(helpers.isObject({})).to.be.ok();
		});

		it('with array arg', function() {
			expect(helpers.isObject([])).to.be.ok();
		});

		it('with function arg', function() {
			expect(helpers.isObject(function() {})).to.be.ok();
		});

		it('with date arg', function() {
			expect(helpers.isObject(new Date())).to.be.ok();
		});

		it('with regexp arg', function() {
			expect(helpers.isObject(/./)).to.be.ok();
		});
	});

	describe('.isPlainObject()', function() {
		it('with number arg', function() {
			expect(helpers.isPlainObject(5)).to.not.be.ok();
		});

		it('with string arg', function() {
			expect(helpers.isPlainObject('3')).to.not.be.ok();
		});

		it('with object arg', function() {
			expect(helpers.isPlainObject({})).to.be.ok();
		});

		it('with array arg', function() {
			expect(helpers.isPlainObject([])).to.not.be.ok();
		});

		it('with function arg', function() {
			expect(helpers.isPlainObject(function() {})).to.not.be.ok();
		});

		it('with date arg', function() {
			expect(helpers.isPlainObject(new Date())).to.not.be.ok();
		});

		it('with regexp arg', function() {
			expect(helpers.isPlainObject(/./)).to.not.be.ok();
		});
	});

	describe('.isArray()', function() {
		it('with object arg', function() {
			expect(helpers.isArray({})).to.not.be.ok();
		});

		it('with function arg', function() {
			expect(helpers.isArray(function() {})).to.not.be.ok();
		});

		it('with string arg', function() {
			expect(helpers.isArray('3')).to.not.be.ok();
		});

		it('with number arg', function() {
			expect(helpers.isArray(5)).to.not.be.ok();
		});

		it('with date arg', function() {
			expect(helpers.isArray(new Date())).to.not.be.ok();
		});

		it('with regexp arg', function() {
			expect(helpers.isArray(/./)).to.not.be.ok();
		});

		it('with array arg', function() {
			expect(helpers.isArray([])).to.be.ok();
		});
	});

	describe('.isFunction()', function() {
		it('with object arg', function() {
			expect(helpers.isFunction({})).to.not.be.ok();
		});

		it('with array arg', function() {
			expect(helpers.isFunction([])).to.not.be.ok();
		});

		it('with string arg', function() {
			expect(helpers.isFunction('3')).to.not.be.ok();
		});

		it('with number arg', function() {
			expect(helpers.isFunction(5)).to.not.be.ok();
		});

		it('with date arg', function() {
			expect(helpers.isFunction(new Date())).to.not.be.ok();
		});

		it('with regexp arg', function() {
			expect(helpers.isFunction(/./)).to.not.be.ok();
		});

		it('with function arg', function() {
			expect(helpers.isFunction(function() {})).to.be.ok();
		});
	});

	describe('.isString()', function() {
		it('with object arg', function() {
			expect(helpers.isString({})).to.not.be.ok();
		});

		it('with array arg', function() {
			expect(helpers.isString([])).to.not.be.ok();
		});

		it('with function arg', function() {
			expect(helpers.isString(function() {})).to.not.be.ok();
		});

		it('with number arg', function() {
			expect(helpers.isString(5)).to.not.be.ok();
		});

		it('with date arg', function() {
			expect(helpers.isString(new Date())).to.not.be.ok();
		});

		it('with regexp arg', function() {
			expect(helpers.isString(/./)).to.not.be.ok();
		});

		it('with string arg', function() {
			expect(helpers.isString('3')).to.be.ok();
		});
	});

	describe('.isNumber()', function() {
		it('with object arg', function() {
			expect(helpers.isNumber({})).to.not.be.ok();
		});

		it('with array arg', function() {
			expect(helpers.isNumber([])).to.not.be.ok();
		});

		it('with function arg', function() {
			expect(helpers.isNumber(function() {})).to.not.be.ok();
		});

		it('with string arg', function() {
			expect(helpers.isNumber('3')).to.not.be.ok();
		});

		it('with date arg', function() {
			expect(helpers.isNumber(new Date())).to.not.be.ok();
		});

		it('with regexp arg', function() {
			expect(helpers.isNumber(/./)).to.not.be.ok();
		});

		it('with number arg', function() {
			expect(helpers.isNumber(5)).to.be.ok();
		});
	});

	describe('.isDate()', function() {
		it('with object arg', function() {
			expect(helpers.isDate({})).to.not.be.ok();
		});

		it('with array arg', function() {
			expect(helpers.isDate([])).to.not.be.ok();
		});

		it('with function arg', function() {
			expect(helpers.isDate(function() {})).to.not.be.ok();
		});

		it('with string arg', function() {
			expect(helpers.isDate('3')).to.not.be.ok();
		});

		it('with number arg', function() {
			expect(helpers.isDate(5)).to.not.be.ok();
		});

		it('with regexp arg', function() {
			expect(helpers.isDate(/./)).to.not.be.ok();
		});

		it('with date arg', function() {
			expect(helpers.isDate(new Date())).to.be.ok();
		});
	});

	describe('.isRegExp()', function() {
		it('with object arg', function() {
			expect(helpers.isRegExp({})).to.not.be.ok();
		});

		it('with array arg', function() {
			expect(helpers.isRegExp([])).to.not.be.ok();
		});

		it('with function arg', function() {
			expect(helpers.isRegExp(function() {})).to.not.be.ok();
		});

		it('with string arg', function() {
			expect(helpers.isRegExp('3')).to.not.be.ok();
		});

		it('with number arg', function() {
			expect(helpers.isRegExp(5)).to.not.be.ok();
		});

		it('with date arg', function() {
			expect(helpers.isRegExp(new Date())).to.not.be.ok();
		});

		it('with regexp arg', function() {
			expect(helpers.isRegExp(/./)).to.be.ok();
		});
	});

	describe('.each()', function() {
		it('with empty array arg', function() {
			var res = [];

			helpers.each([], function(item) {
				res.push(item);
			});

			expect(res).to.be.empty();
		});

		it('with array arg', function() {
			var res = [];

			helpers.each([1, 2, 3], function(item) {
				res.push(item);
			});

			expect(res).to.eql([1, 2, 3]);
		});

		it('with empty object arg', function() {
			var res = {};

			helpers.each({}, function(val, key) {
				res[key] = val;
			});

			expect(res).to.be.empty();
		});

		it('with object arg', function() {
			var res = {};

			helpers.each({a: 1, b: 'e', c: null}, function(val, key) {
				res[key] = val;
			});

			expect(res).to.eql({a: 1, b: 'e', c: null});
		});
	});
});
