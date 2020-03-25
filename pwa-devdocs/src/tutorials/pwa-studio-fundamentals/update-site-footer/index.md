---
title: Update Site Footer
---

## Overview

In this tutorial we are going to override the _Main_ and _Footer_ components so that we can add a custom link to our site.

# Add a link to the Footer

Copy the _Main_ and _Footer_ components from the _@magento/venia-ui_ package.

```bash
cp -R node_modules/@magento/venia-ui/lib/components/Main src/components/
cp -R node_modules/@magento/venia-ui/lib/components/Footer src/components/
```

Then update the `import` statements for these components to be something like:

_src/components/Footer/footer.js_

```javascript
import React from 'react';
import { shape, string } from 'prop-types';
import { useFooter } from '@magento/peregrine/lib/talons/Footer/useFooter';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './footer.css';
import GET_STORE_CONFIG_DATA from '@magento/venia-ui/lib/queries/getStoreConfigData.graphql';
```

_src/components/Main/main.js_

```javascript
import React from 'react';
import { bool, shape, string } from 'prop-types';
import { useScrollLock } from '@magento/peregrine';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Footer from '../Footer';
import Header from '@magento/venia-ui/lib/components/Header';
import defaultClasses from './main.css';
```

In _src/components/App/app.js_ change:

```javascript
import Main from '@magento/venia-ui/lib/components/Main';
```

To:

```javascript
import Main from '../Main';
```

Now the Project should load our new Footer component.  To add a link to the footer, we need to add React's Link element which we get via [venia-ui/lib/drivers][]:  

```javascript
import { Link } from '@magento/venia-ui/lib/drivers';
```

Finally add the below JSX to render the Link for the _foo.html_ static route:

```jsx
<div className={classes.tile}>
    <p className={classes.tileBody}>
        <Link to="/foo.html">Foo Demo Page</Link>
    </p>
</div>
```

![foo footer link][]

[venia-ui/lib/drivers]: https://github.com/magento/pwa-studio/tree/develop/packages/venia-ui/lib/drivers
[foo footer link]: ./images/foo-footer-link.png
