'use strict';

var ConfigBuilder = require('./builder');
var ConfigError = ConfigBuilder.ConfigError;

var exports = module.exports = new ConfigBuilder();

exports.ConfigBuilder = ConfigBuilder;
exports.ConfigError = ConfigError;
