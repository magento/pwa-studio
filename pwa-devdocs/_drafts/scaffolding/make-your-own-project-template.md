---
title: make-your-own-project-template
---

<!-- ATTN JC: This is a draft document; the API being described is not public yet. -->

Venia has a `_buildpack` folder in its project root. That `_buildpack` folder contains a script called `create.js`.
The presence of this file tells Buildpack that `venia-concept` can be used as a template for the [`buildpack create-project`](./create-project.md) command.
Inside `packages/venia-concept/_buildpack/create.js`, Venia defines a configuration that Buildpack will use when cloning it to a new directory.
It does this in the `_buildpack/create.js` file by returning an object with `ignore`, `visitor`, and `after` properties.
Buildpack knows how to use those properties to begin a file copy operation.

Instead of copying all files simple to the directory, Buildpack runs them through a tree-walking interface which emits events whenever a file or directory is encountered.
This allows Venia to declare custom functions for copying files which need particular modifications.

When you run `npx @magento/pwa-buildpack create-project ./projdir --template venia-concept`, Buildpack will load the `_buildpack/create.js` file and pass it an instance of the [`fs-extra` library](https://www.npmjs.com/package/fs-extra).
This enhanced filesystem object provides utilities for most of the common copy operations.
Buildpack will then begin reading files from the template package, one at a time so they can pass through the `visitor` defined in `_buildpack/create.js`.
The visitor specifies which handling functions should run for which glob patterns, thus running different types of copy operation for differently matched files in the template project.
For instance, a visitor which treats `package.json` specially might look like this:

```js
{
  visitor: {
    'package.json': ({ path, targetPath, options }) => {
      const pkg = fs.readJsonSync(path);
      pkg.name = options.name;
      fs.writeJsonSync(targetPath, JSON.stringify(pkg, null, 4));
    }
  }
}
```

This callback function would run when the copy stream encounters `package.json` in the template directory.
Rather than simply copy it to the new destination, Buildpack will pass the file path to the glob that matches it, and allow the visitor's methods to perform the final read/modify/write.
