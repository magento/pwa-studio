# PWADevServer

Utility for configuring a development OS and a `webpack-dev-server` for PWA
development.

## Usage

In `webpack.config.js`:

```js
const path = require('path');
const buildpack = require('@magento/pwa-buildpack');
const PWADevServer = buildpack.Webpack.PWADevServer;

module.exports = async env => {
    const config {
        /* webpack entry, output, rules, etc */

        devServer: await PWADevServer.configure({
            publicPath: '/',
            provideSecureHost: true,
            graphqlPlayground: {
              queryDirs: ['src/queries']
            }
        })
    };

    config.output.publicPath = config.devServer.publicPath;

    return config;
}
```

- ⚠️ `PWADevServer.configure()` is async and returns a Promise, so a webpack
    config that uses it must use the [Exporting a Promise configuration type](https://webpack.js.org/configuration/configuration-types/#exporting-a-promise).
    The newer `async/await` syntax looks cleaner than using Promises directly.
- ⚠️ The emitted `devServer` object may have a custom `publicPath`. For best
    ServiceWorker functionality, set `config.output.publicPath` to this value
    once the `devServer` is created and before creating a ServiceWorker plugin.

### Purpose

The typical webpack local development scenario uses [the devServer settings in
`webpack.config.js`](https://webpack.js.org/configuration/dev-server/) to create
a temporary local HTTP server for showing edits in real time.

PWA development has a couple of particular needs:

- The host must be _secure_ and _trusted_ to allow ServiceWorker operation
- The host must be _unique_ to prevent ServiceWorker collisions

Furthermore, Magento PWAs are Magento 2 themes running on Magento 2 stores, so
they need to proxy backend requests to the backing store in a customized way.

PWADevServer handles all these needs:

- Creates and caches a custom local hostname for the current project
- Adds the custom local hostname to `/etc/hosts`   🔐
- Creates and caches an SSL certificate for the custom local hostname
- Adds the certificate to the OS-level keychain so browsers trust it  🔐
- Adds verbose debugging information to error pages
- Provides a [GraphQL Playground][graphql-playground] to debug the GraphQL
  queries in the project

*The 🔐  in the above list indicates that you may be asked for a password at
this step.*

### API

`PWADevServer` has only one method: `.configure(options)`. It returns a Promise
for an object that can be assigned to the `devServer` property in webpack
configuration.

#### `PWADevServer.configure(options: PWADevServerOptions): Promise<devServer>`

#### `PWADevServerOptions`

- `publicPath: string`: **Required.** The public path of project assets in the
   backend server, e.g. `'/'`.
- `provideSecureHost: boolean | SecureHostOptions`: Use a [secure and unique hostname for the dev server.](#securehostoptions)
- `graphqlPlayground: GraphQLPlaygroundOptions`: Add a [pre-populated GraphQL Playground to the dev server.](#graphqlplayground)
- `id: string`: :no_entry_sign: **_Deprecated._** A unique ID for this project. This id will be used to create your dev domain name. Setting `id: 'foo'` is equivalent to:

  ```js
  provideSecureHost: { subdomain: 'foo', addUniqueHash: false }
  ```

#### `SecureHostOptions`

Most local development servers run on `http://localhost`, with a constant port
number like `3000` or `8080`. This common setup is problematic for PWA work:

- Browsers only enable PWA features like ServiceWorkers on secure HTTPS.
- Browsers cache PWAs by "scope", which is an origin plus a path (usually `/`).
  Running all local development projects at a common domain, such as
  `https://localhost:8000`, will cause conflicts between ServiceWorkers.
  
To solve these problems, enable autogeneration of a unique secure host using the
`provideSecureHost` configuration option. PWADevServer generates the unique
hostname based on the project name in `package.json` if available, or a
custom name if provided. It also uses a hash of the filesystem path of the
project to choose a persistent unique port and append a short random sequence
to the domain name. Since this port and string are derived from the
filesystem path, they will stay the same unless the project is moved.

:information_source: If PWADevServer detects that the project port is in use,
it will print a warning and use a different port temporarily.

Configuration options for this feature are:

- `subdomain: string`: A custom subdomain string to use. If provided, this
  supersedes the name in `package.json`.
- `exactDomain: string` A fully qualified domain to use. By default,
  PWADevServer generates all unique hosts as subdomains of `local.pwadev`. Use
  this option to override this behavior and provide the exact domain to use.
  The custom host will not have a unique hash, but it will have a unique port.
- `addUniqueHash: boolean`: Use the filesystem path hash to create a short
  string of URL-safe characters to append to the subdomain. Ensures total
  uniqueness of domain. Default `true`. If `exactDomain` is specified, this
  option has no effect.

:information_source: Default behavior is to use the `package.json` plus hash
as a subdomain of `local.pwadev`. To use this default behavior, simply set
`provideSecureHost: true`.

:information_source: There is no configuration option for disabling unique port
generation and use. To override the port for one session, use the environment
variable `PWA_STUDIO_PORTS_DEVELOPMENT` to specify a port.
  
:information_source: The first time the DevServer runs, it will prompt you for
system password. It needs temporary permission to edit the hostfile and trust
the SSL certificate. Use the login password for your computer.

#### `GraphQLPlaygroundOptions`

[GraphQL Playground][graphql-playground] is an enhanced version of GraphiQL, an
in-browser GraphQL debugging tool. PWADevServer can provide a Playground
at the special path `/graphiql`. To enable it, add the `graphqlPlayground`
configuration option.

Configuration options for this feature are:

- `queryDirs: string[]`: A list of directories containing GraphQL files in your
  project. If you provide this list, PWADevServer will scan these directories
  for `.graphql` files, and prepopulate the playground with a new tab for each
  query it finds.
  
:information_source: To enable the feature without providing queryDirs, simply
set `graphqlPlayground: true`.


[graphql-playground]: <https://github.com/prisma/graphql-playground>
