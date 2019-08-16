---
title: useToasts
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/Toasts/useToasts.md %}

## Examples

### Adding a toast

Use the `addToast()` function from the API to add a toast to the toast store.

**Note:** If an `onAction()` or `onDismiss()` callback is provided, the implementer ~must~ call the passed in `remove()` function.
If the `onDismiss()` callback is not provided, the toast is removed immediately.


```jsx
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
