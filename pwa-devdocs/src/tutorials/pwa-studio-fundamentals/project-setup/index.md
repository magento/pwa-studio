---
title: Project setup
adobeio: /tutorials/setup-storefront/
---

This tutorial provides the first steps for working with PWA Studio.
You will create a PWA Studio storefront project based on the [Venia concept storefront][] and configure it based on your environment.

To see a demo of the Venia concept storefront, see [venia.magento.com][].

By the end of this tutorial, you will know how to use the [scaffolding][] tool to generate an initial storefront project structure,
and you will have a storefront project setup ready for development.

## Check Node and Yarn versions

Verify your development environment has the minimum prerequisite versions of Node and Yarn installed:

-   [NodeJS >= 14.18.1](https://nodejs.org/en/)
-   [Yarn >= 1.13.0](https://yarnpkg.com)

Run the following commands in your terminal to identify which versions you have installed:

```bash
node -v
```

```bash
yarn -v
```

![prerequisites screen-shot][]

If entering these commands does not show you a version number, install Node.js, Yarn, or both.

## Run the scaffolding tool

In your terminal, navigate to the directory where you want to install your storefront project and run the scaffolding tool:

```bash
yarn create @magento/pwa
```

{: .bs-callout .bs-callout-info}
Both `npx @magento/create-pwa` and `npm init @magento/pwa` are alternatives commands for running the scaffolding tool.

Answer the questions from the interactive questionnaire in the terminal:

![interactive questionnaire screen-shot][]

After the scaffolding command completes, navigate to your project's root directory:

```bash
cd pwa-studio-fundamentals
```

The scaffolding command generates the minimum amount of files needed to run the Venia storefront.
The app it generates imports the entire Venia storefront as a single module, but
developers can replace this app with a custom implementation that uses pieces from the [Peregrine][] and Venia-UI libraries.

## Start the storefront application

Start the dev server:

```bash
yarn watch
```

This command starts the development server at [http://0.0.0.0:10000/][] and watches the file system for any changes.
When it detects a change, the application running in the browser updates with the change.
This is known as hot reloading.

Stop the PWA dev server by pressing **CTRL + C** in the running server's terminal window.

## Add a custom hostname and SSL cert

The previous step sets up a working React development environment, but
it is not ideal for developing PWA storefronts.

PWA features, such as service workers and push notifications, require HTTPS secure domains, so
your development environment should also be served over HTTPS to match closely with a production environment.

If you are working on multiple storefront projects, each project should have a custom hostname to prevent clashing with service workers or ports.

Fortunately, PWA Studio provides an easy method of creating a custom domain and SSL certificate for your local development environment.

Use the [`create-custom-origin`][] sub-command from the [buildpack CLI][] to create a custom hostname and SSL cert:

```bash
yarn buildpack create-custom-origin ./
```

{: .bs-callout .bs-callout-info}
This feature requires administrative access, so it may prompt you for an administrative password at the command line.
It does not permanently elevate permissions for the dev process but instead, launches a privileged subprocess to execute one command.

Now, when the development server starts, you are presented with a new and secure hostname and port.

![compiled successfully screen-shot][]

## Update environment variables (optional)

This step is optional because the scaffolding command already adds the required environment variables to the environment file.

If you want to change [environment variables][], such as `MAGENTO_BACKEND_URL` or `BRAINTREE_TOKEN`, update your project's `.env` file and change the property values.

## Troubleshooting

Apply these fixes to address common issues you may encounter during project setup.

-   If you get a node version error, verify you are using the correct node version.
    Early versions of PWA Studio are not compatible with node v12.
    Use a node version manager such as [n][] or [nvm][] to switch between different node versions.

-   If you are running into caching issues, clear the full application storage (not just the browser cache).

    For example, if you are using **Chrome**:

    1.  Open the _Developer Tools_
    2.  In the _Application_ tab, select _Clear Storage_ on the left navigation
    3.  Press the _Clear site data_ button

    ![clear storage][]

-   If your storefront is not getting data from Magento, verify the `MAGENTO_BACKEND_URL` in your `.env` file is accessible from your dev server.

-   If you get a _Privacy Error_ message in your browser, your project has an invalid or expired certificate.
    See the [PWA Buildpack troubleshooting][] page for a solution to this issue.

    ![privacy error][]

If you encounter any other issues, ask the Magento community in the [#PWA][] Slack channel.

## Next

[Explore the project structure][]

[scaffolding]: {%link pwa-buildpack/scaffolding/index.md %}
[peregrine]: {%link peregrine/index.md %}
[venia concept storefront]: {%link venia-pwa-concept/index.md %}
[`create-custom-origin`]: {%link pwa-buildpack/reference/buildpack-cli/create-custom-origin/index.md %}
[buildpack cli]: {%link pwa-buildpack/reference/buildpack-cli/index.md %}
[environment variables]: {%link pwa-buildpack/reference/environment-variables/core-definitions/index.md %}
[pwa buildpack troubleshooting]: {%link pwa-buildpack/troubleshooting/index.md %}#untrusted-ssl-cert
[interactive questionnaire screen-shot]: {%link tutorials/pwa-studio-fundamentals/project-setup/images/interactive-questionnaire.png %}
[prerequisites screen-shot]: {%link tutorials/pwa-studio-fundamentals/project-setup/images/prerequisites.png %}
[compiled successfully screen-shot]: {%link tutorials/pwa-studio-fundamentals/project-setup/images/compiled-successfully.png %}
[clear storage]: {%link tutorials/pwa-studio-fundamentals/project-setup/images/clear-storage.png %}
[privacy error]: {%link tutorials/pwa-studio-fundamentals/project-setup/images/privacy-error.png %}
[explore the project structure]: <{%link tutorials/pwa-studio-fundamentals/project-structure/index.md %}>

[venia.magento.com]: http://venia.magento.com/
[n]: https://github.com/tj/n
[nvm]: https://github.com/nvm-sh/nvm/
[#pwa]: https://magentocommeng.slack.com/messages/C71HNKYS2
[http://0.0.0.0:10000/]: http://0.0.0.0:10000/
