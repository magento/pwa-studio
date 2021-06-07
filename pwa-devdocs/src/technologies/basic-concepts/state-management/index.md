---
title: State management
adobeio: /guides/general-concepts/state-management/
---

## What is state management

An application, such as a PWA storefront, uses state data to render dynamic content to the user.
State management describes the way the application handles changing state data as a result of user interactions.

Interactions, such as clicking on a button or loading the page, modify the state and update the appearance or behavior of the application.

For example, a shopper clicks on a button to add an item to the shopping cart.
The application needs a way to add that item to the shopping cart while the shopper continues to browse the application.
It also needs to update the visual components that use shopping cart data to reflect the new state.

## Local versus global state

Local and global are the two different types of state a component can depend on.

Local state data is any data scoped within a component or its children components.
This type of data is not shared with a component's parent or peer data.
Otherwise, that data should be [lifted][].

For example, a button component's disabled state is never used outside that component, so
it is categorized as local state data.

```jsx
const MyButton = () => {
    const [isDisabled, setIsDisabled] = useState(false);

    const handleClick= useCallback(() => setIsDisabled(true),[])

    return <button onClick={handleClick} disabled={isDisabled}>Click me!</button>;
}
```

Global state data is any data made available to components in the entire application.
Components that depend on a global state value subscribe to changes for that value and re-render themselves.
Most components do not depend on the entire global state.
Instead, a component only uses small pieces of the entire global state.

Shopping cart data is an example of global state data that components in different levels of the application use and modify.

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
and the Redux pattern can be seen in hooks such as [`useRestResponse()`][].

Currently, PWA Studio abstracts away its Redux implementation details using Peregrine hooks and context providers.
This opens up the possibility of the project replacing Redux in Peregrine with another state management library without breaking state dependent components, such as those in Venia.

PWA Studio allows you to customize reducers and enhancers.
The following example uses `combineReducers()` to combine the default Peregrine reducers with custom reducers specific to the project and uses the combined reducers when creating the Redux store.

```jsx
// Example src/store.js file

import { combineReducers, createStore } from 'redux';
import { enhancer, reducers } from '@magento/peregrine';

import myReducers from './lib/reducers';

// You can add your own reducers here and combine them with the Peregrine exports.
const rootReducer = combineReducers({ ...reducers, ...myReducers });

export default createStore(rootReducer, enhancer);
```

### React hooks

React version 16.8 introduced the concept of [hooks][].
Hooks allow [function components][] to manage their own internal state by letting them use the same component lifecycle features available to class components.

Earlier versions of React only allowed class components to manage state,
so stateful classes often became complex and hard to understand.
Hooks help developers to decompose large components into smaller functions that are focused on specific logic, such as fetching data.

Since PWA Studio favors using function components over classes, it uses many of React's [built-in hooks][] in its Venia and Peregrine libraries.
The Peregrine library also provides [custom React hooks][] for storefront developers.
These hooks contain common Magento storefront logic such as state management.

## State management in PWA Studio

State management in PWA Studio is a mix of the Redux library, React hooks, and React context providers.
The Redux library is the underlying technology that powers state management behind the scenes, but
components do not interact with the global store directly.
Instead, components that need global state data use React hooks and context providers to read or update the current state.

### Context providers

React components look and behave as a result of their props.
Normally, this means an application needs to explicitly pass state data as a prop down the React application tree to components that need that data.
This is known as _prop drilling_.

To avoid prop drilling, React provides the [Context][] feature.
The Context feature allows an application to define a value and make it available to its descendants without passing it down the tree.

A Context object contains a Provider and Consumer property.
A `Context.Provider` component defines the shared data for its children, and
a corresponding `Context.Consumer` acquires the data and subscribes to any changes.

PWA Studio uses the Context feature to provide application state data to storefront components through the [`PeregrineContextProvider`][] component.
Wrapping an application with the `PeregrineContextProvider` lets its components access different slices of the entire application state.

{% raw %}

```jsx
// Example src/index.js

import React from 'react';
import ReactDOM from 'react-dom';

import { Adapter } from '@magento/venia-drivers';
import { PeregrineContextProvider } from '@magento/peregrine';

import store from './store'; // This was defined in the previous example
import MyApplication from `./src/components/MyApplication`;

const apiBase = new URL('/graphql', location.origin).toString();

ReactDOM.render(
    <Adapter
        apiBase={apiBase}
        apollo={{ link: authLink.concat(Adapter.apolloLink(apiBase)) }}
        store={store}
    >
        <PeregrineContextProvider>
            <MyApplication />
        </PeregrineContextProvider>
    </Adapter>,
    document.getElementById('root')
);

```

{% endraw %}

### Global state slices

Peregrine exposes global state data in slices through the `PeregrineContextProvider` component and custom React hooks.
A state data slice is a subset of values from the global state.
Each slice contains data about a specific part of the application, such as the shopping cart state or user session state.

To access a global state slice, wrap the `PeregrineContextProvider` around the main application (as shown in the previous example).

Next, import the appropriate [context hook][] and decompose the array returned by the hook function call.
The decomposed array yields the state data and an API object to update that state.

```jsx
// Example src/components/MyWelcomeMessage/myWelcomeMessage.js

import { useUserContext } from '@magento/peregrine/lib/context/user';

const MyWelcomeMessage = () => {
    const [userContext, userContextApi] = useUserContext();

    const {isSignedIn, currentUser} = userContext;
    const { firstname, lastname } = currentUser;

    if(isSignedIn){
        return <span>Welcome {firstname} {lastname}!</span>;
    }

    return null;

}

export default MyWelcomeMessage;
```

<!-- TODO: Update these links to point to master when they are available in master -->
[`userestresponse()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/hooks/useRestResponse.js
[`peregrinecontextprovider`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/PeregrineContextProvider/peregrineContextProvider.js
[context hook]: https://github.com/magento/pwa-studio/tree/develop/packages/peregrine/lib/context

[redux]: https://redux.js.org/introduction/getting-started
[store]: https://redux.js.org/glossary#store
[reducer]: https://redux.js.org/glossary#reducer
[action]: https://redux.js.org/basics/actions
[dispatch]: https://redux.js.org/api/store#dispatchaction
[subscribe]: https://redux.js.org/api/store#subscribelistener
[hooks]: https://reactjs.org/docs/hooks-intro.html
[function components]: https://reactjs.org/docs/components-and-props.html#function-and-class-components
[built-in hooks]: https://reactjs.org/docs/hooks-reference.html
[custom react hooks]: https://reactjs.org/docs/hooks-custom.html
[context]: https://reactjs.org/docs/context.html
[lifted]: https://reactjs.org/docs/lifting-state-up.html
