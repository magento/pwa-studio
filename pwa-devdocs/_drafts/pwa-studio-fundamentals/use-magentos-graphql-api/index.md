---
title: Use Magento's GraphQL API with Apollo
---

## Overview

In this tutorial we will demonstrate how PWA Studio uses Apollo Queries to fetch data from the backend.

## What is Apollo Client

> Apollo Client is a complete state management library for JavaScript apps. Simply write a GraphQL query, and Apollo Client will take care of requesting and caching your data, as well as updating your UI.
> Fetching data with Apollo Client guides you to structure your code in a predictable, declarative way consistent with modern React best practices. With Apollo, you can build high-quality features faster without the hassle of writing data plumbing boilerplate.
> [https://www.apollographql.com/docs/react/][]

## GraphQL API with Apollo Demo

### Create a GraphQL query

Create the below file:

_src/queries/getProductData.graphql_

```graphql
query GetProductData($sku: String!) {
  products (filter: {sku: {eq: $sku}}){
    items {
      name,
      url_key,
      image {
        url
      }
    }
  }
}
```

### Use Apollo Client Query in a component

Create a new child component:

_src/components/Foo/productLink.js_

```javascript
import React, { Component } from 'react';
import { Link } from '@magento/venia-ui/lib/drivers';

import { useQuery } from '@apollo/client';
import GET_PRODUCT_DATA from '../../queries/getProductData.graphql';  // import the query you created above
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const productLink = props => {
  const { loading, error, data } = useQuery(GET_PRODUCT_DATA, {
    variables: { sku: props.sku }
  });

  let result = '';

  if (error) {
    result = 'An error occurred while fetching results.';
  } else if (loading) {
    result = (
      <LoadingIndicator />
    );
  } else if (!data.products.items) {
    result = 'No results were found.';
  } else {
    result = (
      <Link to={"/" + data.products.items[0].url_key + ".html"}>
        <img src={data.products.items[0].image.url} width="80px" /><br />
        {data.products.items[0].name}
      </Link>
    );
  }

  return result;
}

export default productLink;
```

Add the `<ProductLink sku="VT11"/>` component to the JSX section of the Foo component. _Don't forget to import it!_

Browse to the /foo.html URL in the application.
![graphql and apollo client][]

## Learn More

-   [React Apollo](https://github.com/apollographql/react-apollo)

[graphql and apollo client]: ./images/graphql-and-apollo-client.png
[https://www.apollographql.com/docs/react/]: https://www.apollographql.com/docs/react/
