# upward-js

Reference implementation of the [UPWARD](../upward-spec) protocol in JavaScript. Runs as a standalone server or as an Express/Connect middleware.

## Installation

`npm install @magento/upward-js`

### Usage

Your UPWARD definition file drives the behavior of upward-js. Create that definition as a YAML file and save it in your project.

You can use `upward-js` from the command line, through the server API, or through the middleware API.

#### Command Line

The `upward-js-server` command will become globally available if you install globally: `npm install -g @magento/upward-js`.

The server takes no arguments; instead it is configured by environment variables. At minimum, the environment variable `UPWARD_JS_UPWARD_PATH` must be set to the path of your definition file, and `UPWARD_JS_BIND_LOCAL` must be set to 1.

The server launches in the foreground and if `UPWARD_JS_LOG_URL` is set to 1, it prints its bound URL to stdout.

```sh
$ UPWARD_JS_BIND_LOCAL=1 UPWARD_JS_UPWARD_PATH=./my-upward-server.yml upward-js-server
  https://0.0.0.0:23651
```

#### Server API

Import the server into your Node script.

```js

const { server } = require('@magento/upward-js');

const { app } = upward({
  upwardPath: './my-upward-server.yml'
})

app.listen(8000);
```

#### Middleware API

The middleware is compatible with Express 4, Connect, and other frameworks compatible with this common pattern. It returns a Promise for a function which handles request/response pairs.

```js

const express = require('express');
const { middleware } = require('@magento/upward-js');

const app = express();

app.use(otherMiddlewaresMaybe);

app.use(middleware('./my-upward-server.yml'));

```

Optionally, you may pass an `IOAdapter` as a second argument to the middleware.
