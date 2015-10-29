'use strict';

var util = require('util');
var helpers = require('./helpers');
var extend = require('./extend');

var exports = module.exports = ConfigBuilder;
exports.ConfigError = ConfigError;

var regExpPlaceholder = '____REGEXP_PLACEHOLDER____';
var fnPlaceholder = '____FN_PLACEHOLDER____';
var indentRegExp = /(^\t+|\n)/mg;

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
	var name = params.name;

	if (!name) throw new ConfigError('Can\'t register config with empty name');

	if (name in this.configs) throw new ConfigError(
		'Config with name "' + name + '" already exists'
	);

	var parentName = params.parent;

	if (parentName && !(parentName in this.configs)) throw new ConfigError(
		'Parent config with name "' + parentName + '" does not exist'
	);

	var config = params.config || {};

	// add __info__ field to config
	config.__info__ = {
		name: name,
		parentName: parentName
	};

	this.configs[name] = extend(
		{},
		parentName ? this.configs[parentName] : {},
		config
	);
};

/**
 * Update config by name with new fields
 */

ConfigBuilder.prototype.update = function(params) {
	params = params || {};
	var name = params.name;

	if (!name) throw new ConfigError('Can\'t update config with empty name');

	if (!(name in this.configs)) throw new ConfigError(
		'Config with name "' + name + '" does not exist'
	);

	extend(this.configs[name], params.config || {});
};

/**
 * Return config by name
 */

ConfigBuilder.prototype.get = function(name) {
	if (!name) throw new ConfigError('Can\'t get config with empty name');

	if (!(name in this.configs)) throw new ConfigError(
		'Config with name "' + name + '" does not exist'
	);

	var config = extend({}, this.configs[name]);

	return this._extendDynamicOptions(config, name);
};

/**
 * Return config as string by name
 */

ConfigBuilder.prototype.stringify = function(name, space) {
	function stringify(obj) {
		var regExps = [];
		var fns = [];

		var json = JSON.stringify(obj, function(key, value) {
			if (helpers.isRegExp(value)) {
				regExps.push(value);
				return regExpPlaceholder;
			}

			if (helpers.isFunction(value)) {
				fns.push(value);
				return fnPlaceholder;
			}

			if (key === '__info__') {
				return undefined;
			}

			return value;
		}, space);

		if (regExps.length) {
			json = json.replace(
				new RegExp('"' + regExpPlaceholder + '"', 'g'), function() {
					var regExp = regExps.shift();
					var flags = '';
					if (regExp.global) flags += 'g';
					if (regExp.ignoreCase) flags += 'i';
					if (regExp.multiline) flags += 'm';
					return 'new RegExp("' + regExp.source + '", "' + flags + '")';
				}
			);
		}

		if (fns.length) {
			json = json.replace(new RegExp('"' + fnPlaceholder + '"', 'g'), function() {
				return fns.shift().toString().replace(indentRegExp, '');
			});
		}

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

ConfigBuilder.prototype._extendDynamicOptions = function(config, name) {
	var self = this;

	function evaluateNode(node) {
		helpers.each(node, function(obj, key) {
			if (helpers.isFunction(obj)) {
				node[key] = obj.call(self, config, name);
			} else if (helpers.isObject(obj)) {
				evaluateNode(obj);
			}
		});
	}

	evaluateNode(config);

	return config;
};
