---
title: Adding React
---

This tutorial teaches you how to add webpack to your UPWARD project and use it to create a React application.

This tutorial builds on the project described in the previous [Using the TemplateResolver][] topic.

## Install dependencies

Add babel, webpack, and react dependencies to the project:

```sh
yarn add @babel/core @babel/preset-env babel-loader webpack webpack-cli @babel/preset-react react react-dom
```

In addition to installing React, this command installs [babel][] configurations and [webpack][].

In general, React components are written using ES6([ECMAScript 2015][]) and [JSX][] syntax for the convenience and ease of readability they provide.
Using [babel][] and [webpack][] is a common way to incorporate ES6 and JSX into a React project.

## Modify template

Modify the `hello-world.mst` template to replace the original message with a "root" DOM node for the React application:

{% raw %}

```diff
{{> templates/open-document}}

  <title>{{ title }}</title>

  {{> templates/open-body}}

-   <b>Hello Template World!</b>
+   <div id="root">Loading...</div>
+
+   <script defer src="/js/app.js"></script>

  {{> templates/close-document}}
```

{% endraw %}

This update renders a loading message in the root DOM and executes the `app.js` script after the browser parses the HTML document.

## Create webpack config

Create a `webpack.config.js` file to configure webpack behavior:

```js
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/hello-world.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};
```

This configuration file tells webpack to transpile all JavaScript files using babel and bundle `src/hello-world.js` with its dependencies into `dist/app.js`.

## Create babel config

Create a `.babelrc` file to configure babel:

```text
{
  "presets": ["@babel/preset-env","@babel/preset-react"]
}
```

This configuration file tells babel what presets to use during JavaScript transpilation.
The presets used in this example, `@babel/preset-env` and `@babel/preset-react`, are common React development presets.

## Create the React application

Create a `src` directory in your project's root directory and a `hello-world.js` file inside that directory with the following content:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render() {
        return <h1>Hello React World!</h1>;
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

This file defines an `App` React component that returns a "Hello React World!" message wrapped inside `h1` tags.
It uses the `ReactDOM` module to inject the content of the application into the "root" DOM element in the document.

## Make the application script publicly available

Edit the `spec.yml` file to add a new URL pattern to check in the ConditionalResolver and a new `appScript` object.

```diff
...

response:
    resolver: conditional
    when:
        - matches: request.url.pathname
          pattern: '^/?$'
          use: helloWorld
        - matches: request.url.pathname
          pattern: '^/hello-world/?$'
          use: helloWorld
+       - matches: request.url.pathname
+         pattern: '^/js/app.js'
+         use: appScript
    default: notFound

helloWorld:
...

notFound:
...

+ appScript:
+     inline:
+         status:
+             resolver: inline
+             inline: 200
+         headers:
+             resolver: inline
+             inline:
+                 content-type:
+                     resolver: inline
+                     inline: 'application/javascript'
+         body:
+             resolver: file
+             file:
+                 resolver: inline
+                 inline: './dist/app.js'
+             encoding:
+                 resolver: inline
+                 inline: 'utf-8'
```

This update uses a [FileResolver][] which instructs the UPWARD server to respond with the contents of `dist/app.js` when there is a request for the `js/app.js` path.

## Create the bundle and start the server

Create the `dist/app.js` bundle from `src/hello-world.js` and start the UPWARD server:

```sh
npx webpack && node server.js
```

When webpack bundles `src/hello-world.js` into `dist/app.js`, it includes its dependencies, such as React and ReactDOM.

When you navigate to the server, you will see the React application render the "Hello React World!" message using the App component.

[Using the TemplateResolver]: {%link tutorials/hello-upward/using-template-resolver/index.md %}

[ecmascript 2015]: http://www.ecma-international.org/ecma-262/6.0/index.html
[jsx]: https://reactjs.org/docs/introducing-jsx.html
[babel]: https://babeljs.io/
[webpack]: https://webpack.js.org/
[FileResolver]: https://github.com/magento/pwa-studio/tree/develop/packages/upward-spec#fileresolver
