---
title: Shimmer
adobeio: /api/venia/components/general/Shimmer/
---

The Shimmer component is a loading indicator that takes the shape of the component being loaded.
Instead of blocking the entire page like a traditional full-screen loader, Shimmer loaders are component-shape specific to show users previews of what's loading on the page.

These previews improves the perceived performance of the app and prevents CLS (Content Layout Shift).
The Shimmer component eliminates most of the CLS on a page, which helps improve Google Lighthouse scores.

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/venia-ui/lib/components/Shimmer/shimmer.md %}

## Shimmer for Components

When loading data, previously we would return `null` (or a full-screen loader) instead of the actual component. We can now return a
_**shimmer**_ version of the component, which will take up the same space without relying on data.

Direct use of the `Shimmer` component within _normal_ components should be avoided when possible. If the shimmer is replacing a component
that is imported, a `.shimmer.js` file should be created for that imported component in its folder and exported in its `index.js`.

### Example

There are 4 critical files for creating a Shimmer component:

* **Main.js** - the main component that has the loading status and would usually return null for the component while loading
* **SubComponent/index.js** - Previously would only export the main component. Must now export named variable for shimmer component
* **SubComponent/subComponent** - Same SubComponent as usual
* **SubComponent/subComponent.shimmer.js** - `.shimmer.js` extension is used for easily identifying that it's a shimmer and
  the component it's attached to. It can contain complex arrangement of base Shimmer elements, or include other subcomponents Shimmers.

**Main.js**

```jsx
import React from 'react';
import SubComponent, { SubComponentShimmer } from '../path/to/SubComponent';
// ....
export default () => {
    const { data, isLoading } = fetchData();

    if (isLoading) {
        return (
          <SubComponentShimmer />
        );
    }

    if (!data) {
        return 'No data';
    }

    return (
        <SubComponent someValue={data} />
    );
};
// ....
```
---

**../path/to/SubComponent/index.js**

```jsx
export { default } from './subComponent.js';
// Export named shimmer component
export { default as SubComponentShimmer } from './subComponent.shimmer.js';
```
---

**../path/to/SubComponent/subComponent.js**

```jsx
import React from 'react';
import { shape, string } from 'prop-types';
import { useStyle } from '../../path/to/classify';
import defaultClasses from './subComponent.css';
const SubComponent = (props) => {
    const classes = useStyle(defaultClasses, props.classes);
    const { someValue } = props;

    return (
        <div className={classes.root}>
          <div className={classes.item}>{someValue}</div>
        </div>
    );
};
SubComponent.defaultProps = {
    classes: {}
};
SubComponent.propTypes = {
    classes: shape({
      root: string,
      item: string
    })
}
export default SubComponent;
```
---

**../path/to/SubComponent/subComponent.shimmer.js**

```jsx
import React from 'react';
import { useStyle } from '../../path/to/classify';
import Shimmer from '../path/to/base/Shimmer';
import defaultClasses from './subComponent.css'; // Load same classes as real SubComponent
const SubComponentShimmer = (props) => {
    // Important to still merge-in prop classes for extensibility/targetability
    const classes = useStyle(defaultClasses, props.classes);

    return (
      <div className={classes.root}>
        <Shimmer className={classes.item} />
      </div>
    );
};
SubComponentShimmer.defaultProps = {
  classes: {}
};
SubComponentShimmer.propTypes = {
  classes: shape({
    root: string,
    item: string
  })
}
export default SubComponentShimmer;
```

## Adjusting existing Shimmers

When you make layout changes to a Shimmer's parent component, you should also adjust the Shimmer component to match.
In this example, we'll add a custom attribute shimmer to the detail section of the product page.

**local-intercept.js**

```jsx
const { Targetables } = require('@magento/pwa-buildpack');
const targetables = Targetables.using(targets);
const productShimmerComponent = targetables.reactComponent(
    '@magento/venia-ui/lib/RootComponents/Product/product.shimmer'
);

/**
 * As a best practice, you should create a separate Shimmer file for the new attribute and import it into the
 * productShimmerComponent. But for simplicity, we'll inline the jsx as shown here.
 */
productShimmerComponent.appendJSX(
    'section className={classes.details}'
    `<div className={classes.detailsTitle}>
        <Shimmer width="100%" height={1} />
     </div>
     <Shimmer width="100%" height={1} />`
);
```

## Accessibility

To maintain accessibility for screen readers, we can pass `aria-live="polite" aria-busy="true"` to the Shimmer component (or an
element that wraps the Shimmer(s) in a more complex instance).

It's important to then add `aria-live="polite" aria-busy="false"` to the _normal_ component that replaces the shimmer.

### Example

```jsx
// ....
import Shimmer from '../path/to/base/Shimmer';
// ....
export default () => {
  // ....
  return (
    <Shimmer />
  );
};
```