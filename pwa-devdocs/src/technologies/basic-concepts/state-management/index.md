---
title: State management
---

## What is state management

An application, such as a PWA storefront, uses state data to render dynamic content to the user.
State management describes the way the application handles changing state data as a result of user interactions.

Interactions, such as clicking on a button or loading the page, modify the state and update the appearance or behavior of the application.

For example, a shopper clicks on a button to add an item to the shopping cart.
The application needs a way to add that item to the shopping cart while the shopper continues to browse the application.
It also needs to update the visual components that use shopping cart data to reflect the new state.

## Common state management technologies

There are many libraries and framework features that implement state management.
This section describes two such technologies used in the PWA Studio project.

### Redux

[Redux][] is a state management design pattern and library.
It promotes the idea of a global object tree that contains the state of the whole application.
This object is known as a [store][].

The store is a read-only object, which can only be updated by dispatching a [reducer][] function.
Reducer functions accept the current state and an [action][] object as parameters and returns the next state.

Application components are able to [dispatch][] various actions to update the state.
Components can also [subscribe][] to state changes to update their appearance or behavior.

Early versions of PWA Studio used the Redux library directly as the primary mechanism for managing application state,
and the Redux pattern can be seen in hooks such as [`useQueryResult()`][] and [`useRestResponse()`][].

Currently, PWA Studio abstracts away its Redux implementation details using Peregrine hooks.
This opens up the possibility of the project replacing Redux in Peregrine with another state management library without breaking state dependent components, such as Venia.

### React hooks



## State management in PWA Studio

### Context providers

## Example

[redux]: https://redux.js.org/introduction/getting-started
[store]: https://redux.js.org/glossary#store
[reducer]: https://redux.js.org/glossary#reducer
[action]: https://redux.js.org/basics/actions
[dispatch]: https://redux.js.org/api/store#dispatchaction
[subscribe]: https://redux.js.org/api/store#subscribelistener
[`usequeryresult()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useQueryResult.js
[`userestresponse()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useRestResponse.js