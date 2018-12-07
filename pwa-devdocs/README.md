# pwa-devdocs

This is the source code and documentation repository for the PWA Studios [documentation site].

The PWA DevDocs site is build using [Jekyll] and hosted using [GitHub Pages].

## Getting Started

Use the following instructions to build a local instance of the documentation.

### Prerequisites

-   [Git]
-   [Node.JS]
-   [Ruby]
-   [Bundler]
-   [npm]

### Installation

1.  Clone the PWA Studio repository. If you want to contribute, fork the repository and clone from your fork.
2.  Change into the PWA Studio project root using the following command:
    ```
    cd pwa-studio
    ```
3.  Change into the **pwa-devdocs** directory using the following command:
    ```
    cd packages/pwa-devdocs
    ```
4.  Run the following command to install the required node modules for the project:
    ```
    npm install
    ```
5.  Run the following command to install the required Ruby libraries:
    ```
    bundle install
    ```

### Build site

In the **pwa-devdocs** directory, run the following command to build and run the site locally:

```
npm start
```

If you just want to generate the HTML pages in the `_site` folder, run the following command:

```
npm run build
```

## Contributing

This is an open source project that welcomes contributors of all skill levels.

If you want to contribute, please review the [contribution guidelines] and follow our [code of conduct].

## License

This project is licensed under OSL-3.0 - see the [LICENSE.txt] file for details.

[contribution guidelines]: ../../.github/CONTRIBUTING.md
[code of conduct]: ../../.github/CODE_OF_CONDUCT.md
[license.txt]: LICENSE.txt
[documentation site]: https://magento-research.github.io/pwa-studio/
[node.js]: https://nodejs.org
[ruby]: https://www.ruby-lang.org/
[bundler]: http://bundler.io/
[npm]: https://www.npmjs.com/
[jekyll]: https://jekyllrb.com/
[github pages]: https://pages.github.com/
[git]: https://git-scm.com/
