'use strict';

var expect = require('expect.js');
var configBuilder = require('../lib');

describe('ConfigBuilder', function() {
	it('test exported singleton', function() {
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
});
