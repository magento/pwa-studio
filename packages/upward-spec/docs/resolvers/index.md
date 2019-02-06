# Resolvers

A Resolver is an object that describes how a value is obtained.

Each Resolver takes a different set of configuration parameters.

Like a context lookup string, a resolver represents an operation which executes and delivers its results upward in the tree.
This process continues until all dependencies of the top-level `status`, `headers`, and `body` definitions are resolved.

List of available Resolvers:

-   [InlineResolver][] - adds hardcoded values
-   [FileResolver][] - loads files from a filesystem
-   [ServiceResolver][] - places GraphQL queries and loads the result set
-   [TemplateResolver][] - renders a template string against the context
-   [ConditionalResolver][] - does branch logic using pattern matching on context values
-   [ProxyResolver][] - delegates request/response handling to a proxy
-   [DirectoryResolver][] - delegates request/response handling to a static file directory

[inlineresolver]: inline.md
[fileresolver]: file.md
[serviceresolver]: service.md
[templateresolver]: template.md
[conditionalresolver]: conditional.md
[proxyresolver]: proxy.md
[directoryresolver]: directory.md
