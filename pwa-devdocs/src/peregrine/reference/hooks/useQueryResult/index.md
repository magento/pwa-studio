---
title: useQueryResult
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/hooks/useQueryResult.md %}

## Examples

### Example 1

Extracting the state and API objects from the array:

```js
let [queryResultState, useQueryResultApi] = useQueryResult();
```

Updating the `queryResultState` with new payload data:

```js

import { useApolloContext } from "./useApolloContext";

import PRODUCT_SEARCH from '../../queries/productSearch.graphql';

const apolloClient = useApolloContext();

let payload = await apolloClient.query({ PRODUCT_SEARCH, variables  });

useQueryResultApi.receiveResponse(payload);
```

### Example 2

<iframe src="https://codesandbox.io/embed/github/magento-research/code-samples/tree/master/?codemirror=1&fontsize=14&initialpath=%2Fusequeryresult&module=%2Fsrc%2Fexamples%2Fperegrine%2Fhooks%2FuseQueryResultExample.js&runonclick=1&expanddevtools=0" title="pwa-studio-code-samples" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:600px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
