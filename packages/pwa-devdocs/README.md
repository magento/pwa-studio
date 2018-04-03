# pwa-devdocs

This is the source code and documentation repository for the PWA Studios [documentation site].

The PWA DevDocs site is build using [Jekyll] and hosted using [GitHub Pages].
 
## Getting Started
 
Use the following instructions to build a local instance of the documentation.
 
### Prerequisites
 
* [Git]
* [NodeJS]
* [Ruby]
* [Bundler]
* [Yarn]
 
### Installation

1. Clone the repository. If you want to contribute, fork the repository and clone from your fork.
1. Change into the project root using the following command:
   ```
   cd pwa-devdocs
   ```
1. Run the following command to install the required Ruby libraries:
   ```
   bundle install
   ```
1. Run the following command to install the required node modules:
   ```
   yarn
   ```

### Build site

Run the following command to build and run the site locally:
```
gulp dev
```

If you just want to generate the HTML pages in the `_site` folder, run the following command:
```
gulp build
```
 
## Contributing
 
The PWA DevDocs repository is an open source project that welcomes [contributors] of all skill levels.
 
If you want to contribute to this project, please review the [contribution guidelines] and follow our [code of conduct].
 
## License
 
This project is licensed under OSL-3.0 - see the [LICENSE.txt] file for details.
 
[contributors]: .github/CONTRIBUTORS.md
[contribution guidelines]: .github/CONTRIBUTING.md
[code of conduct]: .github/CODE_OF_CONDUCT.md
[LICENSE.txt]: LICENSE.txt
[documentation site]: https://magento-research.github.io/pwa-devdocs/
[NodeJS]: https://nodejs.org
[Ruby]: https://www.ruby-lang.org/
[Bundler]: http://bundler.io/
[Yarn]: https://yarnpkg.com/en/
[Jekyll]: https://jekyllrb.com/
[GitHub Pages]: https://pages.github.com/ 
[Git]: https://git-scm.com/