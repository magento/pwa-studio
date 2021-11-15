---
title: Modify talon results
adobeio: /tutorials/targets/modify-talon-results/
---

In core Magento development:

> A plugin, or interceptor, is a class that modifies the behavior of public class functions by intercepting a function call and running code before, after, or around that function call.
> This allows you to substitute or extend the behavior of original, public methods for any class or interface.

See: [Plugins (Interceptors)][]

PWA Studio's extensibility framework provides a similar feature that allows you to intercept a talon call and surround it with custom logic.
This is useful if you want to add tracking logic or alter the incoming or outgoing values for a talon.

This tutorial teaches you how to create an extension that intercepts a talon and changes the results.

## Tasks overview

1. Initialize the project
2. Create and register an intercept file
3. Define the intercept file
4. Make a data fetch hook
5. Create the talon wrapper module
6. Update the package entry point
7. Test on a local instance

## Initialize the project

To intercept and wrap a talon, you need a PWA Studio extension.
Use [`npm init`][] or [`yarn init`][] to create a new JavaScript package project for this tutorial.

{: .bs-callout .bs-callout-info}
**Note:** This is a standalone project.
You do not need to create this inside a storefront project.

Edit the `packages.json` file so it looks like the following:

```json
{
  "name": "my-extension",
  "version": "0.0.1",
  "description": "A PWA Studio extension",
  "publishConfig": {
    "access": "public"
  },
  "main": "index.js",
  "license": "(OSL-3.0 OR AFL-3.0)",
  "repository": "",
  "dependencies": {},
  "peerDependencies": {
    "@magento/peregrine": "~7.0.0",
    "@magento/pwa-buildpack": "~6.0.0",
    "@magento/venia-ui": "~4.0.0",
    "@apollo/client": "~3.1.2",
    "graphql-tag": "~2.10.1",
    "react": "~17.0.1",
    "webpack": "~4.38.0"
  },
}
```

## Create and register the intercept file

You can create the intercept file anywhere in your project.
For this tutorial, create this file under `src/targets`.

```sh
mkdir -p src/targets && touch src/targets/my-intercept.js
```

Set the value for `pwa-studio.targets.intercept` in your project's `package.json` file to tell the build process where to find the intercept file.

```diff
    "react": "~17.0.1",
    "webpack": "~4.38.0"
  },
+ "pwa-studio": {
+   "targets": {
+     "intercept": "src/targets/my-intercept"
+   }
+ }
}
```

## Define the intercept file

The intercept file is where you tap into PWA Studio's extensibility framework and add your modifications.

In your intercept file, add the following content:

```js
module.exports = (targets) => {
  // Wrap the useProductFullDetail talon with this extension
  const peregrineTargets = targets.of("@magento/peregrine");
  const talonsTarget = peregrineTargets.talons;

  talonsTarget.tap((talonWrapperConfig) => {
    talonWrapperConfig.ProductFullDetail.useProductFullDetail.wrapWith(
      "my-extension"
    );
  });

  // Set the buildpack features required by this extension
  const builtins = targets.of("@magento/pwa-buildpack");
  builtins.specialFeatures.tap((featuresByModule) => {
    featuresByModule["@my-extension/my-product-page"] = {
      // Wrapper modules must be ES Modules
      esModules: true,
    };
  });
};
```

When this file runs, it taps into the `talonsTarget` from the available targets in `@magento/peregrine` and wraps the `useProductFullDetail()` function call with your extension.

Since talon wrappers must be ES modules, this file also taps into the `specialFeatures` target from `@magento/pwa-buildpack` to set the `esModules` flag to `true`.

## Make a data fetch hook

Create a data fetch hook to query the backend for more data.

```sh
mkdir -p src/hooks && touch src/hooks/useProductCategoriesList.js
```

Inside the `useProductCategoriesList.js` file, add the following content:

```js
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

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

This code defines a GraphQL query that fetches a list of category names and URL for a product at a specific URL key.
It returns a hook that sends the query to the backend and returns data about the request, which includes the results.

## Create the talon wrapper module

A talon wrapper module wraps around an existing talon and injects code around the implementation logic the talon executes.

You can define this module anywhere in your project, but for this tutorial create it under `src/targets`.

```sh
touch src/targets/wrapper.js
```

Inside `wrapper.js`, add the following content:

```js
import useProductCategoriesList from "../hooks/useProductCategoriesList";

const wrapUseProductFullDetails = (original) => {
  return function useProductFullDetails(props, ...restArgs) {
    console.log("Calling new useProductFullDetails() function!")

    const { product } = props;

    const categoriesListData = useProductCategoriesList({
      urlKey: product.url_key
    });

    const { productDetails, ...defaultReturnData } = original(
      props,
      ...restArgs
    );

    return {
      ...defaultReturnData,
      productDetails: {
        ...productDetails,
        categoriesList: categoriesListData
      }
    };
  };
};

export default wrapUseProductFullDetails;
```

This module exports a function that returns a new `useProductFullDetails()` function.
Whenever a component calls the original `useProductFullDetails()` talon, it calls this new function instead.

The module imports and uses the `useProductCategoriesList()` hook defined in a previous step to get the `categoriesListData`, which contains information about the request.
The code uses the `props` normally passed into the `original` function to get the value of the `urlKey` for the GraphQL request.

The extensibility framework provides the `original` talon function when it executes the wrapper module.
The new `useProductFullDetails()` function calls this function and uses the props data result as a starting point for the final returned value.

The final return value is combination of the original props data and the categories list data returned by the hook.

## Update the package entry point

Update the `package.json` file and set the main entry point to the talon wrapper module.

```diff
  "publishConfig": {
    "access": "public"
  },
- "main": "index.js",
+ "main": "src/targets/wrapper.js",
  "license": "(OSL-3.0 OR AFL-3.0)",
```

This indicates which module to return when another project uses this package as a dependency.
This is an important step because the intercept file in this project tells the extensibility framework to wrap the `useProductFullDetails()` talon with the module this package provides.

## Test on a local instance

Install this extension in a local storefront project to test its functionality.

```sh
yarn add --dev file:/path/to/your/extension/project
```

This will add a `devDependencies` entry to your storefront project's `package.json` that looks like the following:

```diff
  "memory-fs": "~0.4.1",
+ "my-extension": "file:/path/to/your/extension/project"
  "prettier": "~1.16.4",
```

Now, when you navigate to a product page, the following message appears in the console:

```text
"Calling new useProductFullDetails() function!".
```

Use additional `console.log()` calls to verify the application calls the data fetch hook.

<!-- TODO: Create a follw-up tutorial for this or update the create-taglist-component topic when the targetables PR is merged or released -->
To test the new props data the wrapped talon returns, you will need to create a copy of the ProductFullDetails component and alter it to log or render the new data.

[`npm init`]: https://docs.npmjs.com/cli/init
[`yarn init`]: https://classic.yarnpkg.com/en/docs/cli/init/
[plugins (interceptors)]: https://devdocs.magento.com/guides/v2.4/extension-dev-guide/plugins.html
