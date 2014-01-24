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

	// make good stack trace
	if (params instanceof Error && params.stack) {
		this.stack = params.stack.replace(/^Error/, this.name);
	} else {
		Error.captureStackTrace(this, this);
	}

	// replace message
	if (params.message) {
		this.message = params.message;
	}
}

util.inherits(ConfigError, Error);

ConfigError.prototype.name = 'ConfigError';
ConfigError.prototype.message = 'Some error happened';

function ConfigBuilder() {
	// here are stored configs with replaced dynamic fields
	this.configs = {};
};

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

	extendDynamicOptions(config);

	return config;
};

/**
 * Return wrapped callback that should be a function field of config
 */

ConfigBuilder.prototype.func = function(callback) {
	if (!helpers.isFunction(callback)) {
		throw new ConfigError('Func callback must be a function');
	}

	return function(config) {
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

function extendDynamicOptions(config) {
	function evaluateNode(node) {
		helpers.each(node, function(obj, key) {
			if (helpers.isFunction(obj)) {
				node[key] = obj(config);
			} else if (helpers.isObject(obj)) {
				evaluateNode(obj);
			}
		});
	}

	evaluateNode(config);
}
