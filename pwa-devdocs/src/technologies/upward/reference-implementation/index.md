---
title: Reference Implementation
---

The [upward-js][] package is a reference implementation of the [UPWARD][] specification built using JavaScript.
This package is able to run as standalone server or as an Express/Connect middleware.

{: .bs-callout .bs-callout-info }
If you followed the instructions for [Setting up Venia][], it automatically sets up and uses this implementation as its application shell server.

## Installation

Use the following command to install upward-js in your project:

```sh
yarn add @magento/upward-js
```

## Usage

Use the command line, server API, or middleware API to launch the upward-js server.

### Command line

You can make this project available to the command line by installing it globally:

```sh
yarn global add @magento/upward-js
```

Launch the server in the foreground using the following command:

```sh
upward-js-server
```

This command does not take arguments.
Instead, it uses the following environment variables for configuration:

| Variable                | Required | Description                                 |
| ----------------------- | -------- | ------------------------------------------- |
| `UPWARD_JS_UPWARD_PATH` | Yes      | The path to the server definition file.     |
| `UPWARD_JS_BIND_LOCAL`  | Yes      | This must be set to 1.                      |
| `UPWARD_JS_LOG_URL`     | No       | Prints the bound URL to stdout if set to 1. |
{:style="table-layout:auto"}

### Server API

Require `server` from `@magento/upward-js` in your Node script to import the server into your project.

Example:

``` js
const { server } = require('@magento/upward-js');

const { app } = upward({
  upwardPath: './my-upward-server.yml'
})

app.listen(8000);
```

### Middleware API

Use `middleware` from `@magento/upward-js` to use the middleware into your project.
This middleware is compatible with Express 4, Connect, and other frameworks that use this common pattern.
It returns a Promise for a function which handles request/response pairs.

Example:

``` js
const express = require('express');
const { middleware } = require('@magento/upward-js');

const app = express();

app.use(otherMiddlewaresMaybe);

app.use(middleware('./my-upward-server.yml'));
```

You can also pass an `IOAdapter` as a second argument to the middleware.

[upward-js]: https://github.com/magento-research/pwa-studio/tree/master/packages/upward-js

[UPWARD]: {{site.baseurl}}{% link technologies/upward/index.md %}
[Setting up Venia]: {{site.baseurl}}{% link venia-pwa-concept/setup/index.md %}
