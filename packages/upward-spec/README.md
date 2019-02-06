# UPWARD Specification

**U**nified **P**rogressive **W**eb **A**pp **R**esponse **D**efinitions are simple files describing how a web server delivers and supports a [Progressive Web Application][pwa def].
They denote server behavior in a platform-independent way, so that a PWA client application expecting certain behavior from HTTP endpoints can be deployed on any type of tech stack that implements the UPWARD specification.

## Important doc pages:

-   [UPWARD rationale](RATIONALE.md) - A detailed explanation of the context that led to the introduction UPWARD and the problems it intends to solve.

-   [Execution scheduling strategies](EXECUTION_SCHEDULING_STRATEGIES.md) - A deep dive into how the core logic of an UPWARD-compliant server is implemented with a state machine.

-   [UPWARD and Magento](UPWARD_MAGENTO.md) - Provides information on how UPWARD fills a need in Magento PWA Studio and Magento 2 frontend development.

-   [UPWARD server basic concepts](docs/basic-concepts.md) - Provides some basic concepts about UPWARD server behavior, including how to respond to requests and handling cyclic dependencies.

-   [Context](docs/context.md) - Reference documentation for the global namespace

-   [Resolvers](docs/resolvers/index.md) - Reference documentation for the various resolvers.

    -   [InlineResolver](docs/resolvers/inline.md)
    -   [ServiceResolver](docs/resolvers/service.md)
    -   [TemplateResolver](docs/resolvers/template.md)
    -   [InlineResolver](docs/resolvers/inline.md)
    -   [ConditionalResolver](docs/resolvers/conditional.md)
    -   [ProxyResolver](docs/resolvers/proxy.md)
    -   [DirectoryResolver](docs/resolvers/directory.md)

## Table of Contents

-   [UPWARD Specification](#upward-specification)
    -   [Quickstart](#quickstart)
    -   [Summary](#summary)
        -   [Simple example](#simple-example)
    -   [Configuration](#configuration)
    -   [Reducing boilerplate](#reducing-boilerplate)
        -   [Default parameters](#default-parameters)
        -   [Builtin constants](#builtin-constants)
        -   [Resolver type inference](#resolver-type-inference)
        -   [YAML anchors](#yaml-anchors)

## Quickstart

This repository is a test suite for UPWARD compliance, testing several scenarios and features on a live web server. It requires NodeJS v8 LTS or later. To test an UPWARD server:

1. Write or obtain a POSIX shell script which:

    - gets the path to an UPWARD definition file from the environment variable `UPWARD_PATH`
    - launches and/or binds the UPWARD server under test and runs it in the foreground (not as a daemon process).
    - prints the hostname and port of the now-running server instance to standard out
    - responds to SIGTERM by gracefully closing the server

    [Example here.][spec-shell-script]

2. Use `npx` to run `upward-spec` on your shell script

    ```sh
    npx upward-spec ./test_upward_server.sh
    ```

3. The shell script will run for each test suite with the environment variable `UPWARD_YAML` set to the path of a fixture YAML file for configuring a server instance. The script should launch a server (on a local port or a remote port, but resolvable to the local system) and print its host to standard out, staying in the foreground.

    The tests may run in parallel, so the server or launch script should seek open ports to bind to. When each test suite is over, the script will receive a SIGTERM or SIGKILL.

4. By default, the test runner will print human-readable results to stdout; the argument `--xunit` will make it print XUnit-compatible (and therefore JUnit-compatible) test result XML. The argument `--tap` will make it print [Test Anything Protocol](https://testanything.org/)-compatible text. Under the hood, this uses [tape](https://github.com/substack/tape) and it can be piped to [any number of open-source TAP reporters](https://github.com/sindresorhus/awesome-tap#javascript).

:information*source: *(The `npx` tool above is not required; it's a convenience script to avoid installing global NPM dependencies. You can also install `upward-spec` permanently using `yarn global add upward-spec`, and then simply invoke `upward-spec ./test_upward_server.sh` from that point forward.)\_

## Summary

UPWARD definitions are YAML files which declare the behavior of an [application shell][application shell] server. An application shell server implements a strict subset of HTTP functionality: it proxies to API backends, it serves static files, and it handles an HTTP GET request for a resource by delivering a minimal app shell: the code and data to bootstrap a Progressive Web App which displays that resource.

An App Shell is purposefully minimal, and so is an UPWARD server. It is meant to initialize or refresh sessions, deliver small HTML documents with enough server-side rendering for initial display and SEO, and then hand off subsequent request handling to the PWA running in the client.

The declarative format of UPWARD means that an UPWARD-compliant server may be written in any programming language and run on any tech stack; therefore, a PWA can declare the URIs and behavior of the network endpoints it depends on by including an UPWARD file.

### Echo Example

This example definition file echoes request data as text back to the client.

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
    provide:
        - request
    template:
        resolver: inline
        inline: |
            {{#request}}
            Headers:
                {{#headerEntries}}
                {{name}}: {{value}}
                {{/headerEntries}}
            URL:
                {{#url}}{{#?protocol}}protocol: {{protocol}}
                {{/?protocol}}{{#?host}}host: {{host}}
                {{/?host}}{{#?hostname}}hostname: {{hostname}}
                {{/?hostname}}{{#?port}}port: {{port}}
                {{/?port}}pathname: {{pathname}}
                {{/url}}
            URL Query:
                {{#queryEntries}}
                {{name}}: {{value}}
                {{/queryEntries}}
            {{/request}}
```

This example demonstrates the initial properties of the context object, populated by the originating HTTP request. describes a server which always returns status 200 with a single header, `content-type`, and a text body which is a plaintext summary of the GET request properties. An example request to such a server results in:

```sh
$ curl 'http://localhost:54422/head/shoulders?and=knees&and=toes'

Headers:
    host: localhost:54422
    user-agent: curl/7.54.0
    accept: */*
URL:
    host: localhost:54422
    hostname: localhost
    port: 54422
    pathname: /head/shoulders
URL Query:
    and: knees,toes
```

## Configuration

A spec-compliant UPWARD server should be configurable with a runtime parameter: the location of the UPWARD definition YML file. The file references external resources using [Resolvers](docs/resolvers/index.md).

## Reducing boilerplate

The above examples are fairly verbose, to make the workings of UPWARD configuration especially clear. The UPWARD specification is intentionally verbose in its canonical format, to enable maximal static analysis. However, An UPWARD-compliant server must also include features to reduce boilerplate.

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

[apollo-link-rest]: https://www.apollographql.com/docs/link/links/rest.html
[application shell]: https://developers.google.com/web/fundamentals/architecture/app-shell
[pwa def]: https://developers.google.com/web/progressive-web-apps/
[js identifiers]: https://developer.mozilla.org/en-US/docs/Glossary/Identifier
[npx]: https://github.com/zkat/npx
[spec-shell-script]: ./test_upward_server.sh
[yaml anchors]: https://learnxinyminutes.com/docs/yaml/
[pcre]: https://en.wikipedia.org/wiki/Perl_Compatible_Regular_Expressions
[graphql spec data property]: http://facebook.github.io/graphql/June2018/#sec-Data
[graphql spec errors property]: http://facebook.github.io/graphql/June2018/#sec-Errors
[mustache spec]: https://github.com/mustache/spec
[mustache partials]: https://mustache.github.io/mustache.5.html#Partials
[react dom server]: https://reactjs.org/docs/react-dom-server.html
[topological sorting]: https://en.wikipedia.org/wiki/Topological_sorting
[url spec]: https://url.spec.whatwg.org/#url-class
[regular file]: http://www.livefirelabs.com/unix_tip_trick_shell_script/unix_operating_system_fundamentals/file-types-in-unix.htm
[ServiceResolver configuration option]: resolvers/service.md
