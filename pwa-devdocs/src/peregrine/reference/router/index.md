---
title: Router
---

The Peregrine Router is a client-side router that is designed to understand the different storefront routes within Magento 2.
If using Peregrine to bootstrap your PWA, it is configured automatically. If not, the Router can be manually consumed.

## Props

| Name          | Required                                      | Description                                                                                             |
| ------------- | :-------------------------------------------: | ------------------------------------------------------------------------------------------------------- |
| `apiBase`     | <i class="material-icons green">check_box</i> | Root URL of the Magento store (including protocol and hostname)                                         |
| `using`       |                                               | Router implementation from React-Router. Possible values: `BrowserRouter`, `HashRouter`, `MemoryRouter` |
| `routerProps` |                                               | Any additional props to pass to React-Router                                                            |
{:style="table-layout:auto"}

## Example

The following example shows the manual usage of the Router component:

``` jsx
import ReactDOM from 'react-dom';
import { Router } from '@magento/peregrine';

ReactDOM.render(
    <Router apiBase="https://mystore.com" />,
    document.querySelector('main')
);
```