---
title: Peregrine
adobeio: /guides/packages/peregrine/
---

The Peregrine package is a collection of functions that act as the brains of your visual components.
They provide pieces of logic for UI components, such as the ones provided by the [Venia][] library.
Use or remix these functions and components to create a unique Magento PWA storefront.

## Custom React hooks

Many of the functions provided by Peregrine are [custom React hooks][].
This lets them maintain an internal state without relying on an external library, such as Redux.

Peregrine hooks are designed to be flexible, and non-opinionated about UI.
They contain code for providing data or behavior logic and do not render content themselves.
Rendering content is left up to UI components.

Separating logic and presentation code gives developers more flexibility on how to use PWA Studio components with their own custom code.
A developer may choose to use a Venia feature that uses certain Peregrine hooks with minor visual modifications, or
they can use those same Peregrine hooks to develop their own feature with a different UI.

For more information about custom hooks, see the React documentation for [Building Your Own Hooks][].

### Return signatures

The return signatures of Peregrine hooks vary and is dependent on their purpose.

Some return an array with *state* and *api* objects, which follow the same pattern as [`useState()`][] and [`useReducer()`].
This lets you specify the variable names of the provided objects when you [destructure][] the array.

Other Peregrine hooks return a single object.

Use the reference docs on this site or in the [JSDoc][] blocks in the source code learn the API for each hook.

## JSDoc blocks

Most of the reference docs in this section are generated from [JSDoc][] blocks.
The currently published docs reflect what is available from the most recent release, but
the JSDoc blocks in the source are kept up to date for developers who want to work with unreleased code.

## Source

Visit the [`peregrine`][] package to view the source or contribute to this project.

[venia]: {%link venia-pwa-concept/index.md %}

[`peregrine`]: https://github.com/magento/pwa-studio/tree/main/packages/peregrine
[custom react hooks]: https://reactjs.org/docs/hooks-custom.html
[destructure]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[jsdoc]: https://devdocs.io/jsdoc/
[`usestate()`]: https://reactjs.org/docs/hooks-reference.html#usestate
[`usereducer()`]: https://reactjs.org/docs/hooks-reference.html#usereducer
[building your own hooks]: https://reactjs.org/docs/hooks-custom.html
