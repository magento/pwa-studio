# Basic concepts

An UPWARD definition file describes the behavior of the server for an application shell.
This topic explains the basic concepts you need to know to read or create your own UPWARD definition file and server.

## Configuration

A spec-compliant UPWARD server should be configurable with a runtime parameter: the location of the UPWARD definition YML file.
The file references external resources using [Resolvers](docs/resolvers/index.md).

## Declarative format

UPWARD definition files are written in a declarative format.
This means that the specification describes the actions or end state instead of the implementation details.

Using a declarative format allows the application shell server to be written in any programming language, such as Node or PHP.

## Request handling

An UPWARD definition file provides the intructions for building an HTTP response for a request.
It links values together in a global namespace referred to as the **context**.

**Context**
: The **context** is a dictionary of values, like a JSON object.
A typical response cycle appends intermediate values to the context, such as a query result or a template string.
See [Context][] for more information.

Each request handling cycle creates a new context object.
The incoming request is assigned to the context value `request`, and the current environment variables are assigned to the `env` context value.
Root properties of the definition file represent other named values in the context, which are populated by **resolvers**.

**Resolvers**
: A **resolver** is an object that describes how a value is obtained.
A resolver represents an operation which executes and delivers its results upward in the tree.
These operations execute until all dependencies of the top-level `status`, `headers`, and `body` definitions are resolved.
See [Resolvers][] for more information.

### Execution scheduling and ordering

Resolvers must execute only when needed.
If a request handling cycle moves through [ConditionalResolver][] branches in a way that never requires a particular context value, then that context value must never be resolved during that execution cycle.

Resolvers must execute as concurrently as possible.
The maximum concurrency is left to the implementation.
A compliant server detects when a Resolver uses a context value, and delays its execution until that context value becomes available, via [topological sorting][] of resolver execution.

See [Execution scheduling strategies][] for an implementation example.

## Returning the response

Eventually, the root context must have non-null values for its `status`, `header`, and `body` properties.
When the resolution path has assigned values for these properties, an UPWARD-compliant server should use them to create an HTTP response and send it to the client.

If all resolvers finish executing and the response is lacking values for any of the `status`, `headers`, or `body` properties, the server should emit a 500 error.
If possible, UPWARD server implementations should use static analysis on startup to trace a path through the decision tree where this occurs and raise an error.

No streaming or buffering interface should be provided; UPWARD servers should not deal in data large enough to require streaming.

**Note:**
_The generation of `status`, `headers`, and `body` share similar logic._
_The recommended best practice is to use an **InlineResolver** to create a top-level `response` object with those properties, and define the top-level `status`, `headers`, and `body` properties to refer to that object in context (e.g. status: response.status)._

## Cyclical dependency detection

Since bare string literals are used to reference context objects in a definition file, it is possible to detect potential cyclic dependencies when processing the configuration file for the first time, before any requests are made.
If a cyclic dependency is detected this way, the server should raise an error on startup.

If a cyclic dependency occurs at runtime, the server should return a 500 error.

## Reducing boilerplate

The examples in this repository are verbose to make the workings of UPWARD configuration clear.
The UPWARD specification is verbose in its canonical format on purpose to enable maximal static analysis.
However, an UPWARD-compliant server must also include features to reduce boilerplate.

### Default parameters

Many resolver configuration parameters have default values, so they can be omitted from configuration if the default is appropriate.

Consider the following example:

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

Some config parameters are unnecessary.
The default URL for a service call is `http://localhost/graphql`, and the default method is `POST`.

MIME headers are automatically generated, so the following configuration would be equivalent:

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

Consider the following example:

```yml
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

Some InlineResolvers are unnecessary.
HTTP response codes, common MIME types, common template engine labels, and other useful values must be preset in the initial context, so the following, shorter configuration is equivalent to the previous example:

```yaml
status: 200
headers:
    resolver: inline
    inline:
        'content-type': 'text/html'
body:
    resolver: template
    engine: 'mustache'
    provide:
        model: documentResult.data.document
    template:
        resolver: inline
        inline: |
            {{> headtag}}
            {{> header}}
            <div class="document">
              <h1>{{model.title}}</h1>
              <div class="document-body">
                {{& contents}}
              </div>
            </div>
            {{> footer}}
```

### Resolver type inference

For any value which must be a Resolver or a context lookup, an UPWARD-compatible server should attempt to infer resolver types from a supplied resolver configuration object, rather than requiring a `resolver` name to be specified.
Each resolver has required parameters that are mutually exclusive with one another, so a resolver type can be inferred from the presence of those parameters.

| If parameter exists... | Then infer resolver type: |
| ---------------------: | :-----------------------: |
|               `inline` |     `InlineResolver`      |
|                 `file` |      `FileResolver`       |
|                `query` |     `ServiceResolver`     |
|               `engine` |    `TemplateResolver`     |
|                 `when` |   `ConditionalResolver`   |
|               `target` |      `ProxyResolver`      |
|            `directory` |    `DirectoryResolver`    |

Resolver type inference allows configuration to omit `resolver:` parameters, which makes it possible to be far more terse.
The optimized configuration example in [Builtin constants](#builtin-constants) can be further reduced:

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

The example optimized configuration in [Default parameters](#default-parameters) can be further reduced:

```yaml
documentResult:
    headers:
        inline:
            authorization: env.BEARER_TOKEN
    query: './queries/document.graphql'
    variables:
        id: request.url.query.id
```

**Note:**
The `variables` object cannot be a resolver, as specified in [ServiceResolver configuration option][].
It must be an object whose keys are expected query variable names and whose values are resolvers, so there is no ambiguity if a GraphQL query expects a variable name, such as `file`.

### YAML anchors

The YAML specification supports an [anchor and reference syntax][yaml anchors], which can also be used to shorten configuration files.
While this can be used as part of legal YAML parsing, its use is discouraged by UPWARD files, since context resolution is clearer to the reader.
Additionally, not all parsers support references in the same way, so the feature should be used with caution.

[context]: context.md
[resolvers]: resolvers/index.md
[conditionalresolvers]: resolvers/conditional.md
[topological sorting]: https://en.wikipedia.org/wiki/Topological_sorting
[execution scheduling strategies]: ../EXECUTION_SCHEDULING_STRATEGIES.md
[yaml anchors]: https://learnxinyminutes.com/docs/yaml/
[serviceresolver configuration option]: resolvers/service.md
