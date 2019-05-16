---
title: useQueryResult
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/src/hooks/useQueryResult.md %}

## Examples

Extracting the state and API objects from the array:

```js
let [queryResultState, useQueryResultApi] = useQueryResult();
```

Updating the `queryResultState` with new payload data:

```js
let payload = await apolloClient.query({ query, variables  });

useQueryResultApi.receiveResponse(payload);
```
