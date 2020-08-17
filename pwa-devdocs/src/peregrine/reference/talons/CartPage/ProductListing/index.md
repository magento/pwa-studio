---
title: Product Listing Talons
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/talons/CartPage/ProductListing/useProductListing.md %}

## Examples

### useProductListing()

```jsx
import React from 'react';
import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing';

import { GET_PRODUCT_LISTING } from './myProductListing.gql';

const MyProductListing = props => {
    const { setIsCartUpdating } = props;

    const talonProps = useProductListing({
        queries: {
            getProductListing: GET_PRODUCT_LISTING
        }
    });
    const { activeEditItem, isLoading, items, setActiveEditItem } = talonProps;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        // JSX that renders the list of products in a cart using the talon props
    )
}

export default MyProductListing;
```
