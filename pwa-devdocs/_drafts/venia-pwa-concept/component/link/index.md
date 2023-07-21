# Link
The link component provides a wrapper for the base `react-router-dom` link, but provides additional functionality. When
the `prefetchType` prop is passed, the component will bind an IntersectionObserver so when the link becomes visible,
it will prefetch the page information. Since the call is the same as the useMagentoRoute talon, the page will render
quicker since it will be fetching from cache instead of waiting for the server response. This falls inline with
Google's recommendation of prefetching certain content to make transitions quicker.

#### Example
```jsx
import React from 'react';
import Link from '../Link';

export default () => {
    return (
      <div>
        <p>Some Content</p>
        <Link to="/my/route.html">Click Me</Link>
      </div>  
    );
};
```
