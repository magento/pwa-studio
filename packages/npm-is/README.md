Detect the package manager client running the current script.
Detects NPM and yarn, as well as any hard executable path.

Use this when your project requires a specific package manager to work
correctly, such as a monorepo using Yarn workspaces.
It can help your package scripts exit early if they're being invoked outside of
the required package manager.

## Recommended Usage

In a monorepo, or any repo with `private: true`, it's safe to catch things as
early as possible.
Add a `preinstall` script to prevent the wrong package manager from even
beginning to install dependencies.

```diff
 {
   "name": "my-yarn-only-monorepo",
   "version": "1.0.0",
   "private": true,
   "workspaces": [
     "packages/*"
   ]
   "scripts": {
+    "preinstall": "yarn @magento/npm-is yarn"
   }
 }
```

Now, this happens when you try to `npm install`.

```sh
$ npm install

> my-yarn-only-monorepo@1.0.0 preinstall /Users/me/repo
> yarn @magento/npm-is yarn

/Users/me/repo/node_modules/npm-is/npm-is.js:54
    throw new WrongPackageManagerError(allowed, invoked);
    ^

Error: This project can only be used with the "yarn" package manager, but it was
invoked by "npm", which is not supported.
```

## Install

**Don't install this as a dependency if you're going to use it in the**
**[recommended way described above](#Recommended_usage).**

**Instead, run it with `npx` so that it works before dependencies are installed!**

But if you insist:

with npm: `npm install --save-dev npm-is`

with yarn: `yarn add --dev npm-is`

## Advanced Usage

### CLI

With no arguments, `npm-is` prints the current package manager.
So, running it outside a package manager with no arguments, it will print
nothing.
Running it inside an NPM script with NPM should print `npm` to the command line.

With arguments, `npm-is` will take each of its arguments to be
allowed package managers.
If the `preinstall` script is `"npm-is yarn npm"`, then install
will only succeed if the package manager in use is Yarn or NPM.
Only `npm` and `yarn` are currently supported as shorthand.
If you're using a custom package manager, you must know its exec path (that is,
the value of the environment variable `$npm_execpath` when it is running
lifecycle scripts) and pass that as an argument.
If the `preinstall` script is `"npm-is /path/to/pnpm`, then
install will only succeed if `$npm_execpath` is exactly `/path/to/pnpm`.

### Node API

```js
const npmIs = require("npm-is");

// returns true if Yarn
npmIs("yarn");
// returns true if Yarn or NPM
npmIs(["yarn", "npm"]);
// returns true if Yarn, NPM, or custom executable
npmIs(["yarn", "npm", "/some/custom/one"]);

// Throws instead of returning false
npmIs.assert("yarn");
npmIs.assert(["yarn", "npm"]);
npmIs.assert(["yarn", "npm", "/some/custom/one"]);

// Returns "npm" if NPM, "yarn" if Yarn,
// empty string if no package manager,
// or full execPath if anything else
npmIs.detect();
```
