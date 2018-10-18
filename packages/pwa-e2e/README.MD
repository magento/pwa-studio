# PWA E2E testing module

## how to launch

`npm i`

`npm test` - from current directory, or 

`cd packages/pwa-e2e && npm test` - from `pwa-studio` root

## how to generate docs

`npm run docs` - generate `docs` folder with you can open in browser locally without server

## how to debug

vscode.

Go to debug tab and run `launch` command. If you have to breakpoint, you might to stop on them

## Tech Stack

webdriver + protractor - executing steps for browsers

typescript - javascript that scales

cucumber - BDD frameword for describing test files

OOP oriental - for easy scaling

## Architecture overview

```
pwa-e2e
.
├──.vscode
| ├──launch.json <-- debug settings
| ├──tasks.json <-- pre debug hooks
├──docs <-- here is result 'npm run docs' command
├──config <-- configurations
| ├──environment.prod.ts
| ├──environment.dev.ts
| ├──protractor.conf.ts
|
├──logs <-- webdriver logs located here
|
├──reports <-- report here
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