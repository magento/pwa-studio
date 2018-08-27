# UPWARD Specification

**U**nified **P**rogressive **W**eb **A**pp **R**esponder **D**efinitions are simple files describing how a web server delivers and supports a [Progressive Web Application][pwa def]. They denote server behavior in a platform-independent way, so that a PWA client application expecting certain behavior from HTTP endpoints can be deployed on any type of tech stack that implements the UPWARD specification.

See [RATIONALE.md](RATIONALE.md) for a detailed explanation of the context that led to the introduction of UPWARD, and the problems it intends to solve.

See [EXECUTION_SCHEDULING_STRATEGIES.md](EXECUTION_SCHEDULING_STRATEGIES.md) for a deep dive into how the core logic of an UPWARD-compliant server might be implemented with a state machine.

See [UPWARD_MAGENTO.md](UPWARD_MAGENTO.md) for context on how UPWARD fills a need in Magento PWA Studio and Magento 2 frontend development.

1. [UPWARD Specification](#upward-specification)
  1. [Quickstart](#quickstart)
  2. [Summary](#summary)
    1. [Simple example](#simple-example)
  3. [Configuration](#configuration)
  4. [Responding to requests](#responding-to-requests)
    1. [Execution scheduling and ordering](#execution-scheduling-and-ordering)
    2. [Cyclic dependencies](#cyclic-dependencies)
    3. [Response flush triggering](#response-flush-triggering)
  5. [Context Reference](#context-reference)
    1. [Initial context](#initial-context)
      1. [Augmenting the initial context](#augmenting-the-initial-context)
      2. [Context persistence and size](#context-persistence-and-size)
  6. [Resolver Reference](#resolver-reference)
    1. [InlineResolver](#inlineresolver)
      1. [InlineResolver Configuration Options](#inlineresolver-configuration-options)
    2. [FileResolver](#fileresolver)
      1. [FileResolver Configuration Options](#fileresolver-configuration-options)
      2. [Parsing](#parsing)
      3. [FileResolver Error Handling](#fileresolver-error-handling)
      4. [FileResolver shorthand](#fileresolver-shorthand)
    3. [ServiceResolver](#serviceresolver)
      1. [ServiceResolver Configuration Options](#serviceresolver-configuration-options)
      2. [Example REST service call](#example-rest-service-call)
      3. [Response Assignment](#response-assignment)
      4. [ServiceResolver Error Handling](#serviceresolver-error-handling)
    4. [TemplateResolver](#templateresolver)
      1. [TemplateResolver Configuration Options](#templateresolver-configuration-options)
      2. [Template Engines](#template-engines)
        1. [Example React DOM Server support](#example-react-dom-server-support)
      3. [TemplateResolver Error Handling](#templateresolver-error-handling)
    5. [ConditionalResolver](#conditionalresolver)
      1. [ConditionalResolver Configuration Options](#conditionalresolver-configuration-options)
      2. [Matchers](#matchers)
      3. [Match context](#match-context)
      4. [ConditionalResolver notes](#conditionalresolver-notes)
  7. [Reducing boilerplate](#reducing-boilerplate)
    1. [Default parameters](#default-parameters)
    2. [Builtin constants](#builtin-constants)
    3. [Resolver type inference](#resolver-type-inference)
    4. [YAML anchors](#yaml-anchors)

## Quickstart

This repository is a test suite for UPWARD compliance, testing several scenarios and features on a live web server. It requires NodeJS v8 LTS or later. To test an UPWARD server:

:warning: _(This feature is not yet implemented.)_

1. Install the `npx` utility to run global NPM commands:

    ```sh
    npm install -g npx
    ```

2. Write or obtain a POSIX shell script which:

   - gets the path to an `upward.yml` file from the environment variable `UPWARD_PATH`
   - launches and/or binds the UPWARD server under test and runs it in the foreground (not as a daemon process).
   - prints the hostname and port of the now-running server instance to standard out
   - responds to SIGTERM by gracefully closing the server

   [Example here.][spec-shell-script]

3. Use `npx` to run `upward-spec` on your shell script

    ```sh
    npx upward-spec ./test_my_upward.sh
    ```

4. The shell script will run for each test suite with the environment variable `UPWARD_YAML` set to the path of a fixture `upward.yml` file for configuring a server instance. The script should launch a server (on a local port or a remote port, but resolvable to the local system) and print its host to standard out, staying in the foreground.

    The tests run in parallel. When each test suite is over, the script will receive a SIGTERM or SIGKILL.

5. The test suite will print results to stdout; the argument `--junit` will make it print JUnit-compatible test result XML to stdout.

## Summary

UPWARD files are XML, YAML or JSON files which declare the behavior of an [application shell][application shell] server. An application shell server implements a strict subset of HTTP functionality: it handles an HTTP GET request for a resource and delivers enough code and data to bootstrap a Progressive Web App which displays that resource.

An App Shell is purposefully minimal, and so is an UPWARD server. It is meant to initialize or refresh sessions, deliver small HTML documents with enough server-side rendering for initial display and SEO, and then hand off subsequent request handling to the PWA running in the client.

The declarative format of UPWARD means that an UPWARD-compliant server may be written in any programming language and run on any tech stack; therefore, a PWA can declare its own runtime network dependency by including an UPWARD file.

### Simple example

This example `upward.yml` echoes request data as text back to the client.

```yaml
status:
  resolver: inline
  inline: 200
headers:
  resolver: inline
  inline:
    content-type: text/plain
body:
  resolver: template
  engine: mustache
  template:
    resolver: inline
    inline: |
      {{#request}}
      Headers:
          {{#headerEntries}}
          {{key}}: {{value}}
          {{/headerEntries}}
      URL:
          {{#url}}
          protocol: {{protocol}}
          host: {{host}}
          hostname: {{hostname}}
          port: {{port}}
          pathname: {{pathname}}
          {{/url}}
      URL Query:
          {{#url.queryEntries}}
          {{key}}: {{value}}
          {{/url.queryEntries}}
      {{/request}}
```

This trivial example demonstrates the initial properties of the context object, populated by the originating HTTP request. describes a server which always returns status 200 with a single header, `content-type`, and a text body which is a plaintext summary of the GET request properties.

## Configuration

A spec-compliant UPWARD server should be configurable with a runtime parameter: the location of the `upward.yml` file. The file references external resources using [Resolvers](#resolvers).

## Responding to requests

**An `upward.yml` file is an instruction manual for building an HTTP response.** It assembles values in a global namespace hereafter called the **context**. The context object begins with the incoming `Request` assigned to the context value `request`, and current environment variables assigned to the context value `env`. Root properties of `upward.yml` represent other named values in the context, which Resolvers populate. Resolvers can use other context properties as input, and they can also use other Resolvers directly; in this way, the context itself can be considered a decision tree.

### Execution scheduling and ordering

1. **Resolvers must execute only when needed.** If a request handling cycle moves through ConditionalResolver branches in a way that never requires a particular context value, then that context value must never be resolved during that execution cycle.

1. **Resolvers must execute as concurrently as possible**. The maximum concurrency is left to the implementation. A compliant server detects when a Resolver uses a context value, and delays its execution until that context value becomes available, via [topological sorting][topological ordering] of resolver execution. To manually design serial workflows, you must use `after` properties in Resolvers to delay their execution until a given context value is available.

See [EXECUTION_SCHEDULING_STRATEGIES.md](EXECUTION_SCHEDULING_STRATEGIES.md) for an example of how this could be implemented.

### Cyclic dependencies

**An UPWARD server must detect cyclic dependencies, and should detect them as soon as possible**. Only bare string literals can be used to reference context objects in `upward.yml`, so it should be possible to detect potential cyclic dependencies upon first processing the configuration file, before any requests are made. If a cyclic dependency is detected in this manner, the server should raise an error on startup. If a cyclic dependency occurs at runtime, the server should return a 500 error.

### Response flush triggering

**The root context must always eventually have `status`, `headers`, and `body` properties.** Once the context has these three properties, the UPWARD-compliant server should immediately use those three values to create an HTTP response and flush it to the client. No streaming or buffering interface should be provided; UPWARD servers should not deal in data large enough to require streaming. **If all resolvers finish executing and the response is lacking any of the `status`, `headers`, or `body` properties, the server should emit a 500 error.** If it is possible at startup time to trace a path through the decision tree where this occurs, the implementation should do so and raise an error on startup.

## Context Reference

The context is a global namespace created for each request. It is a dictionary of values, like a JSON object. A typical response cycle may append intermediate values to the context, like a query result or a template string. Those values do not emit as part of the response. Only the `status`, `headers`, and `body` properties of the context will be flushed to the client. Since the context is the global namespace and the means of sharing values between resolvers, it may become a large object at some points in the cycle, but this should not affect performance on the client.

Context values cannot be overwritten. A resolver which attempts to overwrite an already-set context value must raise a context conflict error. UPWARD-compliant servers should be able to identify potential context conflict errors during static analysis of the `upward.yml` file and raise an error on launch. UPWARD-compliant servers must be able to identify a context conflict during runtime execution and respond with a 500 error.

### Initial context

When an UPWARD-compliant server receives an HTTP GET request, it must populate an initial context object with the following values:

- `request`: an object representing the incoming HTTP request. It must have these properties:

  - `headers`: An object representing HTTP headers. Header names are lower-cased, and multiple values are joined with commas.

  - `headerEntries`: An iterable array version of the `headers` object, suitable for use in a Mustache template (which cannot iterate over plain JSON objects). For this headers object:
    ```json
    {
      "accept": "text/html",
      "host": "example.com"
    }
    ```
    the `headerEntries` array would be:
    ```json
    [
      { "name": "accept", "value": "text/html" },
      { "name": "host", "value": "example.com" }
    ]
    ```

  - `url`: A [URL record][url spec] as specified by WHATWG, consisting of as many of the following propeties as the server can determine from the request and its own environment:

    | Attribute | Example
    | --------- | -------
    | `href`    | `https://admin:12345@example.com:8080/foo/bar?baby=beluga`
    | `origin`  | `https://example.com:8080`
    | `protocol`| `https:`
    | `username`| `admin`
    | `password`| `12345`
    | `host`    | `example.com:8080`
    | `hostname`| `example.com`
    | `port`    | `8080`
    | `pathname`| `/foo/bar`
    | `search`  | `?baby=beluga`
    | `query`   | `{ "baby": "beluga" }`
    | `queryEntries` | `[{ "name": "baby", "value": "beluga" }]`

    Because HTTP servers are sometimes unable to ascertain their own domain names or origins, it is acceptable for one or more of the `href`, `origin`, `protocol`, `username`, `password`, `host`, `hostname`, and `port` properties to be undefined. However, a compliant server MUST provide `pathname`, `search`, `query`, and `queryEntries`.  

    The `query` and `queryEntries` properties are not prt of the WHATWG specification, but they must be included in the `url` object nevertheless. Much like the `headers` and `headerEntries` properties, these objects exist for property lookup and iteration, respectively.

- `env`: an object containing the environment variables set when the server was launched. For instance, if a Dockerfile launches the server through Apache, with an environment variable MAGENTO_GRAPHQL_ENDPOINT:

    ```dockerfile
    ENV MAGENTO_GRAPHQL_ENDPOINT https://m2host.com/graphql
    CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
    ```

    then the context value `env.MAGENTO_GRAPHQL_ENDPOINT` would equal `"https://m2host.com/graphql"`.

- `GET`: the string `'GET'`, included in the global context for convenience, to [reduce boilerplate](#reducing-boilerplate)

- `POST`: the string `'POST'`, included in the global context for convenience, to [reduce boilerplate](#reducing-boilerplate)

- `mustache`: the string `'mustache'`, included in the global context for convenience, to [reduce boilerplate](#reducing-boilerplate)

- Other strings that must be preset as literals in the context include:

  - `text/html`
  - `text/plain`
  - `application/json`
  - `utf-8`
  - `latin-1`
  - `base64`
  - `hex`
  - All valid HTTP response codes, i.e. `200`, `404`, `500`, and all others.

#### Augmenting the initial context

All operations and resolvers augment the initial context. Legal context property names must follow the same rules as [JavaScript identifiers][js identifiers]; they must consist of alphanumeric characters, `$` or `_`, and they must not begin with a number.

Include context values by simply setting them with inline resolvers at the top level:

```yaml
react:
  resolver: inline
  inline: react
```

Now, you can name the template engine directly instead of resolving the name as a literal string. In UPWARD configuration, **a bare string represents the context value by that name.**

```diff
body:
  resolver: template
+ engine: react
- engine:
-   resolver: inline
-   inline: react
```

THe context may be augmented with complex values as well:

```yaml
customRenderers:
  resolver: inline
  inline:
    react:
      resolver: inline
      inline: reactDOMServer
    vue:
      resolver: inline
      inline: vuejs
```

The context will include the property `customRenderers`, whose value matches the JSON object:

```json
{
  "react": "reactDOMServer",
  "vue": "vuejs"
}
```

In UPWARD configuration, **a bare string with dots, e.g. `customRenderers.react`, should perform lookup on nested context values.** _(In contrast, UPWARD context lookup cannot refer to individual list items.)_

```diff
body:
  resolver: template
+ engine: customRenderers.react
- engine:
-   resolver: inline
-   inline: react
```

See [Reducing boilerplate](#reducing-boilerplate) for more practices to reduce verbosity in `upward.yml`.

#### Context persistence and size

When writing `upward.yml`, no distinction needs to be made between "persistent" context values that should be the same for each request, and other values that may differ for each request. An UPWARD server must do topological sorting to determine the order in which to run Resolvers, so an efficient implementation can identify the parts of the root context that are not dependent on the incoming request and cache or discard them.

## Resolver Reference

A Resolver is an object which describes how a value is obtained. There are five kinds of Resolver:

- `InlineResolver` adds hardcoded values
- `FileResolver` loads files from a filesystem
- `ServiceResolver` places GraphQL queries and loads the result set
- `TemplateResolver` renders a template string against the context
- `ConditionalResolver` does branch logic using pattern matching on context values

Each Resolver takes different configuration parameters.

### InlineResolver

There is sometimes a need to put literal values in the context. However, a string property value performs a context lookup:

```yaml
body: 'Hello world!'
```

The above expression uses `Hello world!` as a property name and tries to substitute the value of the context property named `Hello world!`. This is likely not the intent of the user. To set the `body` to the literal string 'Hello world!', use an `InlineResolver`:

```yaml
body:
  resolver: inline
  inline: 'Hello world!'
```

The `inline` of an InlineResolver may be of any type; it may be a primitive value, a list, or an object of arbitrary depth. List values and Object properties may be context lookups or resolvers themselves, so when building lists or objects, make sure to use InlineResolvers again at every other level of depth. _(A consequence of this is that it is difficult and verbose to set a literal value resembling a resolver configuration, such as `{ "resolver": "inline" }`, but this seems to be a minor inconvenience.)_

#### InlineResolver Configuration Options

| Property | Type | Default | Description
| -------- | ---- | ------- | ---------------------------------------------
| `inline`    | `any`|         | _Required._ The value to be assigned to context.

### FileResolver

Queries and templates are often large, and often reused by other systems. They can be inline strings, as in the [first example](#simple-example), but they should usually be separate files, referenced with a `FileResolver`.

```yaml
query:
  resolver: file
  file:
    resolver: inline
    inline: './productDetail.graphql'
  charset:
    resolver: inline
    inline: 'utf-8'
```

The above expression loads the content of the file `./productDetail.graphql` and sets it as the property `query`. The file path is resolved relative to the location of the `upward.yml` file. The `charset` property is optional.

#### FileResolver Configuration Options

| Property | Type       | Default | Description
| -------- | ---------- | ------- | ---------------------------------------------
| `file`     | `Resolved<string>` |         | _Required_. Path to the file to be read. Resolved relative to the `upward.yml` file.
| `charset`  | `Resolved<string>` | `utf-8` | Character set to use when reading the file as text. Can be `utf-8`, `latin-1`, or `binary`.
| `parse`    | `Resolved<string>` | `auto`  | Attempt to parse the file as a given file type. The default of `auto` should attempt to determine the file type from its extension. The value `text` will effectively disable parsing. The values `graphql`, `mustache`, `yaml`, and `json` should force parsing the file as those respective file types.
| `fallback` | `Resolved<string>` |         | If this value is set, it will be used if there is a problem reading or parsing the file. Errors will be swallowed instead of surfaced.
| `after`    | `string` |         | Manually override topological sorting. If this value is set to a string, the resolver will not run until the named context value is set, or until all pending Resolvers have run.

#### Parsing

An UPWARD server must support pre-parsing of `graphql`, `mustache`, `yaml`, and `json` files, but should support as many filetypes as possible and may support custom filetypes.

#### FileResolver Error Handling

If the file cannot be found or there were any other failures reading the file, the resolver must resolve an object with a single `errors` property instead of a string or a parsed value. Errors must be formatted like [GraphQL errors][graphql spec errors property].

:information_source: _(File contents are not expected to change during server runtime, so an UPWARD-compliant server should cache file contents on startup.)_

#### FileResolver shorthand

Filenames will usually be specified as literals, rather than dynamically resolved out of context. For readability and convenience, a "shorthand syntax" must be available to imply a FileResolver that loads and parses a UTF-8 encoded file from a string filesystem path. Instead of explicitly resolving a filepath as an inline string:

```yaml
query:
  resolver: file
  file:
    resolver: inline
    inline: './path/to/file.graphql'
```

The shorthand syntax should allow the following to be equivalent:

```yaml
query: './path/to/file.graphql'
```

An UPWARD-compliant server must treat a barestring as a literal filepath instead of a context lookup when:

- The string is being argued to a configuration parameter that accepts a FileResolver for the implied type of the file after parsing

  AND

- The string begins with one of the following prefixes:
  - a relative path prefix, `./` and/or one or more `../`
  - an absolute path prefix, `/` or `C:\` or any other Windows drive letter
  - a file URI scheme, `file://`

  AND

- Upon checking the filesystem, the string resolves to a [regular file][regular file] (not a symlink, device, or directory)

In the latter case, if the shorthand string neither resolves to a legal file, nor exists as a resolvable context value, an UPWARD-compliant server should raise a detailed error message explaining this.

### ServiceResolver

An UPWARD server uses a `ServiceResolver` to obtain live data from a GraphQL backing service. URL, method, and headers can be specified manually; the query itself is constructed using `query` and `variables` parameters.

```yaml
documentResult:
  resolver: service
  url:
    resolver: inline
    inline: 'https://example.com/graphql'
  method:
    resolver: inline
    inline: POST
  headers:
    resolver: inline
    inline:
      'content-type': 'application/json'
      accept: 'application/json'
      # A small inline template renders the full syntax of the OAuth Bearer
      # token header, instead of just the plain token.
      authorization:
        resolver: template
        engine: 'mustache'
        template:
          resolver: 'inline'
          inline: 'Bearer {{env.BEARER_TOKEN}}'
  query:
    resolver: inline
    inline: 'query getDocument($id: String!) {
      document(id: $id) {
        title
        contents
      }
    }'
  variables:
    # This is a barestring indicating a context lookup. It resolves to the `id`
    # value in the URL query string of the request, using the builtin `request`
    # context object.
    id: request.url.query.id
```

:information_source: _(For the purposes of demonstration, the query here is resolved inline. The best practice is to store queries in files and use FileResolvers to obtain them.)_

#### ServiceResolver Configuration Options

| Property  | Type               | Default                     | Description
| --------- | ------------------ | --------------------------- | ---------------
| `url`       | `Resolved<string>` | `https://localhost/graphql` | _Required_. The URL of the service endpoint to call.
| `method`    | `Resolved<string>` | `POST`                      | The HTTP method to use. While GraphQL queries are typically POSTS, some services expose GraphQL over GET instead.
| `headers`   | `Resolved<Object<string,string>>` |              | Additional HTTP headers to send with the GraphQL request. Some headers are set automatically, but the `headers` configuration can append to headers that can have multiple values.
| `query`     | `Resolved<Query|string>` |                       | _Required_. The GraphQL query object. Can either be a parsed query, or a string that can be parsed as a valid query.
| `variables` | `Object<string,Resolved<any>>` | `{}`            | Variables to use with the GraphQL query. Must be an object with literal keys; the names of variables cannot be dynamically resolved, since a GraphQL query's possible variables are known ahead of time.
| `after`    | `string` |         | Manually override topological sorting. If this value is set to a string, the resolver will not run until the named context value is set, or until all pending Resolvers have run.

**ServiceResolvers always use GraphQL.** To obtain data from a non-GraphQL service, an UPWARD server may implement client-side directives which change the behavior of a GraphQL query, such as [apollo-link-rest][apollo-link-rest], and place the directives in the query itself. This should be transparent to the UPWARD server itself, which delegates the service call to a GraphQL client. If an UPWARD server's GraphQL client has no implementation for such a directive, then it must pass the query unmodified to the backing service to handle the directive.

#### Example REST service call

The below behavior is not standard or normative: it is an example of how one might query a REST service using an UPWARD server whose GraphQL client implementation has a `@rest` directive like [apollo-link-rest][apollo-link-rest].

```yaml
documentResult:
  resolver: service
  url: env.REST_API_ENDPOINT
  method:
    resolver: inline
    inline: GET
  headers:
    # In contrast to the template above, this assumes that en environment
    # variable is already set with the "Bearer <token>" format.
    authorization: env.BEARER_TOKEN_STRING
  query: 'query getDocument($id: String!) {
      document(id: $id) @rest(type: "Document", path: "/documents/{args.id}") {
        title
        contents
      }
      links(documentId: $id) {
        name
        url
      }
    }'
  variables:
    id: request.url.query.id
```

#### Response Assignment

The GraphQL specification requires that a successful response to a GraphQL query have a [root "data" property][graphql spec data property], an object whose properties correspond to the entities returned, and an that a failed response have a [root "errors" property][graphql spec errors property]. **An UPWARD server must assign the entire root object to the named context value.** The query above would, if successful, result in a context with `documentResult.data.document` and `documentResult.data.links` properties. If the query failed, the context would contain `documentResult.errors`.

#### ServiceResolver Error Handling

The GraphQL specification [defines error behavior][graphql spec errors] clearly, and UPWARD servers should pass the `errors` collection from a GraphQL response as described above. Other errors can occur during resolution, such as:

- Network errors: the URL is unresolvable or unresponsive
- Parse errors: a dynamically supplied `query` could not be parsed
- Validation errors: required variables were absent or the wrong type

An UPWARD server should format these errors the same way that GraphQL services do; it should return an object with an `errors` array containing all errors encountered.

### TemplateResolver

Once the UPWARD server assembles the data for a response, it must turn that data into a response body. The `TemplateResolver` renders a template into a string, executing it with the context object as its root value by default. UPWARD servers must provide a Mustache template renderer that adheres to the [Mustache specification][mustache spec]. UPWARD servers can also provide other template renderers, which must evaluate context objects into strings.

```yaml
status:
  resolver: inline
  inline: 200
headers:
  resolver: inline
  inline:
    'content-type':
      resolver: inline
      inline: 'text/html'
body:
  resolver: template
  engine:
    resolver: inline
    inline: mustache
  root: documentResult.data.document
  template:
    resolver: inline
    inline: |
      {{> headtag}}
      {{> header}}
      <div class="document">
        <h1>{{title}}</h1>
        <div class="document-body">
          {{& contents}}
        </div>
      </div>
      {{> footer}}
```

The above configuration resolves into an HTML document displaying content from the `documentResult.data.document` context value. Its use of [Mustache partials][mustache partials] implies that additional files called `headtag.mst`, `header.mst`, and `footer.mst` exist in the directory containing `upward.yml`. Attempting to include a missing partial should raise an error as soon as the template is resolved, ideally at server startup time.

:information_source: _(For illustrative purposes, the above uses an InlineResolver where it would be more appropriate to use a FileResolver to obtain the template, as with the query in the ServiceResolver example.)_

#### TemplateResolver Configuration Options

| Property  | Type               | Default                     | Description
| --------- | ------------------ | --------------------------- | ---------------
| `engine`    | `Resolved<string>` |                             | _Required_. The label of the template engine to use.
| `root`      | `Resolved<any>`    | _[context]_                 | The root value to use as context when rendering the template.
| `template`   | `Resolved<Template|string>` |              | The template to render. Required by the `mustache` engine.
| `after`    | `string` |         | Manually override topological sorting. If this value is set to a string, the resolver will not run until the named context value is set, or until all pending Resolvers have run.

#### Template Engines

The `engine` property must resolve to a string labeling a supported template engine. The only required template engine is Mustache, and its label must be `mustache`. An UPWARD server may support additional template engines. For instance, an UPWARD server may support [ReactJS server-side rendering][react dom server]. Such a template engine may require additional properties, which can be added to the TemplateResolver object itself.

##### Example React DOM Server support

```yaml
body:
  resolver: template
  engine:
    resolver: inline
    inline: react
  props:
    document: documentResult.data.document
    query: request.url.query
  component:
    resolver: file
    file:
      resolver: inline
      inline: './build/RootComponents/Document.js'
```

The above configuration assumes support for a template engine labeled `react`. Where the `mustache` template engine takes `root` and `template` properties, the `react` template engine takes `props` and `component` properties. The underlying template engine could be a simple Node module:

```js
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');

module.exports = (props, component) =>
  renderToString(createElement(require(component), props));
```

#### TemplateResolver Error Handling

If the engine is unknown or not supported, the UPWARD server should detect this as soon as possible and send a 500 error.

If there were any errors parsing the template, evaluating, or serializing the data, the resolver must resolve an object with an `errors` array instead of a rendered string. Errors must be formatted like [GraphQL errors][graphql spec errors property].

### ConditionalResolver

A ConditionalResolver tests a context value for a particular pattern, and then yields to another Resolver depending on the match results.

The ConditionalResolver is the only branch logic operation available in the UPWARD specification. It performs pattern matching on a context value using [Perl compatible regular expressions][pcre]. It can only test a single context value for each potential match, and it has no Boolean operators such as AND, OR, or NOT. All of these logical operations can be achieved through pattern matching, however. It takes two configuration values: `when` must be a list of `Matcher<Resolver<T>>>`, and `default` must be a resolver to use if none of the `when` conditions are true.

```yaml
monkey:
  resolver: conditional
  when:
    # All values are coerced to strings for regex matching.
    - matches: request.url.query.grab
      pattern: '^(true|1)$'
      use:
        resolver: inline
        inline: "do anyway"
    - matches: status
      pattern: '^403$'
      use:
        resolver: inline
        inline: "see"
  default:
    resolver: inline
    inline: "do"
status:
  resolver: inline
  inline: 403
body:
  resolver: template
  engine:
    resolver: inline
    inline: mustache
  template:
    resolver: inline
    inline: "<p>monkey <b>{{ monkey }}</b>.</p>"
```

The above configuration uses a ConditionalResolver to create a context value `monkey`. The `when` list contains two matchers. They are executed in order. The first matcher tests if the request query string has a value `grab` matching the regular expression `^(true|1)$`, If the request query string contains `grab=true` or `grab=1`, this matcher succeeds and the ConditionalResolver yields to the resolver specified in the matcher's `use` property. The context now matches the object:

```json
{
  "status": 403,
  "monkey": "do anyway",
  "body": "<p>monkey <b>do anyway</b></p>"
}
```

If the request query string does not contain a qualifying `grab` property, the second matcher runs. This matcher tests if the `status` context value matches the regular expression `^403$`, effectively checking if the response status code has already been set to HTTP 403 Forbidden. The `status` resolver runs before the `monkey` resolver, though it is defined later in the document (see [Concurrency](#concurrency)), so the matcher tests against the value `403` (cast to a string) and succeeds. The ConditionalResolver uses the matcher's resolver, and the context now matches the object:

```json
{
  "status": 403,
  "monkey": "see",
  "body": "<p>monkey <b>see</b></p>"
}
```

If some other configuration provides a different `status`, such as `200`, then neither matcher in the `when` list  succeeds, and the ConditionalResolver uses its `default` resolver. The context now matches the object:

```json
{
  "status": 200,
  "monkey": "do",
  "body": "<p>monkey <b>do</b></p>"
}
```

#### ConditionalResolver Configuration Options

| Property  | Type               | Default     | Description
| --------- | ------------------ | ----------- | ---------------
| `when`    | `Matcher[]` |      |             | _Required_. The list of matchers to test against context.
| `default` | `Resolved<any>`    |             | _Required_. The default resolver to use if no matcher succeeds.
| `after`    | `string` |         | Manually override topological sorting. If this value is set to a string, the resolver will not run until the named context value is set, or until all pending Resolvers have run.

#### Matchers

A `Matcher` is an object which can only be used as an item in a ConditionalResolver's `when` list. It must have the following properties:

| Property  | Type               | Default | Description
| --------- | ------------------ | ------- | ---------------
| `matches` | `string`           |         | _Required_. The context value to match. Must be a bare string context lookup.
| `pattern` | `string`           |         | _Required_. [PCRE][pcre] regular expression to use to test against the value in `matches`.
| `use`     | `Resolved<any>`    |         | _Required_. Resolver to use if the match succeeds.

#### Match context

During the resolution of a matcher's `use` resolver, properties from the match object are temporarily added to the context. Using these temporary context values, resolvers can extract matching text, or capture groups, from the match itself.

- `match.$0` - The full text of the last matched value.
- `match.$1` - The string captured in the first backreference the regex declared.

The `match` object must have additional numbered properties for each backreference.

#### ConditionalResolver notes

- Matchers run in sequence, top to bottom. They do not "fall through"; the first
  successful matcher will exit the conditional.
- Matchers can only test against context properties; they cannot use a resolver as the `matches` value.
- Each matcher can test only one context property against one pattern.
  - However, the pattern can use regex alternation to achieve OR-type logic.
  - Additionally, a list of matchers need not each test the same property.
- The `default` resolver is required.
- To achieve AND-like logic, nest ConditionalResolvers to arbitrary depth.
- To achieve OR-like logic, repeat the same resolver configuration in several subsequent matchers.
- If the conditional becomes verbose, consult [Reducing Boilerplate](#reducing-boilerplate) for ways to simplify it.
- Though template engines with logical operators can be also be used to perform branch logic, this is not recommended; it can prevent static analysis of context value dependencies.

## Reducing boilerplate

The above examples are fairly verbose, to make the workings of UPWARD configuration especially clear. The UPWARD specification is intentionally verbose in its canonical format, to enable maximal static analysis. However, An UPWARD-compliant server must also include features to reduce boilerplate.

### Default parameters

Many resolver configuration parameters have default values, so they can be omitted from configuration if the default is appropriate.

In the first example of a [ServiceResolver](#serviceresolver) above, some config parameters are actually unnecessary. The default URL for a service call is `http://localhost/graphql`, and the default method is `POST`. MIME headers are automatically generated, so the following configuration would be equivalent:

```yaml
documentResult:
  resolver: service
  headers:
    resolver: inline
    inline:
      Authorization: env.BEARER_TOKEN
  query:
    resolver: inline
    inline: 'query getDocument($id: String!) {
      document(id: $id) {
        title
        contents
      }
    }'
  variables:
    id: request.url.query.id
```

Using the best practice of storing queries in separate files and storing reusable objects as separate context values, the configuration would likely look like this:

```yaml
documentQuery: './queries/document.graphql'
oauthHeaders:
  resolver: inline
  inline:
    authorization: env.BEARER_TOKEN

documentResult:
  resolver: service
  headers: oauthHeaders
  query: documentQuery
  variables:
    id: request.url.query.id
```

### Builtin constants

The default context must contain some builtin constants for common strings, to avoid repetitive use of InlineResolvers.

In the first example of a [TemplateResolver](#templateresolver) above, some inline resolvers are unnecessary. HTTP response codes, common MIME types, common template engine labels, and other useful values must be preset in the initial context, so the following, shorter configuration is equivalent to the TemplateResolver example:

```yaml
status: 200
headers:
  resolver: inline
  inline:
    'content-type': 'text/html'
body:
  resolver: template
  engine: 'mustache'
  root: documentResult.data.document
  template:
    resolver: inline
    inline: |
      {{> headtag}}
      {{> header}}
      <div class="document">
        <h1>{{title}}</h1>
        <div class="document-body">
          {{& contents}}
        </div>
      </div>
      {{> footer}}
```

### Resolver type inference

For any value which must be a Resolver or a context lookup, an UPWARD-compatible server should attempt to infer resolver types from a supplied resolver configuration object, rather than requiring a `resolver` name to be specified. Each resolver has required parameters that are mutually exclusive with one another, so a resolver type can be inferred from the presence of those parameters.

| If parameter exists... | Then infer resolver type:
| ---------------------: | :-----------------------:
| `inline` | `InlineResolver`
| `file` | `FileResolver`
| `query` | `ServiceResolver`
| `engine` | `TemplateResolver`
| `when` | `ConditionalResolver`

Resolver type inference allows configuration to omit `resolver:` parameters, which makes it possible to be far more terse. The example optimized configuration in [Builtin constants](#builtin-constants) could be further reduced:

```yaml
status: 200
headers:
  inline:
    'content-type': 'text/html'
body:
  engine: 'mustache'
  root: documentResult.data.document
  template:
    inline: |
      {{> headtag}}
      {{> header}}
      <div class="document">
        <h1>{{title}}</h1>
        <div class="document-body">
          {{& contents}}
        </div>
      </div>
      {{> footer}}
```

And the example optimized configuration in [Default parameters](#default-parameters) could be further reduced:

```yaml
documentResult:
  headers:
    inline:
      authorization: env.BEARER_TOKEN
  query: './queries/document.graphql'
  variables:
    id: request.url.query.id
```

:information_source: _(Note that the `variables` object cannot be a resolver, as specified in [ServiceResolver configuration options](#serviceresolver-configuration-options) &mdash; it must be an object whose keys are expected query variable names and whose values are resolvers, so there is no ambiguity if a GraphQL query expects a variable named, for example, `file`.)_

### YAML anchors

The YAML specificationsupports an [anchor and reference syntax][yaml anchors] which can also be used to shorten configuration files. While this can be used as part of legal YAML parsing, its use is discouraged by UPWARD files, since context resolution is clearer to the reader. Additionally, not all parsers support references in the same way, so the feature should be used with caution.

[apollo-link-rest]: <https://www.apollographql.com/docs/link/links/rest.html>
[application shell]: <https://developers.google.com/web/fundamentals/architecture/app-shell>
[pwa def]: <https://developers.google.com/web/progressive-web-apps/>
[js identifiers]: <https://developer.mozilla.org/en-US/docs/Glossary/Identifier>
[npx]: <https://github.com/zkat/npx>
[spec-shell-script]: <./test_my_upward.sh>
[yaml anchors]: <https://learnxinyminutes.com/docs/yaml/>
[pcre]: <https://en.wikipedia.org/wiki/Perl_Compatible_Regular_Expressions>
[graphql spec data property]: <http://facebook.github.io/graphql/June2018/#sec-Data>
[graphql spec errors property]: <http://facebook.github.io/graphql/June2018/#sec-Errors>
[mustache spec]: <https://github.com/mustache/spec>
[mustache partials]: <https://mustache.github.io/mustache.5.html#Partials>
[react dom server]: <https://reactjs.org/docs/react-dom-server.html>
[topological sorting]: <https://en.wikipedia.org/wiki/Topological_sorting>
[url spec]: <https://url.spec.whatwg.org/#url-class>
[regular file]: <http://www.livefirelabs.com/unix_tip_trick_shell_script/unix_operating_system_fundamentals/file-types-in-unix.htm>
