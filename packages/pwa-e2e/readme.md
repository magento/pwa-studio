# pwa-e2e
![Tested with TestCafe](https://img.shields.io/badge/tested%20with-TestCafe-2fa4cf.svg)
## General overview
This package execute functional tests for `pwa-studio`.

## General commands

1) `npm test` - run all tests
2) `npm run build:js` - build application through babel 7(link to babel)
3) `npm run build` - build typescript declarations and after all it run `npm run build:js`(see previous point)

## Additional commands

1) `npm run docs` - generate static documentation and locate it on the root of `pwa-e2e` package. Documentation has html format and you can open it through browser
2) `npm run lint` - launch linter for check errors
3) `npm run testcafe-static-analyser` - launch static analyzer for previous run of testcafe. This command help analyze previous run and metadata

## Architecture overview

``` txt
pwa-e2e
.
├──.vscode
|  ├──launch.json <-- debug settings
├──docs <-- here is result 'npm run docs' command
|
├──reports <-- reports located here
|
├──src
|  |
|  ├──components <-- PWA components logic
|  |  ├──abstract.component.ts <-- basic component. High order function. Each component has root selector
|  |    ├──common
|  |    |   ├──index.ts
|  |    |   ├──cart.component.ts
|  |    |
|  ├──config <-- configurations
|  |    ├──environment.ts
|  |
|  ├──models <-- describing models which you can use on pages for filling
|  |  ├──model.ts
|  |  ├──checkout.model.ts <-- each model might inherit from current
|  |
|  ├──pages <-- pages, every page have a 'url' and 'title'
|  |  ├──abstract.page.ts <-- high order function, each page have 
|  |  ├──home.page.ts
|  |
|  ├──tests <-- folder with tests
|  |  ├──checkout.spec.ts <-- checkout test
|  |
├──.env.dist <-- environment variables, change name to .env
├──package.json
├──readme.md
├──tsconfig.json <-- typescript options here
├──tslint.json <-- like jslint, but for typescript
├──typedoc.js <-- tool for autogeneration documentation based on code comments
```

## Tech Stack
[`typescript`](https://www.typescriptlang.org) - javascript that scales

[`testcafe`](http://devexpress.github.io/testcafe/) - A Node.js tool to automate end-to-end web testing

[`testcafe-react-selectors`](https://github.com/DevExpress/testcafe-react-selectors) - TestCafe selector extensions for React apps

## Q&A
Q: testcafe is a selenium-based framework?

A: testcafe is a not selenium-based framework, so it has own implementation and removes dependencies such as java and selenium server, since testcafe it has own solution and implementation

Q: Why we choose typescript?

A: Typescript is a JavaScript that scales, if you watch a features, which javascript get from the last 3-4 years, you can see that is was been from `tc39` committee. And javascript creating more object-oriental principles.
By the way, we're all humans and make a mistakes(types too), and typescript fix problem with typings.
Nevertheless, javascript is a valid typescript. If you want to migrate them from js, you might to see official guides how you can do it.

Q: Why we need to create `index.ts` file?
 A: we need to export our code to parent module for better visualizing and usage.
``` ts
import { A } from 'modules/moduleA'
```
instead of
``` ts
import { A } from 'modules/moduleA/moduleA'
```

