# Laurel and Wolf SDK

SDK for Laurel and Wolf API

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

async function allProjects () {

	try {
		let res = await api().getProjects();
		// Do something with res.body;
	}
	catch (err) {
		// Do somethign with err.body;
	}
}

```

## API

### Overview

(Soon)

### Methods

(Soon)

## Run Tests

All tests get run in PhantomJS locally

```
git clone git@github.com:laurelandwolf/sdk.git sdk && cd sdk
npm install
npm test
```
