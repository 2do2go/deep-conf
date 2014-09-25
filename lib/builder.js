'use strict';

var util = require('util');
var helpers = require('./helpers');
var extend = require('./extend');

var exports = module.exports = ConfigBuilder;
exports.ConfigError = ConfigError;

function ConfigError(params) {
	// wrap params
	params = params || {};
	if (helpers.isString(params)) {
		params = {message: params};
	}

	// replace message
	if (params.message) {
		this.message = params.message;
	}

	// make good stack trace
	if (params instanceof Error && params.stack) {
		this.stack = params.stack.replace(/^Error/, this.name);
	} else {
		Error.captureStackTrace(this, ConfigError);
	}
}

util.inherits(ConfigError, Error);

ConfigError.prototype.name = 'ConfigError';
ConfigError.prototype.message = 'Some error happened';

function ConfigBuilder() {
	// here are stored configs with replaced dynamic fields
	this.configs = {};
}

/**
 * Register new config with specific name and config fields
 * and extend it from registered parent config if parent name is passed
 */

ConfigBuilder.prototype.register = function(params) {
	params = params || {};

	if (!params.name) {
		throw new ConfigError('Can\'t register config without name.');
	}

	if (this.configs[params.name]) {
		throw new ConfigError('Config with name "' + params.name +
			'" already exists.');
	}

	if (params.parent && !this.configs[params.parent]) {
		throw new ConfigError('Parent config with name "' + params.parent +
			'" does not exist.');
	}

	this.configs[params.name] = extend(
		{},
		params.parent ? this.configs[params.parent] : {},
		params.config || {}
	);
};

ConfigBuilder.prototype.update = function(params) {
	params = params || {};

	if (!this.configs[params.name]) {
		throw new ConfigError('Config with name "' + params.name +
			'" does not exist.');
	}

	extend(
		this.configs[params.name],
		params.config || {}
	);
};

/**
 * Return config by name or last registered config if no name passed
 */

ConfigBuilder.prototype.get = function(name) {
	name = name || this._lastName;

	if (!this.configs[name]) {
		throw new ConfigError('Config with name "' + name + '" does not exist.');
	}

	this._lastName = name;

	var config = extend({}, this.configs[name]);

	extendDynamicOptions(config, name);

	return config;
};

/**
 * Return config as string by name or last registered config if no name passed
 */

ConfigBuilder.prototype.stringify = function(name, space) {
	function stringify(obj) {
		var placeholder = '____PLACEHOLDER____';
		var indentRegExp = /(^\t+|\n)/mg;
		var fns = [];
		var json = JSON.stringify(obj, function(key, value) {
			if (helpers.isFunction(value)) {
				fns.push(value);
				return placeholder;
			}

			return value;
		}, space);

		json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function() {
			return fns.shift().toString().replace(indentRegExp, '');
		});

		return json;
	}

	return stringify(this.get(name));
};

/**
 * Return wrapped callback that should be a function field of config
 */

ConfigBuilder.prototype.func = function(callback) {
	if (!helpers.isFunction(callback)) {
		throw new ConfigError('Func callback must be a function');
	}

	return function() {
		return callback;
	};
};

/**
 * Recursively check every field of config and replace
 * every function member with the result of its evaluation.
 *
 * NOTE: Use ConfigBuilder func() method with a function argument that
 * should be a function, not result of its evaluation.
 */

function extendDynamicOptions(config, name) {
	function evaluateNode(node) {
		helpers.each(node, function(obj, key) {
			if (helpers.isFunction(obj)) {
				node[key] = obj(config, name);
			} else if (helpers.isObject(obj)) {
				evaluateNode(obj);
			}
		});
	}

	evaluateNode(config);
}
