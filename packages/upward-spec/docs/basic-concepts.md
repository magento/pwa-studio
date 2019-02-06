# Basic concepts

An UPWARD definition file describes the behavior of the server for an application shell.
This topic explains the basic concepts you need to know to read or create your own UPWARD definition file and server.

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

## Returning the response

Eventually, the root context must have non-null values for its `status`, `header`, and `body` properties.
When the resolution path has assigned values for these properties, an UPWARD-compliant server should use them to create an HTTP response and send it to the client.

If all resolvers finish executing and the response is lacking values for any of the `status`, `headers`, or `body` properties, the server should emit a 500 error.
If possible, UPWARD server implementations should use static analysis on startup to trace a path through the decision tree where this occurs and raise an error.

No streaming or buffering interface should be provided; UPWARD servers should not deal in data large enough to require streaming.

{: .bs-callout .bs-callout-info}
The generation of `status`, `headers`, and `body` share similar logic.
The recommended best practice is to use an **InlineResolver** to create a top-level `response` object with those properties, and define the top-level `status`, `headers`, and `body` properties to refer to that object in context (e.g. status: response.status).

## Cyclical dependency detection

Since bare string literals are used to reference context objects in a definition file, it is possible to detect potential cyclic dependencies when processing the configuration file for the first time, before any requests are made.
If a cyclic dependency is detected this way, the server should raise an error on startup.

If a cyclic dependency occurs at runtime, the server should return a 500 error.

[Context]: context.md
[Resolvers]: resolvers/index.md
