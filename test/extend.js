'use strict';

var expect = require('expect.js');
var extend = require('../lib/extend');

describe('.extend()', function() {
	it('without args', function() {
		var result = extend();

		expect(result).to.be.an('boolean');
		expect(result).to.not.be.ok();
	});

	it('with empty target only arg', function() {
		var target = {};

		var result = extend(target);

		expect(target).to.be.empty();

		expect(result).to.be.an('object');
		expect(result).to.be.empty();
	});

	it('with empty target and one complex parent args', function() {
		var target = {};

		var obj = {
			a: 1,
			b: '3333',
			c: true,
			d: null,
			e: new Date(),
			f: /./,
			g: {
				a: 1,
				v: {
					h: 4
				}
			},
			h: [1, 2, 3],
			i: function() {}
		};

		extend(target, obj);

		expect(target).to.be.an('object');
		expect(target).to.not.be.empty();
		expect(target.a).to.be(1);
		expect(target.b).to.be('3333');
		expect(target.c).to.be(true);
		expect(target.d).to.be(null);
		expect(target.e).to.be.a(Date);
		expect(target.f).to.be.a(RegExp);
		expect(target.g).to.be.an('object');
		expect(target.g).to.eql({
			a: 1,
			v: {
				h: 4
			}
		});
		expect(target.h).to.eql([1, 2, 3]);
		expect(target.i).to.be.a('function');
	});

	it('with target and one complex parent args', function() {
		var target = {
			a: 5,
			g: {
				a: 100500,
				ab: '123'
			},
			h: [1]
		};

		var obj = {
			a: 1,
			b: '3333',
			c: true,
			d: null,
			e: new Date(),
			f: /./,
			g: {
				a: 1,
				v: {
					h: 4
				}
			},
			h: [1, 2, 3],
			i: function() {}
		};

		extend(target, obj);

		expect(target).to.be.an('object');
		expect(target).to.not.be.empty();
		expect(target.a).to.be(1);
		expect(target.b).to.be('3333');
		expect(target.c).to.be(true);
		expect(target.d).to.be(null);
		expect(target.e).to.be.a(Date);
		expect(target.f).to.be.a(RegExp);
		expect(target.g).to.be.an('object');
		expect(target.g).to.eql({
			a: 1,
			ab: '123',
			v: {
				h: 4
			}
		});
		expect(target.h).to.eql([1, 2, 3]);
		expect(target.i).to.be.a('function');
	});

	it('with target and many complex parent args', function() {
		var target = {
			a: 5,
			g: {
				a: 100500,
				ab: '123'
			},
			h: {
				a: 2
			},
			j: [1, 2]
		};

		var obj1 = {
			a: 1,
			b: '3333',
			c: true,
			d: null,
			e: 'rss',
			h: [5, 4, 6, 7, 2]
		};

		var obj2 = {
			e: new Date(),
			f: /./,
			g: {
				a: 1,
				v: {
					h: 4
				}
			},
			h: [1, 2, 3],
			i: function() {},
			j: {
				h: [1, 2]
			}
		};

		var obj3 = {
			j: {
				h: {
					k: {
						a: 1,
						t: [1, 2, 3]
					}
				}
			}
		};

		var obj4 = {
			j: {
				h: {
					k: {
						a: 1,
						t: [100, 191],
						p: '11'
					}
				}
			}
		};

		extend(target, obj1, obj2, obj3, obj4);

		expect(target).to.be.an('object');
		expect(target).to.not.be.empty();
		expect(target.a).to.be(1);
		expect(target.b).to.be('3333');
		expect(target.c).to.be(true);
		expect(target.d).to.be(null);
		expect(target.e).to.be.a(Date);
		expect(target.f).to.be.a(RegExp);
		expect(target.g).to.be.an('object');
		expect(target.g).to.eql({
			a: 1,
			ab: '123',
			v: {
				h: 4
			}
		});
		expect(target.h).to.eql([1, 2, 3]);
		expect(target.i).to.be.a('function');
		expect(target.j).to.be.an('object');
		expect(target.j).to.eql({
			h: {
				k: {
					a: 1,
					t: [100, 191],
					p: '11'
				}
			}
		});
	});
});
