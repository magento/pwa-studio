# PWA E2E testing module

## Status: [![CircleCI](https://circleci.com/gh/vitalics/Protractor-CircleCi.svg?style=svg)](https://circleci.com/gh/vitalics/Protractor-CircleCi)

## how to launch

Install the testing module dependencies using the following command:

`npm install`

launch the testing module using `test` command:

`npm test`

Or if you want to run on headless mode use the next command:

`npm run test:ci`

## Useful tips and commands

`npm run docs` - generate `docs` folder with you can open in browser locally without server

### debug tips

if you use `vscode`, you can switch to debug tab and run `launch` command. If you have to breakpoint, you might to stop on them. Feel free to enabling extensions, since is not impact on the result

## Tech Stack

[`protractor`](https://www.protractortest.org/#/) - executing steps for browsers

[`typescript`](https://www.typescriptlang.org) - javascript that scales

[`di-typescript`](https://www.npmjs.com/package/di-typescript) - dependency injection for typescript

[`cucumber`](https://github.com/cucumber/cucumber-js) - BDD frameword for describing test files

[`cucumber-tsflow`](https://www.npmjs.com/package/cucumber-tsflow) - describing cucumber scenarios with decorators instead of functions

## Architecture overview

``` txt
pwa-e2e
.
├──.vscode
| ├──launch.json <-- debug settings
| ├──tasks.json <-- pre debug hooks
├──docs <-- here is result 'npm run docs' command
├──config <-- configurations
| ├──hooks.ts <-- protractor hooks located here
| ├──environment.ts
| ├──protractor.conf.ci.ts <-- ci config with enabled headless option
| ├──protractor.conf.common.ts <-- config with common configuration
| ├──protractor.conf.ts <-- config which run locally
|
├──logs <-- webdriver logs located here
|
├──reports <-- reports here
|
├──src
|  |
|  ├──components <-- PWA components logic
|  |  ├──abstract.component.ts <-- basic component
|  |    ├──ComponentFolder1
|  |    |   ├──index.ts
|  |    |   ├──Component1.ts
|  |    |
|  |
|  ├──features <-- BDD features, describe steps
|  |  ├──checkout.feature
|  |  ├──addictional.feature
|  |
|  ├──models <-- describing models which you can use on pages for filling
|  |  ├──model.ts
|  |  ├──user.model.ts <-- each model might inherit from current
|  |
|  ├──pages <-- pages, every page have a 'url' and 'title'
|  |  ├──abstract.page.ts
|  |  ├──home.page.ts
|  |
|  ├──services
|  |  ├──http.service.ts
|  |  ├──another.service.ts
|  |
|  ├──stepdefinitions <-- folder which implementing feature files
|  |  ├──base.definition.ts <-- here located before/after hooks
|  |
|  ├──Common
|  |  ├──some.common.definition.ts <-- here definitions which are repeated
|  |
|  ├──Home
|  |  ├──home.definition.ts
|  |  ├──another.home.definition.ts
|  |
|  ├──testcases <-- test cases, for defferent asserting
|  |  ├──test.case.ts <-- base test case
|  ├──home
|  |  ├──home.case.ts <-- constant with predefined values
|  |  ├──index.ts
|  ├──checkout
|  |  ├──default.case.ts
|  |  ├──special.case.ts
|  |  ├──index.ts
|  |
|  ├──utils <-- helpers
|  |  ├──protractor
|  |  | ├──element.ts
|  |  | ├──elements.ts
|  |  | ├──index.ts
|  |  ├──ioc.ts <-- dependency injection
├──.editorconfig
├──.gitignore
├──package.json
├──readme.md
├──tsconfig.json <-- typescript options here
├──tslint.json <-- like jslint, but for typescript
├──typedoc.js <-- tool for autogeneration documentation based on code comments
```

## Q&A

Q: How i can distinguish utils and services?

A: Utils is a not scalable polyfill for existing solution. Such as `timerify` decorator in performance folder. You cannot extend this function by yourself, if you want to change logic for them, you need to create another function or change existing.

Q: Why `http.service.ts` is as "service".

A: if you need to fetch some info(for example product), you need to implement `product.service.ts` or `product.http.service.ts` and inside them, you need to inherit from `http.service.ts` and describe your types

Q: Why we choose typescript?

A: Typescript is a JavaScript that scales, if you watch a features, which javascript get from the last 3-4 years, you can see that is was been from `tc39` commitee. And javascript creating more object-oriental principles.
By the way, we're all humans and make a mistakes(types too), and typescript fix problem with typings
Nevertheless, javascript is a valid typescript. If you want to migrate them from js, you might to see official guides how you can do it.

Q: Why we need to create `index.ts` file?

A: we need to export our code to parent module for better visualizing.
``` ts
import { A } from 'modules/moduleA'
```
instead of
``` ts
import { A } from 'modules/moduleA/moduleA'
```
or
``` ts
import { A } from 'modules/moduleA/moduleA.ts'
```