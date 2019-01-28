---
title: Storybook testing
---

[Storybook][] is an independent application that lets you view and test UI components outside of a project.
It also serves as a library for all the UI components in a project and how they look in isolation under different conditions.

Currently, the Peregrine package is the only project set up to use Storybook as a development and testing environment for its UI components.

{: .bs-callout .bs-callout-info }
**Note:**
This topic only goes over the basics of using Storybook and how it is integrated with the PWA Studio project.
For more detailed information and topics on Storybook, see the [official Storybook documentation][] site.

## Where to create Storybook stories

In PWA Studio, Storybook is configured to look for files in a `__stories__` directory.  
This directory should be created in the same directory as UI components, and
Storybook files should have the same name as the components they test.

## Writing Storybook stories

Storybook uses what it calls a __story__ to represent a visual test case.
A story contains a single state for a component, and 
multiple stories for a component make up a storybook file that the Storybook application uses to present the different states of a component.

Storybook stories should cover the different visual states and behaviors of a component under different conditions.

### Add stories

Use the `storiesOf` module to create a list of stories for a specific component.

The following code imports the `storiesOf` module and creates a list object for stories for a component called `MyComponent`.

``` jsx
import { storiesOf } from '@storybook/react';

const stories = storiesOf('MyComponent', module);
```

Use the `add()` method on the list object to add stories for Storybook.
The method accepts the name of the story as the first parameter and a function that returns the component to render as the second parameter.

``` jsx
stories.add(
    'MyStory',
    () => <MyComponent text="Hello World!" />
);
```

### Documentation

Since Storybook can also be used to generate a reference guide for components, it also includes reference documentation that describe the component and its props.
This documentation lives in a markdown file inside a separate `__docs__` directory.


Use the `withReadme` module from the `storybook-readme` add-on to include reference documentation with your stories:

``` jsx
...
import { withReadme } from 'storybook-readme';
import docs from '../__docs__/MyComponent.md';
...
...
stories.add(
    'MyStory',
    withReadme(docs, () => <MyComponent text="Hello World!" />)
);
```

### Storybook file example

The following is an example of a Storybook file for the **Price** component:

``` jsx
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import Price from '../Price';
import docs from '../__docs__/Price.md';

const stories = storiesOf('Price', module);

stories.add(
    'USD',
    withReadme(docs, () => <Price value={100.99} currencyCode="USD" />)
);

stories.add(
    'EUR',
    withReadme(docs, () => <Price value={100.99} currencyCode="EUR" />)
);

stories.add(
    'JPY',
    withReadme(docs, () => <Price value={100.99} currencyCode="JPY" />)
);

stories.add(
    'Custom Styles',
    withReadme(docs, () => {
        const classes = {
            currency: 'curr',
            integer: 'int',
            decimal: 'dec',
            fraction: 'fract'
        };
        return (
            <div>
                <style>{`
                    .curr { color: green; font-weight: bold; }
                    .int { color: red; }
                    .dec { color: black; }
                    .fract { color: blue; }
                `}</style>
                <Price value={100.99} currencyCode="USD" classes={classes} />
            </div>
        );
    })
);
```

## Run the Storybook application

While the Storybook application is running, you can navigate to it in your browser to view the stories and manually test the components.

Use the following command in the root directory of the Peregrine package to run Storybook:

``` sh
yarn run storybook
```

This command starts the Storybook application that is accessed through the browser at the following address:

``` sh
http://localhost:9001/
```

[Storybook]: https://storybook.js.org/
[official Storybook documentation]: https://storybook.js.org/basics/introduction/
