---
title: ToastContainer
adobeio: /api/venia/components/general/ToastContainer/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/venia-ui/lib/components/ToastContainer/toastContainer.md %}

## Example

### Using ToastContainer

Use the ToastContextProvider component to provide the ToastContainer with toast data.
Since the ToastContainer consumes the context provided by the [ToastContextProvider][],
it can be nested within other components that are wrapped by ToastContextProvider.

```jsx
import { ToastContextProvider } from '@magento/peregrine';
import  ToastContainer  from '@magento/venia-ui/lib/components/ToastContainer'

import MyToastCreator from './MyToastCreator'

const Toaster = (props)=>{

  return (
    <ToastContextProvider>
      <ToastContainer />
      <MyToastCreator />  // A component which adds a toast using actions.
    </ToastContextProvider>
  )

}

export default Toaster;
```

See also: [ToastContextProvider][]

[toastcontextprovider]: {%link peregrine/reference/toasts/useToastContext/index.md %}
