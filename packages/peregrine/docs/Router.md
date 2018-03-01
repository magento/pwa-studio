# Peregrine Router

The Peregrine Router is a client-side router that is designed to understand the
different storefront routes within Magento 2. If using Peregrine to bootstrap
your PWA, it is configured automatically. If not, the Router can be manually
consumed.

## Manual Usage

```jsx
import ReactDOM from 'react-dom';
import { Router } from '@magento/peregrine';

ReactDOM.render(
    <Router apiBase="https://mystore.com" />,
    document.querySelector('main')
);
```

## Props

| Prop Name     | Required? |                                                                                            Description |
| ------------- | :-------: | -----------------------------------------------------------------------------------------------------: |
| `apiBase`     |    ✅     |                                         Root URL of the Magento store, including protocol and hostname |
| `using`       |           | The Router implementation to use from React-Router. Can be `BrowserRouter`/`HashRouter`/`MemoryRouter` |
| `routerProps` |           |                                                      Any additional props to be passed to React-Router |
