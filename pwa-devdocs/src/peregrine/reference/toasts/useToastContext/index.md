---
title: useToastContext
adobeio: /api/peregrine/hooks/toasts/useToastContext/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/Toasts/useToastContext.md %}

## Examples

### Using the Toast context logic

Import the ToastContextProvider and wrap it around components that use Toast data and functionality.

```jsx
// MyComponent.js

import {ToastContextProvider} from '@magento/peregrine'
import {ToastContainer, AddToastComponent} from './MyToastComponents'

...

const MyComponent = () =>{

  return (
  <ToastContextProvider>
    <ToastContainer /> // A component which would display based on state.
    <AddToastComponent /> // A component which adds a toast using actions.
  </ToastContextProvider>
  )
}

...
```

Call **useToastContext()** to get the current state of the toast store and a dispatch function.

```jsx
// MyToastComponents.js

import {useToastContext} from '@magnto/peregrine';

export const ToastContainer = () =>{
  const [toastState, toastDispatch] = useToastContext();

  const toastData = toastState.map(toast=>{
    // Do something with the toast data
  })

  return <div>{toastData}</div>
}

export const AddToastComponent = () =>{
  return
  (
    <div>
    // Some component that allows you to add toast data using the
    // toastDispatch() function or useToast() hook
    </div>
  )
}

```
