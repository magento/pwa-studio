# Shimmer as RootComponent
Root components are usually loaded asynchronously through a mix of a webpack flag and a JS docblock. This allows
for root components to be loaded dynamically and flexibly, however there is a drawback; speed. Since loading shimmers
require instantaneous resolution for maximum impact (ie we don't want to be waiting for a component that's rendered while
we're waiting for the real component), we require a different approach

## Usage

### Defining a root component shimmer
As you would with a normal component, the actual shimmer component should be defined along side the root component. However,
we will also need to expose this shimmer to be found by our root shimmer wrapper. To do so, build and define the component
as usual, and then add an export to the venia-ui/lib/RootComponents/Shimmer/types/index.js file. The exported name should be
`[TYPE]_SHIMMER`. This exported name will be used to match based on the app context state value when changing pages.

##### Example
```jsx
/** RootComponent/Example/example.shimmer.js **/

import React from 'react';
import Shimmer from '../../components/Shimmer';

export default () => {
  // Return a full page skeleton
  return (
    <div>
        <Shimmer />
        <Shimmer />
    </div>  
  );
};
```

```jsx
/** RootComponent/Example/index.js **/

/**
 * @RootComponent
 * description = 'Some Example Page'
 * pageTypes = EXAMPLE_PAGE
 */
export { default } from './example';
```

```jsx
/** RootComponent/Shimmer/types/index.js **/

// ...
export { default as EXAMPLE_PAGE_SHIMMER } from '../../Example/example.shimmer.js';
// ...
```

##### For external root components (outside of venia-ui)

The root shimmer types are tapable, so we can easily add new root component shimmers.

##### Example
```jsx
/** local-intercept.js **/

const { rootShimmerTypes } = targets.of('@magento/venia-ui');
rootShimmerTypes.tap(target => {
    target.add({
        shimmerType: 'EXAMPLE_PAGE_SHIMMER',
        importPath: `'src/RootComponent/Example/example.shimmer'`
    });
});
```

### Setting the state value when changing pages
In order for PWA Studio to automatically render this new root component shimmer when changing pages, we'll need to use
the provided hook to generate a click handler on our link. This hook will take care of formatting (capitalizing) the type
and appending `_SHIMMER` to it. So all we need to do is pass in the value of our page type. This click handler will take
care of setting the value in the app context state. This state value automatically resets once the page has rendered.

##### Example

```jsx
/** components/Foo/foo.js **/

import React from 'react';
import { Link } from 'react-router-dom';
import useInternalLink from '@magento/peregrine/lib/hooks/useInternalLink';

export default () => {
    // We will be navigating to our custom example page, so we pass in example_page.
    // For a CMS page, it would be cms_page. For category page, category, etc.
    const { handleClick } = useInternalLink('example_page'); 
    
    return (
        <div>
            <Link to="/example/foo.html" onClick={handleClick}>
                Visit My Custom Example Page
            </Link>
        </div>  
    );
};
```
Normally this would be done in our talon attached to the component. For simplicity's sake, we're calling it directly in
the component
