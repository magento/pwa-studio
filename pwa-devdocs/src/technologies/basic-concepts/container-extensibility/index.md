---
title: Container extensibility
---

A **Container** is an HTML element that contains 0 or more [`ContainerChild`] components.
It acts as the target for [`magento-loader-layout`] operations.

## Creating a Container

To create a Container in a React component, add a `data-mid` prop to any DOM element, such as a `div`, `span`, etc. 
The value of the `data-mid` prop *must* be a literal string value.
It cannot be a dynamic value or a variable reference.

**Example:**
``` jsx
<div data-mid="containerId"/>
```

**Note:**
*Composite components, such as a class or function, cannot be used as a Container.*


## Extending a Container

[`ContainerChild`] components are the only allowed children of a Container. 
This makes it possible to extend a Container using the `magento-loader-layout` tool from the [PWA Buildpack].

`magento-loader-layout` supports the following operations:

* Remove a container
* Remove a child component in a container
* Insert content before a child component in a container
* Insert content after a child component in a container

See: [Code examples]

[`ContainerChild`]: {{ site.baseurl }}{% link peregrine/reference/container-child/index.md %}
[`magento-loader-layout`]: {{ site.baseurl }}{% link pwa-buildpack/reference/layout-loader/index.md %}
[PWA Buildpack]: {{ site.baseurl }}{% link pwa-buildpack/index.md %}
[Code examples]: {{ site.baseurl }}{% link pwa-buildpack/reference/layout-loader/index.md %}#examples