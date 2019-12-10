---
title: Project Set-Up
---

## Overview

We are going to create a PWA Studio app with the scaffolding mechanism available with 
the `yarn create @magento/pwa` command.

This command will create a PWA Studio app based on the Venia Storefront (Concept). 
You can see a demo of this storefront at at [venia.magento.com][].   

The scaffolding command will only generate the minimum amount of files necessary, 
it will use the modular components available from 
the _venia-concept_, _venia-ui_, _peregrine_ and _pwa-buildpack_ packages.    

In subsequent tutorials we will replace some of these modular components with our own custom ones.

### Prerequisites

Before installing and running your PWA Studio app make sure you have the minimum prerequisites installed.

1.   [NodeJS >=10.14.1 LTS](https://nodejs.org/en/)
1.   [Yarn >=1.13.0](https://yarnpkg.com)

Open up your terminal and run:

```bash
node -v
```

```bash
yarn -v
```

The output of each of these commands should be a version number. 
Your versions may not be the same as those shown below!    
If entering these commands doesn’t show you a version number, you will need to install Node.js and Yarn.

![prerequisites screen-shot][]

### Install & Run

Open your terminal and choose a directory on your local machine to install your Magento PWA Studio app.
```bash
mkdir pwa-studio-fundamentals
```

```bash
cd pwa-studio-fundamentals/
```

_* Make note of the full path for this directory. You will be asked for this after your run the next command._

From this directory, run the following _Yarn_ command to generate your PWA Studio app. 
```bash
yarn create @magento/pwa
```

{: .bs-callout .bs-callout-info}
The `npm init @magento/pwa` command may also be used, but in this tutorial we will be using _Yarn_ instead of _NPM_.

During the installation answer the questions from the interactive questionnaire in the terminal.
![interactive questionnaire screen-shot][]

Once the install command is finished you can start your app with:

```bash
yarn watch
```

After which your PWA Studio app will be available by default at [http://0.0.0.0:10000/](http://0.0.0.0:10000/).

Stop the PWA dev server by pressing the **ctrl** & **c** buttons together 
from the terminal window which you ran the `yarn watch` command from.

### Add custom hostname and SSL cert
In the previous step we set-up your PWA Studio project to be served with `http`.
For a better development experience it should be served with `https` as this is a basic requirement of all PWAs
and will be required in your production environment.

Fortunately PWA Studio offers an easy method of creating a custom domain to be served over `https`
in your local development environment.

From the root directory of your project simply run:

```bash
yarn buildpack create-custom-origin ./
```

Now start the app once more with:

```bash
yarn watch
```

After a few moments, when your app has compiled successfully, you will see links in the terminal to the 
new custom domain for your PWA Studio app.

![compiled successfully screen-shot][]

{: .bs-callout .bs-callout-info}
The `watch` command starts the PWA development server which includes features such as hot reloading to 
enhance the developer experience.

### Update Environment Variables 
This step is optional as the `@magento/pwa` scaffolding command adds the required environment variables automatically.

However if you wish to change your Magento backend URL & braintree payment gateway credentials, 
they can be update in your local _./.env_ file by changing the properties for `MAGENTO_BACKEND_URL` and `BRAINTREE_TOKEN`.

## Troubleshooting

-    Make sure you are using the correct node version.  Early versions of PWA Studio are not compatible with node v12.     
     Consider using a node version manager such as [n][].
-    Clear the full application storage, not just the browser cache.
     In the _Chrome_ browser this can be done by opening the _Developer Tools_    
     and from the _Application_ tab select _Clear Storage_ on the left side navigation
     and pressing the _Clear site data_ button.
     ![clear storage][]
-    Make sure the `MAGENTO_BACKEND_URL` from your local _./.env_ file is accessible.
-    Still having issues? Ask the Magento community in the [#PWA][] slack channel or [Magento Stack Exchange].

## Learn More

-   [Venia Storefront (Concept)][]
-   [PWA Studio Scaffolding][]
-   [Modular Components][]
-   [Magento theme vs PWA storefront][]

[Venia Storefront (Concept)]: {%link venia-pwa-concept/index.md %}
[Modular Components]: {%link venia-pwa-concept/features/modular-components/index.md %}
[Magento theme vs PWA storefront]: {%link technologies/theme-vs-storefront/index.md %}

[interactive questionnaire screen-shot]: ./images/interactive-questionnaire.png
[prerequisites screen-shot]: ./images/prerequisites.png
[compiled successfully screen-shot]: ./images/compiled-successfully.png
[clear storage]: ./images/clear-storage.png

[venia.magento.com]: http://venia.magento.com/
[n]: https://github.com/tj/n
[#PWA]: https://magentocommeng.slack.com/messages/C71HNKYS2
[Magento Stack Exchange]: https://magento.stackexchange.com/

<!-- TODO: Update with correct URL -->
[PWA Studio Scaffolding]: https://github.com/magento/pwa-studio/blob/develop/pwa-devdocs/_drafts/scaffolding/index.md

