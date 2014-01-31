'use strict';

var ConfigBuilder = require('./builder');
var ConfigError = ConfigBuilder.ConfigError;

var exports = module.exports = function() {
	return new ConfigBuilder();
};

exports.ConfigBuilder = ConfigBuilder;
exports.ConfigError = ConfigError;
