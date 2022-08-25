---
title: Reuse a Venia Component
--- 

Here we'll quickly demonstrated how PWA Studio components can be easily reused.

Import the CategoryList to the Foo component:    

```javascript
/* Deprecated in PWA-12.1.0*/
import CategoryList from '@magento/venia-ui/lib/components/CategoryList';
```

Next add the following JSX.

```jsx
<hr className={classes.spacer} />
<p className={classes.label}>Reuse of a the PWA Studio component to render a category list:</p>
<CategoryList title="Foo Recommends" id={2} />
```

Check the storefront of the app to see the _CategoryList_ component rendered.

## Learn more

-   [Modular components][]

[Modular components]: {%link venia-pwa-concept/features/modular-components/index.md %}
