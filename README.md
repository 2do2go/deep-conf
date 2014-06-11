# Deep-conf

Configuration library for Node.js application server deployments.
It lets you define a set of configs with inheritance.

## Quick Start

Install it with NPM or add it to your package.json:

```js
$ npm install deep-conf
```

Then:

```js
// Create instance by factory
var configBuilder = require('deep-conf')();

// Register new config with name "sampleConfig"
configBuilder.register({
	name: 'sampleConfig',
	config: {
		host: 'localhost',
		port: 80,
		fullName: function(config) {
			return 'http://' + config.host + ':' + config.port;
		}
	}
});

// Get registered config by name
var config = configBuilder.get('sampleConfig');

console.log(config.host, config.port, config.fullName);
// localhost 80 http://localhost:80
```

## API

**register**: create new config with name and optional parent

```js
// Register new config with name "development"
configBuilder.register({
	name: 'development',
	config: {
		host: 'localhost',
		port: 80
	}
});

// Register new config with name "production",
// inherite it from "development"
// and replace field "host" with new value
configBuilder.register({
	name: 'production',
	parent: 'development',
	config: {
		host: 'example.com'
	}
});
```

**update**: update existing config

```js
// Update fields of existing config "development"
configBuilder.update({
	name: 'development',
	config: {
		protocol: 'https'
	}
});
```

**get**: get registered config

```js
// Get config "production"
var config = configBuilder.get('production');

console.log(config.host, config.port);
// example.com 80
```

**func**: define in config functional field

```js
// Register config with functional field
configBuilder.register({
	name: 'funcConfig',
	config: {
		f: configBuilder.func(function(a, b) {
			return a + b;
		})
	}
});

var config = configBuilder.get('funcConfig');

console.log(config.f(1, 2));
// 3
```

**stringify**: get registered config as string with optional space count (like JSON.stringify)

```js
// Register config "stringConfig"
configBuilder.register({
	name: 'stringConfig',
	config: {
		host: 'localhost',
		port: 80,
		fullName: function(config) {
			return 'http://' + config.host + ':' + config.port;
		},
		sum: configBuilder.func(function(a, b) {
			var sum = a + b;
			return sum;
		})
	}
});

// Stringify config "stringConfig"
var str = configBuilder.stringify('stringConfig', 2);

console.log(str);
// {
//   "host": "localhost",
//   "port": 80,
//   "fullName": "http://localhost:80",
//   "sum": function (a, b) {var sum = a + b;return sum;}
// }
```

**ConfigBuilder**: create instance with constructor

```js
var configBuilder = new (require('deep-conf').ConfigBuilder)();
```
