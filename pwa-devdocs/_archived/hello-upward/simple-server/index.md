---
title: Creating a simple server
---

This tutorial teaches the basics of reading and writing an UPWARD specification file by creating a simple web server that returns a "Hello World" string.

## Prerequisites

-   [Node][] >= 10.14.1
-   [Yarn][] (recommended) or [NPM][]

## Initial setup

1. Create the project directory and navigate into it:

    ```sh
    mkdir hello-upward && cd hello-upward
    ```

1. Use Yarn or NPM to initialize the project's `package.json` file:

    ```sh
    yarn init -y
    ```

    Running this command creates a `package.json` file in your current directory.
    The `package.json` file contains information about your project, such as name, version, dependencies, and runnable commands.

    The `-y` parameter is used in this tutorial to skip the interactive session.
    Omit this parameter if you want to fill out information about your project during initialization.

1. Install the `@magento/upward-js` and `express` packages:

    ```sh
    yarn add @magento/upward-js express
    ```

    The [`upward-js`][] package contains modules for deploying an UPWARD-compliant server.

    [Express][] is a web framework for Node.js.
    It is a dependency for the `upward-js` modules used in this tutorial.

## Create the initial UPWARD spec

An UPWARD server requires an [UPWARD specification][] file to tell it how to respond to requests.
Create a new file called `spec.yml` with the following content:

```yml
status: response.status
headers: response.headers
body: response.body

response:
    resolver: inline
    inline:
        status:
            resolver: inline
            inline: 200
        headers:
            resolver: inline
            inline:
                content-type:
                    resolver: inline
                    inline: 'text/string'
        body:
            resolver: inline
            inline: 'Hello World!'
```

The first three lines set the `status`, `headers`, and `body` values required for an UPWARD server response.
These values are set by traversing a decision tree defined in the specification file.

In this example, they are set to the `response.status`, `response.headers`, and `response.body` values defined in the `response` object.
These values are set using an UPWARD [InlineResolver][], which resolves the value of the `inline` property to a literal value.

When passed to an UPWARD server, this file instructs the server to respond with a `200 OK` status code, content of type `text/string`, and a value of `Hello World!` in the response body for every request.

## Create and run the server

Create a `server.js` file with logic for starting the Node implementation of an UPWARD server.

```js
const { createUpwardServer } = require('@magento/upward-js');

createUpwardServer({
    upwardPath: 'spec.yml',
    bindLocal: true,
    logUrl: true,
    port: 8080
});
```

This file imports the `createUpwardServer` module from the `@magento/upward-js` package and uses it to start a web server.

The script specifies the location of the UPWARD specification file through the `upwardPath` configuration and sets the port number of the server to `8080`.  
The `logUrl` configuration tells the script to display the URL of the server and `bindLocal` tells it to create and bind to local HTTP server.

Use `node` to run the server script:

```sh
node server.js
```

When the server starts, the URL for the server is displayed in the terminal.

```sh
> node server.js

http://0.0.0.0:8080/
```

Navigate to this URL in your browser to see the "Hello World!" message.

## Define a 404 response

When you browse to the server, every path request returns the same message.
To restrict this message to a specific path, use a ConditionalResolver.

Edit `spec.yml` and replace the InlineResolver content of the `response` object with a [ConditionalResolver][] to define which paths return "Hello World!".

```diff
status: response.status
headers: response.headers
body: response.body

response:
-   resolver: inline
-   inline:
-       status:
-           resolver: inline
-           inline: 200
-       headers:
-           resolver: inline
-           inline:
-               content-type:
-                   resolver: inline
-                   inline: 'text/string'
-       body:
-           resolver: inline
-           inline: 'Hello World!'
+   resolver: conditional
+   when:
+       - matches: request.url.pathname
+         pattern: '^/?$'
+         use: helloWorld
+       - matches: request.url.pathname
+         pattern: '^/hello-world/?$'
+         use: helloWorld
+   default: notFound
```

This code tells the server to look at the requested URL path and check to see if it matches the root or `/hello-world` path.
If it matches, the server uses an object called `helloWorld` to resolve the response.
For all other paths, the server resolves the response using the `notFound` object.

After the `response` object, define the following `helloWorld` and `notFound` objects in the `spec.yml` file:

```yml
helloWorld:
    inline:
        status:
            resolver: inline
            inline: 200
        headers:
            resolver: inline
            inline:
                content-type:
                    resolver: inline
                    inline: 'text/string'
        body:
            resolver: inline
            inline: 'Hello World!'

notFound:
    inline:
        status:
            resolver: inline
            inline: 404
        headers:
            resolver: inline
            inline:
                content-type:
                    resolver: inline
                    inline: 'text/string'
        body:
            resolver: inline
            inline: 'Page not found!'
```

Now, when you start the server and navigate to the application, only the root and `/hello-world` path return the "Hello World!" message.
All other paths return the `404` response.

Valid URLS:

* `http://0.0.0.0:8080/`
* `http://0.0.0.0:8080/hello-world`

Examples of invalid URLS:

* `http://0.0.0.0:8080/goodbye-world`
* `http://0.0.0.0:8080/something-else`

**Next:** [Rendering web pages using the TemplateResolver][]

[upward specification]: https://github.com/magento/pwa-studio/tree/main/packages/upward-spec
[node]: https://nodejs.org
[yarn]: https://yarnpkg.com/en/
[npm]: https://www.npmjs.com/get-npm
[express]: https://expressjs.com/

[`upward-js`]: {% link technologies/upward/reference-implementation/index.md %}
[Rendering web pages using the TemplateResolver]: {% link tutorials/hello-upward/using-template-resolver/index.md %}
[InlineResolver]: https://github.com/magento/pwa-studio/tree/develop/packages/upward-spec#inlineresolver
[ConditionalResolver]: https://github.com/magento/pwa-studio/tree/develop/packages/upward-spec#conditionalresolver
