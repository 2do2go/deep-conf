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
var configBuilder = require('deep-conf');

configBuilder.register({
	name: 'sampleConfig',
	config: {
		host: 'localhost',
		port: 80
	}
});

var config = configBuilder.get('sampleConfig');

console.log(config.host, config.port);
// localhost 80
```

## API

**register**: create new config with name and optional parent

```js
configBuilder.register({
	name: 'development',
	config: {
		host: 'localhost',
		port: 80
	}
});

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
configBuilder.update({
	name: 'development',
	config: {
		protocol: 'https'
	}
});
```

**get**: get registered config

```js
var config = configBuilder.get('production');

console.log(config.host, config.port);
// example.com 80
```

**func**: define in config function field

```js
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