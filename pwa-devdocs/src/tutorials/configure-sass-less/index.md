---
title: Configure SASS or LESS
---

This tutorial provides the steps to configure SASS or LESS in your project.

With this configuration, you will be able to use these preprocessors with [CSS Modules][].

## Configuring SASS

### Step 1. Install dependencies

To configure SASS, you need to install these dev dependencies:

```sh
yarn add --dev sass-loader node-sass
```

### Step 2. Modify the Webpack configuration

Then edit the `webpack.config.js` and add a new rule to clientConfig

```diff

    clientConfig.plugins = [
        ...clientConfig.plugins,
        new DefinePlugin({
            /**
             * Make sure to add the same constants to
             * the globals object in jest.config.js.
             */
            UNION_AND_INTERFACE_TYPES: JSON.stringify(unionAndInterfaceTypes),
            STORE_NAME: JSON.stringify('Venia')
        }),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './template.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ];

+   clientConfig.module.rules.push({
+       test: /\.s[ca]ss$/,
+       use: [
+           'style-loader',
+           {
+               loader: 'css-loader',
+               options: {
+                   modules: true,
+                   sourceMap: true,
+                   localIdentName: '[name]-[local]-[hash:base64:3]'
+               }
+           },
+           'sass-loader'
+       ]
+   });
```

### Step 3. Create a SASS file and import it on your component

Now create/edit a component and import a SASS file like this:

```jsx
import React from 'react';
import defaultClasses from './myComponent.scss';

const MyComponent = () => (
    <div className={defaultClasses.root}>
        <button className={defaultClasses.button}>My Component</button>
    </div>
);

export default MyComponent;
```

And create the `myComponent.scss` file:

```scss
$button-color: #ff495b;
$button-color-hover: #ff9c1a;

.root {
    padding: 15px;
}

.button {
    color: $button-color;

    &:hover {
        color: $button-color-hover;
    }
}
```

## Configuring LESS

### Step 1. Install dependencies

To configure LESS, you need to install these dev dependencies:

```sh
yarn add --dev less-loader less
```

### Step 2. Modify the Webpack configuration

Then edit the `webpack.config.js` and add a new rule to clientConfig

```diff

    clientConfig.plugins = [
        ...clientConfig.plugins,
        new DefinePlugin({
            /**
             * Make sure to add the same constants to
             * the globals object in jest.config.js.
             */
            UNION_AND_INTERFACE_TYPES: JSON.stringify(unionAndInterfaceTypes),
            STORE_NAME: JSON.stringify('Venia')
        }),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './template.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ];

+   clientConfig.module.rules.push({
+       test: /\.less$/,
+       use: [
+           'style-loader',
+           {
+               loader: 'css-loader',
+               options: {
+                   modules: true,
+                   sourceMap: true,
+                   localIdentName: '[name]-[local]-[hash:base64:3]'
+               }
+           },
+           'less-loader'
+       ]
+   });
```

### Step 3. Create a LESS file and import it on your component

Now create/edit a component and import a LESS file like this:

```jsx
import React from 'react';
import defaultClasses from './myComponent.less';

const MyComponent = () => (
    <div className={defaultClasses.root}>
        <button className={defaultClasses.button}>My Component</button>
    </div>
);

export default MyComponent;
```

And create the `myComponent.less` file:

```less
@button-color: #ff495b;
@button-color-hover: #ff9c1a;

.root {
    padding: 15px;
}

.button {
    color: @button-color;

    &:hover {
        color: @button-color-hover;
    }
}

```

[CSS modules]: <{%link technologies/basic-concepts/css-modules/index.md %}>
