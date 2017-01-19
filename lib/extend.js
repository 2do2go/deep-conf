'use strict';

var helpers = require('./helpers');

module.exports = function extend(/*obj_1, [obj_2], [obj_N]*/) {
	var target = arguments[0];

	if (!target || !helpers.isObject(target)) {
		return false;
	}

	if (arguments.length < 2) return target;

	// convert arguments to array and cut off target object
	var objs = helpers.slice(arguments, 1);
	var src, clone;

	helpers.each(objs, function(obj) {
		if (!helpers.isObject(obj)) return;

		helpers.each(obj, function(val, key) {
			if (val === target || val === void 0) return;

			src = target[key];

			if (
				helpers.isPlainObject(src) &&
				helpers.isPlainObject(val)
			) {
				target[key] = extend(src, val);
			} else if (helpers.isPlainObject(val)) {
				target[key] = extend({}, val);
			} else if (helpers.isArray(val)) {
				target[key] = extend([], val);
			} else {
				target[key] = val;
			}
		});
	});

	return target;
};
