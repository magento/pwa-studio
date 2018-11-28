---
title: Create a simple peregrine app
---

In the [previous topic], you created configuration files for your theme project.
In this topic, you will create a simple app that follows the [Peregrine] pattern.

## Create app.js

1. Create the `src` and `src/components` directories in your theme's root directory using the following command:
    ``` sh
    mkdir -p src/components
    ```
1. Inside the `components` directory, create an `app.js` file with the following content:

   ``` jsx 
   import React from 'react';

    export default class App extends React.Component {
        render() {
            return (
                <h1>
                    Hello, Studio!
                </h1>
            );
        }
    }

   ```

   This code defines a React component that returns "Hello, Studio!" inside `h1` tags.

## Create index.js

Inside `src` create an `index.js` file with the following content:

``` javascript
import Peregrine from '@magento/peregrine';
import App from './components/app';

const app = new Peregrine();
const container = document.getElementById('root');

app.component = App;
app.mount(container);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(process.env.SERVICE_WORKER_FILE_NAME);
    });
}

export default app;
```

This imports the previously-defined `app` component and incorporates it into Peregrine before adding it to an HTML `root` element. 

## Create RootComponents directory

Inside `src`, create a `RootComponents` directory.
This directory will contain code for your root components.
For now, leave this directory empty.

## Congratulations!

You have created a Peregrine app skeleton!

If you followed the [Project setup tutorial] from the beginning, you can now run the following command in the root of your theme directory to finish setting up your development environment:

``` sh
npm start
```

If you experience problems with the project setup, see [Troubleshooting].

[previous topic]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/create-configuration-files/index.md %}
[Peregrine]: {{ site.baseurl }}{% link peregrine/index.md %}
[Project setup tutorial]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/index.md %}
[Troubleshooting]: {{ site.baseurl }}{% link pwa-buildpack/troubleshooting/index.md %}
