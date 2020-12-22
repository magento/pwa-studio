---
title: Work with GraphQL
---

PWA Studio storefronts use Magento's GraphQL endpoint to fetch data for its components.
In this tutorial, you will use a [countries][] and [country][] query to create two storefront pages that contain information from Magento.

By the end of this tutorial, you will know how to create a GraphQL query and use it to fetch data from the Magento backend and render that data on a page.

For more information about Magento GraphQL, see the [Magento GraphQL Developer Guide][].

{: .bs-callout .bs-callout-info}
This tutorial requires you to have a project set up using the steps provided in the [Project Setup][] tutorial.

## Create page component directory

Create both `Countries` and `Country` directories under your project's `src/components` directory.

```sh
mkdir -p src/components/Countries &&
mkdir -p src/components/Country
```

These directories will hold the source files for each component.

## Create the queries

The PWA Studio convention for GraphQL query files is to define and export them in JavaScript files inside component directories.

### Request data for supported countries

Create a `countries.gql.js` file under `src/components/Countries` with the following content:

```js
import { gql } from '@apollo/client';

const GET_COUNTRIES_QUERY = gql`
    query GetCountries {
        countries {
            id
            full_name_english
        }
    }
`;

export default {
    queries: {
        getCountriesQuery: GET_COUNTRIES_QUERY
    },
    mutations: {}
};
```

This file exports a query that requests the ID and name of countries from the Magento backend.

### Request country data

Create a `country.gql.js` file under `src/components/Country` with the following content:

```js
import { gql } from '@apollo/client';

const GET_COUNTRY_QUERY = gql`
    query GetCountry($id: String) {
        country(id: $id) {
            id
            full_name_english
            available_regions {
                id
                name
            }
        }
    }
`;

export default {
    queries: {
        getCountryQuery: GET_COUNTRY_QUERY
    },
    mutations: {}
};
```

This file exports a dynamic request that uses a query variable to get data for a country with a specific `id`.

## GraphQL Playground

Use the GraphQL Playground tool that comes with PWA Studio to test and validate your queries.
This tool connects to the same Magento backend as your storefront, so it returns the same data.

GraphQL Playground is available in the development server, so run your storefront in develop mode using `yarn watch`.
After the server starts, the command line lists the URL for the storefront and the GraphQL Playground.

Copy and paste the GraphQL Playground link in your browser to access the tool.

### Verify queries

Clear any existing queries in the left pane and paste the query for the list of countries.
When you run the query, the right pane will show the list of countries from Magento.

Clear the left pane and paste the query for a specific country.
Since this is a dynamic request, you need to provide a specific value for the country `id`.

Open the **Query Variables** pane on the bottom left and paste the following content:

```json
{
    "id":"US"
}
```

GraphQL Playground uses the data in this pane to populate the query variables expected by the query.
Now, when you run the query, the right pane will show the country data stored in Magento for the United States.

## Create components

In this part of the tutorial, you will create the React components that uses these queries and renders their data.

### Countries

Under `src/component/Countries`, create a `countries.js` file with the following content:

```jsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from '@magento/venia-drivers';
import path from 'path';

import countriesOperations from './countries.gql';

const Countries = () => {
    const { queries } = countriesOperations;
    const { getCountriesQuery } = queries;

    // Fetch the data using apollo react hooks
    const { data, error, loading } = useQuery(getCountriesQuery);

    // Loading and error states can detected using values returned from
    // the useQuery hook
    if (loading) {
        // Default content rendered while the query is running
        return <span>Loading...</span>;
    }

    if (error) {
        // NOTE: This is only meant to show WHERE you can handle
        // GraphQL errors. Not HOW you should handle it.
        return <span>Error!</span>;
    }

    const { countries } = data;

    const listItems = countries.map(country => {
        const { id, full_name_english: name } = country;

        const linkTo = path.join('country', id);

        return (
            <li key={id}>
                <Link to={linkTo}>{name}</Link>
            </li>
        );
    });

    return <ul>{listItems}</ul>;
};

export default Countries;
```

This file defines a component that creates a list of countries where the backend Magento store does business.
Each country listed is a link that points to a page for that country.

In the code, the component imports and destructures the GraphQL query from the `countries.gql.js` file and makes a request using `useQuery()` from the `@apollo/client` library.

Next, create an `index.js` file under `src/components/Countries`.
Add the following content to export the Countries component from the directory.

```js
// src/components/Countries/index.js

export { default } from './countries'
```

### Country

Under `src/components/Country`, create a `country.js` file with the following content:

```jsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from '@magento/venia-ui/lib/drivers';

import countryOperations from './country.gql';

import Regions from './regions';

const Country = () => {
    const { id } = useParams();

    const { queries } = countryOperations;
    const { getCountryQuery } = queries;

    // Fetch the data using apollo react hooks
    const { data, error, loading } = useQuery(getCountryQuery, {
        variables: { id: id }
    });

    if (loading) {
        return <span>Loading...</span>;
    }

    if (error) {
        // NOTE: This is only meant to show WHERE you can handle
        // GraphQL errors. Not HOW you should handle it.
        return <span>Error!</span>;
    }

    const { country } = data;

    const { full_name_english: name, available_regions: regions } = country;

    return (
        <div>
            <h2>{name}</h2>
            <Regions regions={regions} />
        </div>
    );
};

export default Country;
```

Under the same directory, create a `regions.js` file with the following content:

```jsx
import React from 'react';

const Regions = props => {
    const { regions } = props;

    if (regions) {
        const listItems = regions.map(region => {
            const { name } = region;
            return <li key={name}>{name}</li>;
        });

        return <ul>{listItems}</ul>;
    }

    return null;
};

export default Regions;
```

These files define components that render information about a specific country.

The component gets the country ID from the URL using the [`useParams()`][] hook.
Similar to the **Countries** component, the **Country** component imports the GraphQL query and uses the `useQuery()` function and the country ID to get the data for a specific country.

The Country component also imports a **Region** component, which renders a lists of regions associated with a country.

Next, create an `index.js` file under `src/components/Country`.
Add the following content to export the Country component from the directory.

```js
// src/components/Country/index.js

export { default } from './country'
```

## Associate components to routes

Use the steps in the [Add a static route][] tutorial to add the following entries to the Routes component:

```diff
 <Suspense fallback={fullPageLoadingIndicator}>
     <Switch>
+        <Route exact path="/countries">
+            <Countries />
+        </Route>
+        <Route path="/country/:id?">
+            <Country />
+        </Route>
         <Route exact path="/search.html">
             <Search />
         </Route>
         <Route exact path="/create-account">
             <CreateAccountPage />
         </Route>
         <Route>
             <MagentoRoute />
         </Route>
     </Switch>
 </Suspense>
```

This update associates the Countries and Country components with specific routes.
The pattern used for the country route lets the `useParams()` hook get the country ID from the URL.

## View the components

Start the development server using `yarn watch` and navigate to `<storefront url>/countries` to see a page with the list of countries from Magento.
Each country is a link which leads to a page rendered by the Country component.

[project setup]: <{%link tutorials/pwa-studio-fundamentals/project-setup/index.md %}>
[add a static route]: <{%link tutorials/pwa-studio-fundamentals/add-a-static-route/index.md %}>

[countries]: https://devdocs.magento.com/guides/v2.3/graphql/queries/directory-countries.html
[country]: https://devdocs.magento.com/guides/v2.3/graphql/queries/directory-country.html
[magento graphql developer guide]: https://devdocs.magento.com/guides/v2.3/graphql/
[`useparams()`]: https://reacttraining.com/react-router/web/api/Hooks/useparams
