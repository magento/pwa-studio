---
title: Create a tag list extension
adobeio: /tutorials/extensions/taglist/
---

A tag list is a group of tags associated with a product.
This tutorial provides steps for creating and installing an extension that displays a tag list on the product details page in a Venia-based storefront.

## Prerequisites

Before you start this tutorial, make sure you have a storefront project set up using the steps outlined in the [Setup your project][] topic.
This is the storefront you will use to install your extension in this tutorial.

## Set up the extension project

Create a folder anywhere in your system and run Yarn's project creation script.
The script starts an interactive questionnaire that helps you fill out your project's `package.json` file.

```sh
mkdir tagList && \
cd tagList && \
yarn init
```

After answering the questions, the yarn CLI creates a `package.json` file that looks like the following:

```json
{
  "name": "tagList",
  "version": "1.0.0",
  "description": "A tag list extension for a PWA Studio storefront",
  "main": "index.js",
  "license": "MIT"
}
```

## Create TagList component files

The core purpose of this extension is to provide a React component that renders a list of tags.
Use the following command to create a directory and the files that define this component.

```sh
mkdir -p src/TagList && \
touch src/TagList/index.js && \
touch src/TagList/tag.js && \
touch src/TagList/tag.css && \
touch src/TagList/tagList.js && \
touch src/TagList/tagList.css
```

### `index.js`

Exporting modules from your component's `index.js` file is a common standard in a React project.
It lets another component import the tag list component using the `TagList` directory name.

```js
/* src/TagList/index.js */

export {default} from './tagList'
```

### `tag.js` and `tag.css`

The `tag.js` and `tag.css` files define a Tag component that renders a single tag in the tag list.

```jsx
/* src/TagList/tag.js */

import React from "react";
import Button from '@magento/venia-ui/lib/components/Button'
import { Link } from '@magento/venia-ui/lib/drivers';

import classes from './tag.css'

const categoryUrlSuffix = '.html'

// This is a component responsible for rendering a single tag
const Tag = (props) => {
  // Destructures the props object into variables
  const { value } = props;

  const { name, url_path } = value;
  const url = `/${url_path}${categoryUrlSuffix}`;

  const buttonClasses = {
        root_lowPriority: classes.root,
        content: classes.content
    }

  return (
    <Link className={classes.link} to={url}>
      <Button classes={buttonClasses} priority="low" type="button">
        {name}
      </Button>
    </Link>
  );
};

// Make this function the default exported of this module
export default Tag;
```

```css
/* src/TagList.tag.css */

.root {
    border: solid 1px #2680eb;
    padding: 3px 9px;
    margin: 5px;
    border-radius: 6px;
}

.content {
    color: #2680eb;
    font-size: 0.875rem;
}
```

### `tagList.js` and `tagList.css`

The `tagList.js` and `tagList.css` files define the main TagList component this package provides.
It accepts a `categoriesListData` object as a prop and renders the data as a tag list.

```jsx
/* src/TagList/tagList.js */

import React from "react";
import Tag from "./tag";

import classes from './tagList.css';

const TagList = (props) => {
  // Destructures the props object into variables
  const { categoriesListData } = props;

  const { categories } = categoriesListData;

  // Returns nothing if there are no categories
  if(!categories){
      return null;
  }

  // Converts the array of tag strings into an array of Tag components
  const tagList = categories.map((category) => {
    return <Tag key={category.name} value={category} />;
  });

  // Returns the list of Tag components inside a div container
  return <div className={classes.root}>{tagList}</div>;
};

export default TagList;
```

```css
/* src/TagList/tagList.css */

.root {
    display: flex;
    flex-wrap: wrap;
}
```

### Add TagList component dependencies

The TagList component requires third party libraries, such as React, to render the correct HTML.
Since your package is an extension, you should list these as peer dependencies in your `package.json` file.
This safeguards against including more than one copy of the same dependency in the storefront project and final build.

Use the following command to add the TagList component dependencies as peer dependencies:

```sh
yarn add --peer react @magento/venia-ui
```

This command creates a new `peerDependencies` entry in your `package.json` file that lists these dependencies.

```diff
  {
    "name": "tagList",
    "version": "1.0.0",
    "description": "A tag list extension for a PWA Studio storefront",
    "main": "index.js",
-   "license": "MIT"
+   "license": "MIT",
+   "peerDependencies": {
+     "@magento/venia-ui": "^6.0.1",
+     "react": "^17.0.1"
+   }
  }
```

### Export TagList in extension

Your extension needs to export the TagList component in your project's main entry point to let other developers import it in their code.
The default main entry point for Node packages is the `index.js` file, so create this file using the following command:

```sh
touch index.js
```

Edit the file and add the following content:

```js
export { default as TagList } from "./src/TagList";
```

Now, other developers can import the TagList component in their own projects using the following syntax:

```js
import {TagList} from 'tagList'
```

## Create data fetch hook

The TagList component requires data the [ProductDetailsFragment][] does not provide, so
you need to create a data fetch hook.
The data fetch hook is a custom React hook that sends a GraphQL query requesting the product categories for a product.

Run the following command to create this file:

```sh
mkdir -p src/hooks && \
touch src/hooks/useProductCategoriesList.js
```

Edit the file and add the following content:

```js
/* src/hooks/useProductCategoriesList.js */

import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

// GraphQL query to fetch a list of categories for a product
const GET_PRODUCT_CATEGORIES = gql`
  query getProductCategories($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        categories {
          name
          url_path
        }
      }
    }
  }
`;

const useProductCategoriesList = (props) => {
  const { urlKey } = props;

  const { error, loading, data } = useQuery(GET_PRODUCT_CATEGORIES, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    variables: {
      urlKey: urlKey
    }
  });

  const categories = useMemo(() => {
    if (data && data.products.items[0]) {
      return data.products.items[0].categories;
    }
    return null;
  }, [data]);

  return {
    error,
    isLoading: loading,
    categories
  };
};

export default useProductCategoriesList;
```

This file requires two new dependencies, `@apollo/client` and `graphql-tag`.
Run the following command to add these as peer dependencies to the `package.json` file:

```sh
yarn add --peer @apollo/client graphql-tag
```

## Create wrapper file

A wrapper file exports an interceptor that wraps a module in another file.
An interceptor module has access to the original module and the parameters it receives.
This lets the interceptor module run the original code along with its own custom logic that can change the incoming parameters or outgoing return value.

For this extension, create a wrapper file for the `useProductFullDetails()` hook that calls the data fetch hook you created in a previous step and adds the result to its return value.

First, create this file with the following command:

```sh
mkdir -p src/targets/ && \
touch src/targets/wrapper.js
```

Edit this file and add the following content:

```js
import useProductCategoriesList from "../hooks/useProductCategoriesList";

export default (original) => {
  return function useProductFullDetails(props, ...restArgs) {
    const { product } = props;

    // Run the data fetch hook
    const categoriesListData = useProductCategoriesList({
      urlKey: product.url_key,
    });

    // Run the original, wrapped function
    const { productDetails, ...defaultReturnData } = original(
      props,
      ...restArgs
    );

    // Add the new data to the data returned by the original function
    return {
      ...defaultReturnData,
      productDetails: {
        ...productDetails,
        categoriesListData: categoriesListData,
      },
    };
  };
};
```

## Define intercept file

The intercept file is where you directly interact with Target objects to apply customizations.
In this extension, the intercept file tells the build process to use Webpack loaders for ES Modules and CSS Modules.
Without these intructions, the build process will not know how to load the files in this extension.

Create this file using the following command:

```sh
touch src/targets/intercept.js
```

Edit this file and add the following content:

```js
module.exports = (targets) => {
    const { Targetables } = require('@magento/pwa-buildpack');

    const targetables = Targetables.using(targets);

    targetables.setSpecialFeatures('esModules','cssModules');
};
```

This script uses `@magento/pwa-buildpack`, so you need to add this library as a dependency.

```sh
yarn add --peer @magento/pwa-buildpack
```

Next, edit your `package.json` file to point to the location of this extension's intercept file:

```diff
  {
    "name": "tagList",
    "version": "1.0.0",
    "description": "A tag list extension for a PWA Studio storefront",
    "main": "index.js",
    "license": "MIT",
    "peerDependencies": {
      "@apollo/client": "^3.3.11",
      "@magento/pwa-buildpack": "^8.0.1",
      "@magento/venia-ui": "^6.0.1",
      "graphql-tag": "^2.11.0",
      "react": "^17.0.1"
+   },
+   "pwa-studio": {
+     "targets": {
+       "intercept": "src/targets/intercept"
+     }
    }
  }
```

## Install extension locally

Navigate to your storefront project directory and use the `yarn add file:/path/to/local/folder` syntax for the `yarn add` CLI to install your extension locally.

For example:

```sh
yarn add --dev file:../extensions/tagList
```

This adds a new entry under `devDependencies` in your storefront project's `package.json` file that looks like the following:

```diff
    "style-loader": "~0.23.1",
+   "tagList": "file:../extensions/tagList",
    "terser-webpack-plugin": "~1.2.3",
```

## Intercept Venia UI components

All scaffolded projects come with an intercept file called `local-intercept.js`.
This file lets you use [Targets and Targetables][] to make modifications to the Venia application code without copying over the source file.

Edit this file so it looks like the following:

```js
/* local-intercept.js */

// Import the Targetables manager
const { Targetables } = require('@magento/pwa-buildpack');

function localIntercept(targets) {
    // Create a bound Targetable factory
    const targetables = Targetables.using(targets);

    // Create a React component targetable linked to the productFullDetail.js file
    const ProductDetails = targetables.reactComponent(
        '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js'
    );

    // Add an import statement to the productFullDetail.js file and
    // return the SingleImportStatement object
    const TagList = ProductDetails.addImport("{TagList} from 'tagList'");

    // Insert the TagList component after the product description and pass in the
    // new categoriesListData object added to the useProductFullDetails() hook
    ProductDetails.insertAfterJSX(
        '<RichText content={productDetails.description} />',
        `<${TagList} categoriesListData={productDetails.categoriesListData} />`
    );

    // Create an ES Module targetable linked to the useProductFullDetail.js file
    const useProductFullDetails = targetables.esModule(
        '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail.js'
    );

    // Wrap the useProductFullDetail hook with your extension's wrapper file
    useProductFullDetails.wrapWithFile(
        'useProductFullDetail',
        'tagList/src/targets/wrapper'
    );
}

module.exports = localIntercept;
```

## Congratulations

You created a tag list extension and installed it in your development server!

Now, when you start your storefront application and navigate to a product page, you will see a list of tags associated with that product.

## Live example

You can see this extension running live in this [CodeSandbox instance][] or you can check out the source repository in the [`taglist-extension-tutorial`][] branch in the **magento-devdocs/pwa-studio-code-sandbox** GitHub project.

```html
<iframe src="https://codesandbox.io/embed/github/magento-devdocs/pwa-studio-code-sandbox/tree/taglist-extension-tutorial/?fontsize=12&hidenavigation=1&module=%2Fextensions%2FtagList%2Fpackage.json&moduleview=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dev-sandbox"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
```

[setup your project]: <{%link tutorials/pwa-studio-fundamentals/project-setup/index.md %}>
[targets and targetables]: <{%link pwa-buildpack/extensibility-framework/index.md %}>

[productdetailsfragment]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/talons/RootComponents/Product/productDetailFragment.gql.js
[`taglist-extension-tutorial`]: https://github.com/magento-devdocs/pwa-studio-code-sandbox/tree/taglist-extension-tutorial
[codesandbox instance]: https://codesandbox.io/s/github/magento-devdocs/pwa-studio-code-sandbox/tree/taglist-extension-tutorial/
