---
title: Resolvers
---

A Resolver is an object that describes how a value is obtained.

List of available Resolvers:

-   [InlineResolver][] - adds hardcoded values
-   [FileResolver][] - loads files from a filesystem
-   [ServiceResolver][] - places GraphQL queries and loads the result set
-   [TemplateResolver][] - renders a template string against the context
-   [ConditionalResolver][] - does branch logic using pattern matching on context values
-   [ProxyResolver][] - delegates request/response handling to a proxy
-   [DirectoryResolver][] - delegates request/response handling to a static file directory

Each Resolver takes a different set of configuration parameters.

Like a context lookup string, a resolver represents an operation which executes and delivers its results upward in the tree.
This process continues until all dependencies of the top-level `status`, `headers`, and `body` definitions are resolved.

## InlineResolver

Use an **InlineResolver** wherever you need a literal string value in the context.

| Property | Type  | Default | Description                                     |
| -------- | ----- | ------- | ----------------------------------------------- |
| `inline` | `any` |         | _Required._ The value to assign to the context. |
{: style="table-layout:auto" }

A normal string property value performs a context lookup, so
an entry that looks like the following:

```yml
body: 'Hello World!'
```

is interpreted as an attempt to substitute the value of the context property `Hello World!`.

The following is the correct way to define a literal string value for a context property:

```yml
body:
    resolver: inline
    inline: 'Hello World!'
```

The `inline` property can be any type, such as a primitive value, a list, or an Object of arbirtrary depth.
List values and Object properties may be context lookups or resolvers themselves, so
when building lists or objects, use `InlineResolver` at every level of depth.

## FileResolver

Use a **FileResolver** to load content from a file.
This is useful for loading queries and templates, which are reused by other systems.

{: .bs-callout .bs-callout-info}
File contents are not expected to change during server runtime, so an UPWARD-compliant server should cache file contents on startup.

| Property   | Type               | Default | Description                                                                                   |
| ---------- | ------------------ | ------- | --------------------------------------------------------------------------------------------- |
| `file`     | `Resolved<string>` |         | _Required._ Path of the file to read relative to the definition file                          |
| `encoding` | `Resolved<string>` | `utf-8` | Character set to use when reading the file as text. Examples: `utf-8`, `latin-1`, or `binary` |
| `parse`    | `Resolved<string>` | `auto`  | Parse the file as a given file type.                                                          |
{: style="table-layout:auto" }

```yml
query:
    resolver: file
    file:
        resolver: inline
        inline: './path/to/file.graphql'
```

### Parsing

When the `parse` option is set to `auto`, it tells the server to determine the file type based on its extension.
Setting the value of `parse` to `text` disables parsing.

An UPWARD server must support pre-parsing of graphql, json, and mustache files according to their respective specifications.
It should also support as many filetypes as necessary and any custom filetypes.

### FileResolver error handling

If the file cannot be found or are other failures while reading the file, the resolver must resolve an object with a single errors property instead of a string or a parsed value.
Errors must be formatted like [GraphQL errors][].

### FileResolver shorthand

Filenames are usually specified as literals instead of variables that are dynamically resolved.
For readability and convenience, a "shorthand syntax" is available to imply a FileResolver that loads and parses a `UTF-8` encoded file from a string filesystem path.

A shorthand equivalent for the previous example would look like:

```yml
query: './path/to/file.graphql'
```

An UPWARD-compliant server implementation must treat a regular string as a literal filepath instead of a context lookup when the following conditions are true:

-   The string is an argument for a configuration parameter that accepts a FileResolver for the implied type of the file after parsing.
-   The string begins with one of the following prefixes:

    -   a relative path prefix: `./` and/or one or more `../`
    -   an absolute path prefix: `/` or `C:\` or any other Windows drive letter
    -   a file URI scheme: `file://`

-   Upon checking the filesystem, the string resolves to a [regular file][] (not a symlink, device, or directory).
    If the check does not resolve to a legal file, nor exists as a resolvable context value, an UPWARD-compliant server should raise a detailed error message explaining this.

## ServiceResolver

Use a **ServiceResolver** to obtain live data from a GraphQL backing service.
The values for URL, method, and headers are specified manually, and
the query itself is constructed using the `query` and `variables` parameters.

| Property    | Type                              | Default                     | Description                                                                                                                                                                        |
| ----------- | --------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`       | `Resolved<string>`                | `https://localhost/graphql` | _Required._ The URL of the service endpoint to call.                                                                                                                               |
| `method`    | `Resolved<string>`                | `POST`                      | The HTTP method to use. While GraphQL queries are typically POSTS, some services expose GraphQL over GET instead.                                                                  |
| `headers`   | `Resolved<Object<string,string>>` |                             | Additional HTTP headers to send with the GraphQL request. Some headers are set automatically, but the headers configuration can append to `headers` that can have multiple values. |
| `query`     | `Resolved<Query string>`          |                             | The query to use.                                                                                                                                                                  |
| `variables` | `Resolved<Object <any>>`          | `{}`                        | Variables to use with the GraphQL query. Must resolve to an object with keys and values, almost always with an InlineResolver.                                                     |
{: style="table-layout:auto" }

```yml
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
    resolver: inline
    inline:
      # This is a barestring indicating a context lookup. It resolves to the
      # `id` value in the URL query string of the request, using the builtin
      # `request` context object.
      id: request.url.query.id
```

{: .bs-callout .bs-callout-info}
For the purposes of demonstration, the query in the example is resolved inline.
The best practice is to store queries in files and use FileResolvers to obtain them.

### Using GraphQL

ServiceResolvers always use GraphQL queries.

To obtain data from a non-GraphQL service, an UPWARD server may implement client-side directives.
These directives change the behavior of a GraphQL query, such as [apollo-link-rest][], and place the directives in the query itself.
This should be transparent to the UPWARD server itself, which delegates the service call to a GraphQL client.
If an UPWARD server's GraphQL client has no implementation for such a directive, then it must pass the query unmodified to the backing service to handle the directive.

#### REST service call example

The following example shows how you can query a REST service using an UPWARD server whose GraphQL client implementation has a `@rest` directive like [appollo-link-rest][].
This example is used only to illustrate the concept.
It is not standard behavior.

```yml
documentResult:
  resolver: service
  url: env.REST_API_ENDPOINT
  method:
    resolver: inline
    inline: GET
  headers:
    # In contrast to the template above, this assumes that en environment
    # variable is already set with the "Bearer <token>" format.
    inline:
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
    inline:
      id: request.url.query.id
```

### Response assignment

The GraphQL specification requires that a successful response to a GraphQL query have a root [`data`][] property, an object whose properties correspond to the entities returned.
A failed response must have a root [`errors`][] property.

An UPWARD server must assign the entire root object to the named context value.

For example, a successful call using the query in the previous example results in a context with `documentResult.data.document` and `documentResult.data.links` properties.
If the query failed, the context would contain `documentResult.errors`.

### ServiceResolver error handling

The GraphQL specification defines [error behavior][] clearly.
UPWARD servers should pass the errors collection from a GraphQL response as described in the previous section.

Other errors include:

Network errors
: the URL is unresolvable or unresponsive

Parse errors
: a dynamically supplied query could not be parsed

Validation errors
: required variables were absent or the wrong type

An UPWARD server should format errors in the same manner as GraphQL.
It should return an object with an `errors` array which contains all encountered errors.

## TemplateResolver

Use a **TemplateResolver** to render a template into a string.
This can be used to assemble the response body using data from a context value.

UPWARD servers must provide a Mustache template renderer that implements the [Mustache specification][].
UPWARD servers can also provide other template renderers that evaluate context objects into strings.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `engine` |    `Resolved<string>` | |       _Required._ The label of the template engine to use.|
| `provide`|    `Resolved<string[] or object<string>>`| | _Required._ A list, or an object mapping, of values available to the template.|    
|`template`|    `Resolved<Template or string>` | | The template to render |   
{: style="table-layout:auto" }

{: .bs-callout .bs-callout-warning}
Passing the entire context to a template for evaluation can cause cyclic dependencies. 

```yml
{% raw %}
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
{% endraw %}
```

{: .bs-callout .bs-callout-info}
For illustrative purposes, this example uses an InlineResolver. 
In a production configuration use a FileResolver to obtain the template.

This configuration resolves into an HTML document that displays content from the `documentResult.data.document` context value.

It uses Mustache partials, which implies the existence of `headtag.mst`, `header.mst`, and `footer.mst` files in the directory containing the definition file.
Including a missing partial should raise an error as soon as the template is resolved, ideally during startup.

### Template context

Since the output of the template is added to the context, using the entire context during context rendering causes an immediate circular dependency.

Use the `provide` configuration option to select the values needed by the template.
These values are available, at root, inside the template.

The argument for `provide` can be a list:

```yml
provide:
  - env
  - articleResult
```

The resulting context for the template will look like the following:

```json
"env": {
  "envVars": "here"
},
"articleResult": {
  "data": {
    "article": {
      "articleContents": "content"
    }
  }
}
```

Lists can only use the _base_ context properties.
For example, `articleResult.data.article` cannot be used in the configuration using the list format.

The other argument format for `provide` is a simple object that represents a mapping.
The mapping resolves to a plain object of string keys and context values:

```yml
provide:
  inline:
    article: articleResult.data.article
```

This approach provides the template with a single root property `article` and makes template files more readable.
This would give the template a single root property "article", thus flatting out the template tree and making templates more readable.

```json
"article": {
  "articleContents": "here"
}
```

### Template engines

The `engine` configuration must resolve to a string label for a supported template engine.

The label `mustache` is reserved for the Mustache template engine, which is the only required template engine for an UPWARD server.
Using additional template engines, such as [ReactJS server-side rendering][], is supported.

```yml
body:
  resolver: template
  engine:
    resolver: inline
    inline: react
  provide:
    inline:
      document: documentResult.data.document
      query: request.url.query
  template:
    resolver: file
    file:
      resolver: inline
      inline: './build/RootComponents/Document.js'
```

This configuration specifies a template engine labeled `react`.
The underlying template engine could be a simple Node module that looks like the following:

```js
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');

module.exports = (props, component) =>
  renderToString(createElement(require(component), props));
```

### TemplateResolver Error Handling

If an engine is unknown or not supported, the UPWARD server should detect this as soon as possible and send a 500 error.

If there were any errors parsing the template, evaluating, or serializing the data, the resolver must resolve an object with an errors array instead of a rendered string.  
These errors must be formatted like [GraphQL errors][].

## ConditionalResolver

Use a **ConditionalResolver** to test a context value for a particular pattern and yield another Resolver depending on the match results.

This Resolver is the only branch logic operation available in the UPWARD specification.
It performs pattern matching on a context value using [Perl compatible regular expressions][].

It is limited to only being able to test a single context value for each potential match and has no Boolean operators such as `AND`, `OR`, or `NOT`.
These operations are available through pattern matching.


It can only test a single context value for each potential match, and it has no Boolean operators such as AND, OR, or NOT
All of these logical operations can be achieved through pattern matching, however
It takes two configuration values: when must be a list of Matcher<Resolver<T>>>, and default must be a resolver to use if none of the when conditions are true.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `when` | `Matcher<Resolver<T>>[]` | | A list of `Matcher` objects |
| `default` | `Resolved<any>`| | _Required._ The default resolver to use if no matcher succeeds. |
{: style="table-layout:auto" }

### Matcher

A `Matcher` is an object used in the list for the `when` configuration.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `matches` | `string` | | _Required._ The context value to match. Must be a bare string context lookup. |
| `pattern` | `string` | | _Required._ Perl compatible regular expressions to use to test against the value in `matches`.|
|`use` | `Resolved<any>` | | _Required._ Resolver to use if the match succeeds. |
{: style="table-layout:auto" }

### Match context

When a matcher's `use` value is resolved, a `match` object is temporarily added to the context.
This object contains matching text or capture groups after applying the regular expression.

The value of `$match.0$` is the full text of the last matched value.
Additional numbered properties on the object, such as `$match.1$` or `$match.2$`, represent the string captured in the backreference declared in the regex.

### ConditionalResolver example

```yml
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

The example provided uses a ConditionalResolver to determine the context value for `monkey`.

The `when` list is configured to use two matchers that are executed in the same order they are listed.

The first matcher tests whether the value of `grab` in the request query string matches the regular expression `^(true|1)$`.
This means that if the query string contains "grab=true" or "grab=1", the matcher succeeds and the ConditionalResolver yields the value in `use`.
The context becomes:

```json
{
  "status": 403,
  "monkey": "do anyway",
  "body": "<p>monkey <b>do anyway</b></p>"
}
```

If the request query string does not match the regular expression, the second matcher runs.
This matcher tests if the status context value matches the regular expression `^403$`, which checks to see if the response status code is set to `HTTP 403 Forbidden`.
The resolver for `status` can run concurrently with the one for `monkey`, and
when the value becomes available the matcher tests against the `403` value.
Sine the matcher succeeds, the context becomes:

```json
{
  "status": 403,
  "monkey": "see",
  "body": "<p>monkey <b>see</b></p>"
}
```

If the configuration provides a different status, such as `200`, then neither matcher in the `when` list succeeds.
In this situation, the ConditionalResolver uses its default resolver, and
the context becomes:

```json
{
  "status": 200,
  "monkey": "do",
  "body": "<p>monkey <b>do</b></p>"
}
```

### Additional ConditionalResolver notes

* Matchers run in top to bottom sequence,
  and the first successful matcher exits the conditional instead of "falling through".
* Matchers can only test against context properties.
  They cannot use a resolver as the `matches` value.
* Each matcher tests a single context property against a single pattern.
  The pattern provided can use regex alternation to achieve `OR`-type logic.
* A list of Matchers can each test different properties.
* The `default` resolver is required.
* To achieve `AND`-like logic, nest ConditionalResolvers to arbitrary depth.
* To achieve `OR`-like logic, repeat the same resolver configuration in several subsequent matchers.
* Using template engines with logical operators to perform branch logic is not recommended because it prevents static analysis of context value dependencies.

## ProxyResolver

Use a **ProxyResolver** to pass a request to another service.
This resolver is guaranteed to resolve into an object with `status`, `headers`, and `body` properties from a logical point of view.

Implementations may handle request objects directly to improve performance.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `target` | `Resolved<string>`| | The URL of the service | 
| `ignoreSSLErrors` | `Resolved<boolean>` | `false` | Ignore remote SSL certificate errors (useful for internal communication among containers).|
{: style="table-layout:auto" }

```yml
proxy:
  target: env.MAGENTO_BACKEND_URL
  ignoreSSLErrors: true
``` 

ProxyResolvers are special targets for static analysis.
Analysis systems can use simple techniques to determine proxying rules by walking up the UPWARD tree.
This is effectively a declarative proxy configuration, and 
deployment tools can be enhanced to create proxy servers in front of UPWARD where appropriate.

## DirectoryResolver

Use a **DirectoryResolver** to delegate request and response handling to a static server.

Unlike the ProxyResolver, this resolver needs access to a local directory, which it serves as a public assets folder.

Much like the ProxyResolver, this resolver exists to bolster the notion that an UPWARD file can describe the expected behavior of a PWA server-side site in detail.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `directory` | `Resolved<string>`| | The directory to target |
{: style="table-layout:auto" }

```yml
static:
  directory:
    inline: './dist'
```

[inlineresolver]: #inlineresolver
[fileresolver]: #fileresolver
[graphql errors]: https://facebook.github.io/graphql/June2018/#sec-Errors
[regular file]: http://www.livefirelabs.com/unix_tip_trick_shell_script/unix_operating_system_fundamentals/file-types-in-unix.htm
[serviceresolver]: #serviceresolver
[apollo-link-rest]: https://www.apollographql.com/docs/link/links/rest.html
[`data`]: https://facebook.github.io/graphql/June2018/#sec-Data
[`errors`]: http://facebook.github.io/graphql/June2018/#sec-Errors
[error behavior]: <http://facebook.github.io/graphql/June2018/#sec-Errors>
[TemplateResolver]: #templateresolver
[Mustache specification]: https://github.com/mustache/spec
[ReactJS server-side rendering]: https://reactjs.org/docs/react-dom-server.html
[GraphQL errors]: http://facebook.github.io/graphql/June2018/#sec-Errors
[ConditionalResolver]: #conditionalresolver
[Perl compatible regular expressions]: https://en.wikipedia.org/wiki/Perl_Compatible_Regular_Expressions
[ProxyResolver]: #proxyresolver
[DirectoryResolver]: #directoryresolver
