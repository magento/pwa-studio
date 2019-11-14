---
title: Create a tag list component
---

This tutorial provides the steps for creating a tag list component for a storefront.
For this tutorial, the tag list is added to the product details page in the Venia storefront.

## Prerequisites

Before you start this tutorial, make sure you have a storefront development environment set up.

The general steps provided by this tutorial can apply to different kinds of setup, but
the specific details assumes that you followed the steps in the [Venia storefront setup][] topic to set up a storefront for development.

## Step 1. Create component directory and files

Inside your project's directory for components, create a new directory called **TagList**.
In the `pwa-studio` project, this directory is `packages/venia-ui/lib/components`.

Inside the **TagList** directory, create empty files with the following names:

* `index.js`
* `tag.css`
* `tag.js`
* `tagList.css`
* `tagList.js`

{: .bs-callout .bs-callout-info}
These names follow the same [naming conventions][] used in the `pwa-studio` project.

## Step 2. Expose the module's public API

Open the component's `index.js` file and add the following content:

```js
export { default } from './tagList';
```

Exporting modules from your component's `index.js` file is a commond standard in a React project.
It allows a component to import this component using its directory name.
This is demonstrated in a later step.

## Step 3. Define the `Tag` module

Open the `tag.js` file and add the following content:

```jsx
import React from 'react';

// Use the prop-types module for type checking
import { string } from 'prop-types';

// This is a module responsible for rendering a single tag
const Tag = props => {

    // Destructure the props object into variables
    const { value } = props;

    // Return the tag string inside a list item element
    return (<li>{value}</li>);
}

// Define the props this component accepts
Tag.propTypes = {
    value: string
}

// Make this function the default exported module for this file
export default Tag;
```

This file defines the Tag component.
It is responible for rendering a single tag in the tag list.

## Step 4. Define the `TagList` module

Open the `tagList.js` file and add the following content:

```jsx
import React from 'react';

import { arrayOf, string } from 'prop-types';

// Import the previously defined Tag component
import Tag from './tag';

// This is the main tag list module
const TagList = props => {

    // Destructure the props object into variables
    const { tagArray } = props;

    // Convert the array of tag strings into a list of Tag components
    const tagList = tagArray.map(value => {
        return <Tag key={value} value={value} />;
    })

    // Returns the list of Tag components inside a div container
    return (<ul>{tagList}</ul>);
}

TagList.propTypes = {
    // tagArray is expected to be an array of strings
    tagArray: arrayOf(string)
}

export default TagList;
```

This file defines the main TagList component exported by the `index.js` file.
It accepts an array of strings and returns a `div` container with a list of tags.

## Step 5. Add component to the product details page

Find the component that renders the product details page in your storefront project and insert the TagList component into the page.

In the `pwa-studio` project, this component is defined in the following file:

``` text
packages/venia-ui/lib/components/ProductFullDetail/productFullDetail.js
```

At the top of this file, import the TagList component:

```jsx
import TagList from '../TagList';
```

If you are using the default Venia ProductFullDetail component you can insert TagList into the **Product Description** section:

```diff
 <section className={classes.description}>
     <h2 className={classes.descriptionTitle}>
         Product Description
     </h2>
     <RichText content={productDetails.description} />
+    <TagList tagArray={['Tag1', 'Tag2', 'Tag3']} />
 </section>
```

Now, when you visit a product detail page, it will show a list with the hard coded strings.

![TagList with hard coded strings](images/hard-coded-list.png)

## Step 6. Connect to real product data

To make this component useful, it needs to show actual product-specific data.
Clicking each tag should display other similarly tagged items.

For this tutorial, the TagList component will list the product's categories.

### Edit the GraphQL query

Venia's ProductFullDetail component gets the product data from the GraphQL query defined in:

```text
packages/venia-ui/lib/queries/getProductDetail.graphql
```

Edit this file and add the following:

```diff
 meta_title @include(if: $onServer)
 # Yes, Products have `meta_keyword` and
 # everything else has `meta_keywords`.
 meta_keyword @include(if: $onServer)
 meta_description @include(if: $onServer)
 
+categories {
+    name
+    url_path
+}
```

Appending this to the query adds a `categories` object to the returned data.
This object contains information on the name and URL paths for each category.

### Pass the categories data into the TagList component

Open the file for the product detail component and update the code:

```diff
 <section className={classes.description}>
     <h2 className={classes.descriptionTitle}>
         Product Description
     </h2>
     <RichText content={productDetails.description} />
-    <TagList tagArray={['Tag1', 'Tag2', 'Tag3']} />
+    <TagList categories={product.categories} />
 </section>
```

This replaces the hard coded data with actual product-specific data, but
now, the `tagArray` prop has been replaced with a `categories` prop that the component does not know how to handle.

### Refactor TagList

Open `tagList.js` and refactor the component:

```diff
 import React from 'react';
 
-import { arrayOf, string } from 'prop-types';
+import { arrayOf, shape, string } from 'prop-types';
 
 // Import the previously defined Tag component
 import Tag from './tag';
 
 // This is the main tag list module
 const TagList = props => {
 
     // Destructure the props object into variables
-    const { tagArray } = props;
+    const { categories } = props;
 
-    // Convert the array of tag strings into a list of Tag components
-    const tagList = tagArray.map(value => {
-        return <Tag key={value} value={value} />;
+    // Convert the array of category objects into a list of Tag components
+    const tagList = tagArray.map(keyword => {
+        return <Tag key={keyword.name} value={keyword.name} />;
     })
 
     // Returns the list of Tag components inside a div container
     return (<ul>{tagList}</ul>);
 }
 
 TagList.propTypes = {
     // tagArray is expected to be an array of strings
     tagArray: arrayOf(string)
 }
 
 export default TagList;
```

## Step 7. Incorporate other Venia components

## Step 8. Style the component

[venia storefront setup]: {%link venia-pwa-concept/setup/index.md %}

[naming conventions]: https://github.com/magento/pwa-studio/wiki/Project-coding-standards-and-conventions#file-naming-and-directory-structure
