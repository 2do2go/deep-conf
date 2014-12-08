'use strict';

var expect = require('expect.js');
var ConfigError = require('../lib').ConfigError;
var configBuilder = require('../lib')();

describe('ConfigBuilder', function() {
	function assertException(message) {
		return function(err) {
			expect(err).to.be.a(ConfigError);
			expect(err.message).to.be(message);
		};
	}

	describe('.get()', function() {
		it('should throw error if name is not specified', function() {
			expect(function() {
				configBuilder.get('');
			}).to.throwException(
				assertException('Can\'t get config with empty name')
			);
		});

		it('should throw error if config does not exist', function() {
			expect(function() {
				configBuilder.get('wrong');
			}).to.throwException(
				assertException('Config with name "wrong" does not exist')
			);
		});
	});

	describe('.func()', function() {
		it('should throw error if argument is not a function', function() {
			expect(function() {
				configBuilder.func('f');
			}).to.throwException(
				assertException('Func callback must be a function')
			);

		});

		it('should be ok with function argument', function() {
			var f = configBuilder.func(function(a, b) {
				return a + b;
			});

			expect(f).to.be.a('function');
			expect(f()).to.be.a('function');
			expect(f()(1, 2)).to.be(3);
		});
	});

	describe('.register()', function() {
		it('should throw error if name is not specified in params',
			function() {
				expect(function() {
					configBuilder.register({name: ''});
				}).to.throwException(
					assertException('Can\'t register config with empty name')
				);
			}
		);

		it('should be ok without config in params', function() {
			configBuilder.register({
				name: 'empty'
			});

			var config = configBuilder.get('empty');

			expect(config).to.be.an('object');
			expect(config).to.eql({});
		});

		it('should be ok with simple config', function() {
			configBuilder.register({
				name: 'simple',
				config: {
					a: 1,
					b: '12',
					c: null,
					d: function() {
						return 100500;
					}
				}
			});

			var config = configBuilder.get('simple');

			expect(config).to.be.an('object');
			expect(config.a).to.be(1);
			expect(config.b).to.be('12');
			expect(config.c).to.be(null);
			expect(config.d).to.be(100500);
		});

		it('should throw error if config already exists',
			function() {
				expect(function() {
					configBuilder.register({name: 'simple'});
				}).to.throwException(
					assertException('Config with name "simple" already exists')
				);
			}
		);

		it('should throw error if parent config does not exist',
			function() {
				expect(function() {
					configBuilder.register({
						name: 'children',
						parent: 'parent'
					});
				}).to.throwException(
					assertException('Parent config with name "parent" does not exist')
				);
			}
		);

		it('should be ok with configs inheritance', function() {
			configBuilder.register({
				name: 'parent',
				config: {
					a: 1,
					b: '12',
					c: null,
					d: function() {
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

			expect(config).to.be.an('object');
			expect(config.a).to.be(2);
			expect(config.b).to.be('12');
			expect(config.c).to.be(null);
			expect(config.d).to.be(100500);
			expect(config.e).to.be('22');
		});

		it('should be ok with function field', function() {
			configBuilder.register({
				name: 'function',
				config: {
					f: configBuilder.func(function(a, b, c) {
						return a + b + c;
					})
				}
			});

			var config = configBuilder.get('function');

			expect(config).to.be.an('object');
			expect(config.f).to.be.a('function');
			expect(config.f(1, 2, 3)).to.be(6);
		});
	});

	describe('.update()', function() {
		it('should throw error if name is not specified', function() {
			expect(function() {
				configBuilder.update({name: ''});
			}).to.throwException(
				assertException('Can\'t update config with empty name')
			);
		});

		it('should throw error if config does not exist', function() {
			expect(function() {
				configBuilder.update({name: 'wrong'});
			}).to.throwException(
				assertException('Config with name "wrong" does not exist')
			);
		});

		it('should change config fields', function() {
			configBuilder.register({
				name: 'update',
				config: {
					a: 1
				}
			});

			var config = configBuilder.get('update');

			expect(config).to.be.an('object');
			expect(config.a).to.be(1);

			configBuilder.update({
				name: 'update',
				config: {
					a: 5
				}
			});

			config = configBuilder.get('update');

			expect(config).to.be.an('object');
			expect(config.a).to.be(5);
		});
	});

	describe('.stringify()', function() {
		it('should return config as string', function() {
			configBuilder.register({
				name: 'stringifyConfig',
				config: {
					a: 1,
					b: false,
					c: 'test',
					d: function(config) {
						return config.a;
					},
					f: configBuilder.func(function(a, b, c) {
						var k = a + b + c;
						return k;
					})
				}
			});

			var str = configBuilder.stringify('stringifyConfig');

			expect(str).to.be('{"a":1,"b":false,"c":"test","d":1,"f":' +
				'function (a, b, c) {var k = a + b + c;return k;}}');

			str = configBuilder.stringify('stringifyConfig', 2);

			expect(str).to.be('{\n  "a": 1,\n  "b": false,\n  "c": "test",\n  "d": 1,' +
				'\n  "f": function (a, b, c) {var k = a + b + c;return k;}\n}');
		});
	});
});
