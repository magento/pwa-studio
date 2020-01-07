---
title: Add a Static Route
---

## Overview

In this tutorial we will add a custom static route which loads your own custom REACT component.

## Adding the Static Route
 
To add a static rout we need to first override and customise the component responsible for rendering routes.

Copy the _App_ and _Routes_ components from the _@magento/venia-ui_ package.

```bash
mkdir src/components
cp -R node_modules/@magento/venia-ui/lib/components/App src/components/
cp -R node_modules/@magento/venia-ui/lib/components/Routes src/components/
```

Now lets correct the import statements within the _App_ component you just copied to use _@magento/venia-ui_ package, where necessary.

Open */src/components/App/app.js* and change the `import` statements to:
    - use the files from within your local *App/* directory.
    - use full `@magento/venia-ui/` paths for files you do not have in your local project.

So the beginning of the file will look something like the following:

```javascript
import React, { useCallback, useEffect } from 'react';
import { array, func, shape, string } from 'prop-types';

import { useToasts } from '@magento/peregrine';
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';

import { HeadProvider, Title } from '@magento/venia-ui/lib/components/Head';
import Main from '@magento/venia-ui/lib/components/Main';
import Mask from '@magento/venia-ui/lib/components/Mask';
import MiniCart from '@magento/venia-ui/lib/components/MiniCart';
import Navigation from '@magento/venia-ui/lib/components/Navigation';
import Routes from '../Routes';
import { registerMessageHandler } from '@magento/venia-ui/lib/util/swUtils';
import { HTML_UPDATE_AVAILABLE } from '@magento/venia-ui/lib/constants/swMessageTypes';
import ToastContainer from '@magento/venia-ui/lib/components/ToastContainer';
import Icon from '@magento/venia-ui/lib/components/Icon';

import {
    AlertCircle as AlertCircleIcon,
    CloudOff as CloudOffIcon,
    Wifi as WifiIcon,
    RefreshCcw as RefreshIcon
} from 'react-feather';
```

Next open */src/components/Routes/routes.js* and similarly change it's import statements something like the following:
```javascript
import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import MagentoRoute from '@magento/venia-ui/lib/components/MagentoRoute';

const CreateAccountPage = lazy(() => import('@magento/venia-ui/lib/components/CreateAccountPage'));
const Search = lazy(() => import('@magento/venia-ui/lib/RootComponents/Search'));
```

Next, in the same file, before the `MagentoRoute` route add the following static route with inline [JSX]:

```javascript
<Route exact path="/foo.html" render={() => <h3>Hello World JSX.</h3>}/>
```

Now, lets use your new custom _App_ component in your application by opening */src/index.js* and changing

```javascript
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
```
to
```javascript
import App, { AppContextProvider } from './components/App';
```

Browse to the /foo.html URL in the application.
![hello world jsx][]

## Creating a custom REACT component

Now we will replace the inline [JSX] with a custom REACT component.

Start by adding the following files...

*/src/components/Foo/index.js*
```javascript
export { default } from './Foo';
```

*src/components/Foo/Foo.js*
```javascript
import React, { Component } from 'react';
 
class Foo extends Component {
 
 
    componentDidMount() {
        document.title = 'Foo Test Page';
    }
    render() {
        return (
            <h1>Hello Foo Component</h1>
        );
    }
}
 
export default Foo;
```

Return to the routes.js file and import the Foo component and update the route you previously added with it.

*/src/components/Routes/routes.js*
```javascript

// place beneath the other import statements
const Foo = lazy(() => import('../Foo'));
 
// other code...
 
<Route exact path="/foo.html" component={Foo}/>
```

Browse to the _/foo.html_ URL in the application. 

## Learn More

-   [Introducing JSX][]
-   [Function and Class Components in REACT][]

[JSX]: https://reactjs.org/docs/introducing-jsx.html
[Link]: https://knowbody.github.io/react-router-docs/api/Link.html
[Introducing JSX]: https://reactjs.org/docs/introducing-jsx.html
[Function and Class Components in REACT]: https://reactjs.org/docs/components-and-props.html#function-and-class-components
[hello world jsx]: ./images/hello-world-jsx.png