# Laurel & Wolf JS SDK [![Build Status](https://img.shields.io/travis/laurelandwolf/sdk.svg?style=flat-square)](https://travis-ci.org/laurelandwolf/sdk)

JS SDK for Laurel & Wolf API

All requests and responses assume that the api strictly adheres to the [JSON API spec](http://jsonapi.org).

* [Usage](#usage)
* [API](#api)
	* [Overview](#overview)
		* [Interacting with resources](#interacting-with-resources)
		* [Resource response](#resource-response)
		* [Setting default values](#setting-default-values)
		* [Building requests](#building-requests)
	* [Resources](#resources)
* [Running Tests](#running-tests)

## Install

```
npm install lw-sdk --save
```

## Usage

```js
import sdk from 'lw-sdk';

// Set data used for all requests
let api = sdk({
	origin: 'https://api.somewhere.com',
	headers: {
		'michael': 'scarn'
	}
});

try {
	let res = await api()
		.getProjects()
		.include('schrute', 'schrute.farms')
		.fields({
			schrute: ['beets']
		});
		
	// Do something with res.body;
}
catch (err) {
	// Do somethign with err.body;
}

```

## API

### Overview

#### Interacting with resources

4 verbs are used to describe how you interact with a resource

* `get`
* `create`
* `update`
* `delete`

For example, for the resource **projects**, the following methods are available:

* `getProjects` - list of projects
* `getProject(:id)` - single project
* `createProject`
* `updateProjects`
* `deleteProject`

#### Resource response

Each method associated with a resource returns a promise. Any response with a status of less than `400` is considered a success and will resolve the promise. Any response with a status that is greater than or equal to 400 will reject the promise.

Both resolved and rejected responses return the status, body, headers, etc.

```js
let api = sdk();

api()
	.getProjects()
	.then(() => {/* status is less than 400 */})
	.catch(() => {/* status is greater than or equal to 400 */})
```

#### Setting default values

Default values make it easier to ensure that all requests are uniform and valid. Since the sdk uses the [fetch api](https://developers.google.com/web/updates/2015/03/introduction-to-fetch?hl=en) to make all requests, any options available to the fetch method are available when defining defaults.

There are 2 ways to set default values.

**For all requests**

```js
let api = sdk({
	headers: {
		some: 'default'
	}
});
```

**For a specific request**

```js
let api = sdk();

api({
	headers: {
		some: 'custom header'
	}
})
	.getProjects();
```

#### Building requests

All `get` requests have the following chainable helper-methods available for building the JSON API request:

* `include`
* `fields`
* `sort`

All `create` and `update` requests have the following chainable helper-methods available for build the JSON API requests:

* `relatedTo`

### Resources

#### `projects`

## Running Tests

All tests get run in PhantomJS locally

Clone and install deps

```
git clone git@github.com:laurelandwolf/sdk.git sdk && cd sdk
npm install
```

While writing new tests it is recommended that you start the test server for faster test runs

```
npm test
```

Once the test server is started, open the browser to the specified url to watch the tests run. a file watcher watches your src and test files and re-runs the tests on file save.


### CI Test Runner

For one-off test runs without starting the test server or for running tests on a ci box, use

```
npm run test-ci
```
