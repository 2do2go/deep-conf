'use strict';

var expect = require('expect.js');
var configBuilder = require('../lib')();

describe('ConfigBuilder', function() {
	it('simple config', function() {
		configBuilder.register({
			name: 'test',
			config: {
				a: 1,
				b: '12',
				c: null,
				d: function(config) {
					return 100500;
				}
			}
		});

		var config = configBuilder.get('test');

		expect(config).to.eql({
			a: 1,
			b: '12',
			c: null,
			d: 100500
		});
	});

	it('config inheritance', function() {
		configBuilder.register({
			name: 'parent',
			config: {
				a: 1,
				b: '12',
				c: null,
				d: function(config) {
					return 100500;
				}
			}
		});

		configBuilder.register({
			parent: 'parent',
			name: 'children',
			config: {
				a: 2,
				e: '22'
			}
		});

		var config = configBuilder.get('children');

		expect(config).to.eql({
			a: 2,
			b: '12',
			c: null,
			d: 100500,
			e: '22'
		});
	});

	it('function field', function() {
		configBuilder.register({
			name: 'funcConfig',
			config: {
				f: configBuilder.func(function(a, b, c) {
					return a + b + c;
				})
			}
		});

		var config = configBuilder.get('funcConfig');

		expect(config.f).to.be.a('function');

		var res = config.f(1, 2, 3);

		expect(res).to.be(6);
	});
});
