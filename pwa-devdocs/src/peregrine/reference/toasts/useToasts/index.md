---
title: useToasts
adobeio: /api/peregrine/hooks/toasts/useToasts/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/Toasts/useToasts.md %}

## Examples

### Adding a toast

Use the `addToast()` function from the API to add a toast to the toast store.

{: .bs-callout .bs-callout-info}
If an `onAction()` or `onDismiss()` callback is provided, the implementer _must_ call the passed in `remove()` function.
If the `onDismiss()` callback is not provided, the toast is removed immediately.

```jsx
const { toasterState, api }  = useToast(); 
const { addToast } = api;

addToast({
  type: 'error',
  message: 'An error occurred!',
  actionText: 'Retry',
  onAction: remove => {
    async attemptRetry();
    remove();
  },
  onDismiss: remove => {
    async doSomethingOnDismiss();
    remove();
  },
  icon: <Icon src={SadFaceIcon} />
});
```

See also: [ToastContainer][]

[toastcontainer]: {%link venia-ui/reference/components/ToastContainer/index.md %}
