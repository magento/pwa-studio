---
title: useQuery
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/src/hooks/useQuery.md %}

## Examples

Send a product search query to the server and get back the query result state object.

```js
import PRODUCT_SEARCH from 'src/queries/productSearch.graphql';

const [queryResult, queryApi] = useQuery(PRODUCT_SEARCH);

const { data, error, loading } = queryResult;
```
