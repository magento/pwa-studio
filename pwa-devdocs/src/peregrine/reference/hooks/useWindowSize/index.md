---
title: useWindowSize
adobeio: /api/peregrine/hooks/useWindowSize/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/hooks/useWindowSize.md %}

## Examples

It is recommended to only create/use the WindowSizeContextProvider a single time at the top level of your app:

```jsx
return(
  <WindowSizeContextProvider>
      <App />
  </WindowSizeContextProvider>
)
```

Inside a component in your application, use the `useWindowSize()` function to get the window size value that updates when the window size changes.

```jsx
import { useWindowSize  } from '@magento/peregrine';

function MyComponent(props) {

  const windowSize = useWindowSize();

  return (
    <span>
      Inner window size: {windowSize.innerWidth} x {windowSize.innerHeight}
    </span>
  );

}
```
