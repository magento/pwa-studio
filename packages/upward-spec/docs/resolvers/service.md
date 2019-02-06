---
title: ServiceResolver
---

Use a **ServiceResolver** to obtain live data from a GraphQL backing service.
The values for URL, method, and headers are specified manually, and
the query itself is constructed using the `query` and `variables` parameters.

| Property    | Type                              | Default                     | Description                                                                                                                                                                        |
| ----------- | --------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`       | `Resolved<string>`                | `https://localhost/graphql` | _Required._ The URL of the service endpoint to call.                                                                                                                               |
| `method`    | `Resolved<string>`                | `POST`                      | The HTTP method to use. While GraphQL queries are typically POSTS, some services expose GraphQL over GET instead.                                                                  |
| `headers`   | `Resolved<Object<string,string>>` | -                           | Additional HTTP headers to send with the GraphQL request. Some headers are set automatically, but the headers configuration can append to `headers` that can have multiple values. |
| `query`     | `Resolved<Query string>`          | -                           | The query to use.                                                                                                                                                                  |
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

## Using GraphQL

ServiceResolvers always use GraphQL queries.

To obtain data from a non-GraphQL service, an UPWARD server may implement client-side directives.
These directives change the behavior of a GraphQL query, such as [apollo-link-rest][], and place the directives in the query itself.
This should be transparent to the UPWARD server itself, which delegates the service call to a GraphQL client.
If an UPWARD server's GraphQL client has no implementation for such a directive, then it must pass the query unmodified to the backing service to handle the directive.

### REST service call example

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

## Response assignment

The GraphQL specification requires that a successful response to a GraphQL query have a root [`data`][] property, an object whose properties correspond to the entities returned.
A failed response must have a root [`errors`][] property.

An UPWARD server must assign the entire root object to the named context value.

For example, a successful call using the query in the previous example results in a context with `documentResult.data.document` and `documentResult.data.links` properties.
If the query failed, the context would contain `documentResult.errors`.

## ServiceResolver error handling

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

[apollo-link-rest]: https://www.apollographql.com/docs/link/links/rest.html
[error behavior]: http://facebook.github.io/graphql/June2018/#sec-Errors
[`errors`]: http://facebook.github.io/graphql/June2018/#sec-Errors
[`data`]: https://facebook.github.io/graphql/June2018/#sec-Data
