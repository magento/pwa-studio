---
title: Versioning strategy
---

## Rules for incrementing the version

PWA Studio follows [Semantic Versioning][] rules when incrementing the version for each release.

According to the Semantic Versioning specifications, given the `MAJOR.MINOR.PATCH` version number format:

* **MAJOR** version increases happen when there are changes to the [public API][].
* **MINOR** version increases happen when functionality is added while preserving backwards compatibility.
* **PATCH** version increases happen for backwards-compatible bug fixes.

See [Semantic Versioning][] documentation for specific details about the type of changes allowed within each version.

## Public API

PWA Studio considers the following to be part of its public API:

### Published Venia and Peregrine components

Venia and Peregrine make their components available through their `index.js` files.
Any component exported through this file is considered public API.

Sub-components can be found inside component directories.
These components are not part of the public API unless they are exported in the component's `index.js` file.

### Component props

React components use props as input data to define how they look and behave.

Since props affect how a component renders or acts, the props used by published PWA Studio components are considered public API.

[Semantic Versioning]: https://semver.org/
[public API]: #public-api
