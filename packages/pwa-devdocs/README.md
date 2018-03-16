# pwa-devdocs

The project repository for the Magento PWA developer documentation site.

The PWA DevDocs site is build using [Jekyll] and hosted using [GitHub Pages].

## Building this site

### Step 1: Install tools

This project requires the following tools:

* [Ruby]
* [Bundler]
* [Yarn]

### Step 2: Install libraries

Run the following command to install the required ruby libraries:
```
> bundle install
```

Run the following command to install the required yarn packages:
```
> yarn install
```

### Step 3: Build site

Run the following command to build and run the site locally:
```
> gulp dev
```

If you just want to generate the HTML pages in the `_site` folder, run the following command:
```
> gulp build
```

[Ruby]: https://www.ruby-lang.org/
[Bundler]: http://bundler.io/
[Yarn]: https://yarnpkg.com/en/
[Jekyll]: https://jekyllrb.com/
[GitHub Pages]: https://pages.github.com/ 