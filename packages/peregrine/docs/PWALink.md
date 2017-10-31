# PWALink

A wrapper around the `react-router` [`<Link />`](https://reacttraining.com/react-router/web/api/Link) component. Abstracts away the proper handling of URL rewrites and customer facing URLs for products/categories/etc.

## Usage
```js
import { PWALink } from '@magento/peregrine';

const ExampleProductLink = (
    <PWALink
        to='/custom/product.html'
        entityType='product'
        entityID='some-product-sku'
    />
);
```
