# Context

The context is a global namespace created for each request.
It contains a dictionary of values, like a JSON object.
Values for the `status`, `headers`, and `body` properties make up the response for the client.
The rest of the properties are discarded.

Since the context is the global namespace and the means of sharing values between resolvers, it can become a large object in it lifecycle, but
this should not affect client performance.

## Error handling

Context values cannot be overwritten.
A resolver which attempts to overwrite an already-set context value must raise a context conflict error.

UPWARD-compliant servers should be able to identify potential context conflict errors during static analysis of the definition file and raise an error on launch.
UPWARD-compliant servers must be able to identify a context conflict during runtime execution and respond with a 500 error.

## Initial context

When an UPWARD-compliant server receives an HTTP GET request, it populates an initial context object with the following values:

### `request`

The request value is an object that represents the incoming HTTP request.
It must have the following properties:

`headers`
: An object that represents HTTP headers.
  Header names are lower-cased, and multiple values are joined with commas.

`headerEntries`

: An iterable array form of the `headers` object.
  This form is suitable for Mustache templates, which cannot iterate over plain JSON objects.

  For example, this `headers` object:

  ```json
  {
      "accept": "text/html",
      "host": "example.com"
  }
  ```

  would have a `headerEntries` value of:

  ```json
  [
      { "name": "accept", "value": "text/html" },
      { "name": "host", "value": "example.com" }
  ]
  ```

`queryEntries`

: An iterable array form of the URL query object.
  Like `headerEntries`, this form is also suitable for Mustache templates.

`url`

: A subset of a [URL record][] as specified by the Web Hypertext Application Technology Working Group ([WHATWG][]).

  Important properties for an UPWARD server includes:

  | Property   | Description                         | Example                |
  | ---------- | ----------------------------------- | ---------------------- |
  | `host`     | Name of the host and the port used  | `example.com:8080`     |
  | `hostname` | Name of the host                    | `example.com`          |
  | `port`     | Port used by the host               | `8080`                 |
  | `pathname` | Resource path used in the request   | `/deep/blue/sea`       |
  | `search`   | Search query for the request        | `?baby=beluga`         |
  | `query`    | Serialized form of the search query | `{ "baby": "beluga" }` |

  The `host` header can be used to infer the value for `origin`.

  Some HTTP servers cannot determine their own domain names or origins, so
  it is acceptable to have an undefined value for the following properties:

  -   `href`
  -   `origin`
  -   `protocol`
  -   `username`
  -   `password`
  -   `host`
  -   `hostname`
  -   `port`

  However, a compliant server MUST provide values for `pathname`, `search`, and `query`.

  The `query` property is not part of the WHATWG specification, but it must be included in the url object.
  This form is used for property lookup and iteration in logic-less templates, such as Mustache.

`env`

: An object which contains the environment variables set when the server launches.

  For example, if a Dockerfile sets the value for `MAGENTO_GRAPHQL_ENDPOINT` and launches the server through Apache:

  ```text
  ENV MAGENTO_GRAPHQL_ENDPOINT https://m2host.com/graphql
  CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
  ```

  Then the context value for `env.MAGENTO_GRAPHQL_ENDPOINT` is `"https://m2host.com/graphql"`.

## Frequently used strings

Frequently used strings should be registered as self-referential, top-level context objects to reduce boilerplate and make the file easier to read and write.

Examples:

* `GET`: the string 'GET' must be included in the global context for convenience
* `POST`: the string 'POST' must be included in the global context for convenience
* `mustache`: the string 'mustache' must be included in the global context for convenience

Other strings that must be preset as literals in the context include:

* `text/html`
* `text/plain`
* `application/json`
* `utf-8`
* `latin-1`
* `base64`
* `hex`
* All valid HTTP response codes, such as `200`, `404`, and `500`.

## Path syntax

In an UPWARD configuration, a normal string of characters is treated as a context lookup by default.
Some resolver configuration properties treat these strings as literal strings.

The default value for some properties contain constants for [frequently used strings][].
This makes the definition file look like it uses multiple literal strings, but
most of these string values are context lookups.

### Context lookup

A context lookup in an UPWARD spec resembles the _dot lookup_ notation in JavaScript or Python.
However, the rules are much simpler and they cannot be dynamically generated.

#### Rules

Valid characters

: A context lookup may contain any UTF-8 characters except control characters, whitespace, or newlines.  
  All characters that are not lookup operators must be treated as part of a property name.

  To make string manipulation easy in common programming languages, use context names which are legal identifiers in those languages.

  A context lookup cannot begin with a dot (`.`), which is the lookup operator.

Lookup operators

: The dot (`.`) indicates a property lookup on an object.

  A positive integer property name in a context lookup, such as `characters.0.name`, performs an array lookup using the specified index.
  Array indices must be positive integers and specified literally, just like the rest of a context lookup string.
  Indices cannot be dynamically evaluated.

Basename

: A context lookup starts with a basename.
  The basename is a string that is a valid YAML property name.
  When a top-level resolver completes its resolution, it assigns a value to this name in the global context, which should trigger resolution of all paths beginning with that name.

Undeclared properties

: Undeclared property lookup should silently fail and resolve to an empty string.

  For example, if the basename `foo` is assigned a value but
  the value is not an object or it does not contain the property `bar`,
  then the context lookup `foo.bar` should wait until `foo` resolves before returning an empty string.

#### Context lookup parts

The following diagrams show the different parts of a context lookup:

```text
         string property names
basename    |               |
     |      |  array index  |
     |      |          |    |
  uxbridges.characters.0.name
           |            |
        named property lookups
```

At runtime, the example provided behaves as an instruction to wait until the `uxbridges` basename has been assigned.
There must be a definition that assigns this property  elsewhere in the UPWARD specification file.

```yaml
uxbridges:
  resolver: service
  method: POST
    resolver: inline
      inline: false
  url:
    resolver: inline
      inline: http://stapi.co/api/v1/rest/character/search
  headers:
    resolver: inline
    inline:
      content-type: application/x-www-form-urlencoded
  query:
    resolver: inline
    inline: '{
      characters @rest(type: "Character", path: )
    }'
```

The definition provided assigns an `HttpResponse` to the `uxbridges` basename after resolving.
The HTTP response for this resource has no `characters` property, so
the example context lookup resolves to an empty string.
However, the HTTP response does have a `body` property defined, so 
the lookup `uxbridges.body.characters.0.name` resolves to `Kevin Uxbridge`.

**Note:**
_Array and list handling is intentionally rudimentary in UPWARD because of the potential for scope confusion, performance issues, and security issues during iteration._
_The only recommended use case for list lookup is when a web service returns a list of items that is expected to have only one result._
_That result may be lifted out into a scalar value._

#### Pattern matching

Since arbitrary property lookups do not throw exceptions and instead return a default empty string, use pattern matching to test the success or failure of requests and responses.

```yaml
matches: uxbridges.body.characters.0.name
pattern: '.'
```

The regex dot character pasess if the string is non-empty and fail if it is empty.
This is a common pattern in UPWARD definitions.

## Persistence and size

When writing UPWARD definitions, do not make a distinction between _persistent_ context values that stay the same and values that differ for each request.

An UPWARD server must do topological sorting to determine the order to run Resolvers, so
an efficient implementation identifies the parts of the root context that are not dependent on the incoming request and caches or discards them.

## Using context

A context lookup can be used anywhere a resolver is allowed in the definition file.
A context path indicates a dependency on another root context value, which causes the currenty branch to wait until the value is resolved.

```yml
body:
  resolver: conditional
  when:
    - matches: request.url.query.shipmentId
      pattern: '\d+'
      use:
        resolver: template
        engine: mustache
        template:
          resolver: file
          file:
            resolver: inline
            inline: './renderShipment.mst'
        provide:
          shipment:
            resolver: service
            query:
              resolver: file
              file:
                resolver: inline
                inline: './getShipment.graphql'
            variables:
              id: request.url.query.shipmentId
    - matches: request.url.query.shipmentName
      pattern: '\w+'
      use:
        resolver: template
        engine: mustache
        template:
          resolver: file
          file:
            resolver: inline
            inline: './renderShipment.mst'
        provide:
          shipment:
            resolver: service
            url: env.SHIPMENTS_SVC
            query:
              resolver: file
              file:
                resolver: inline
                inline: './getShipment.graphql'
            variables:
              name: request.url.query.shipmentName
    - matches: request.url.query.shipmentTrackingNumber
      pattern: '[\w\d\.]+'
      use:
        resolver: template
        engine: mustache
        template:
          resolver: file
          file:
            resolver: inline
            inline: './renderShipment.mst'
        provide:
          shipment:
            resolver: service
            url: env.SHIPMENTS_SVC
            query:
              resolver: file
              file:
                resolver: inline
                inline: './getShipment.graphql'
            variables:
              trackingNumber: request.url.query.shipmentTrackingNumber
    default:
      inline: 'Please provide a query'
```

In the example provided, the matchers use the context lookups `request.url.query.shipmentId`, `request.url.query.shipmentName`, and `request.url.query.shipmentTrackingNumber` to asynchronously obtain values for comparison as soon as they resolve.
The `request` object is part of the initial context, but
dependencies on other context values that have definitions can also be used.

The above definition could be more concisely expressed using intermediate values and more context lookups:

```yml
body:
  resolver: conditional
  when:
    - matches: gqlVariables
      pattern: null
      use:
        inline: 'Please provide a query'
  default:
    resolver: template
    engine: mustache
    template:
      resolver: file
      file:
        resolver: inline
          inline: './renderShipment.mst'
    provide:
      shipment:
        resolver: service
        url: env.SHIPMENTS_SVC
        query:
          resolver: file
          file:
            resolver: inline
              inline: './getShipment.graphql'
        variables: gqlVariables
gqlVariables:
  resolver: conditional
  when:
    - matches: request.url.query.shipmentId
      pattern: '\d+'
      use:
        resolver: inline
        inline:
          id: request.url.query.shipmentId
    - matches: request.url.query.shipmentName
      pattern: '\w+'
      use:
        resolver: inline
        inline:
          name: request.url.query.shipmentName
    - matches: request.url.query.shipmentTrackingNumber
      pattern: '[\w\d\.]+'
      use:
        resolver: inline
        inline:
          trackingNumber: request.url.query.trackingNumber
  default: null
```

This definition produces identical behavior as the first one but with 30% fewer lines.
It demonstrates the idea of using context values to reduce the first repetative definition.

If the GraphQL service sets an order of precedence for the shipment query, which uses the same priority logic as the ConditionalResolver, the definition can be further reduced to use the same variable set in all cases:

```yml
body:
  resolver: conditional
  when:
    - matches: request.url.query.shipmentId
      pattern: '\d+'
      use: getShipment
    - matches: request.url.query.shipmentName
      pattern: '\w+'
      use: getShipment
    - matches: request.url.query.shipmentTrackingNumber
      pattern: '[\w\d\.]+'
      use: getShipment
  default:
    inline: 'Please provide a query'
getShipment:
  resolver: template
  engine: mustache
  template:
    resolver: file
    file:
      resolver: inline
        inline: './renderShipment.mst'
  provide:
    shipment:
      resolver: service
      url: env.SHIPMENTS_SVC
      query:
        resolver: file
        file:
          resolver: inline
            inline: './getShipment.graphql'
      variables:
        id: request.url.query.shipmentId
        name: request.url.query.shipmentName
        trackingNumber: request.url.query.trackingNumber
```

Setting top-level context properties for reusable values is an important way to reduce verbosity and code duplication in the definition file.

[url record]: https://url.spec.whatwg.org/#url-class
[whatwg]: https://whatwg.org/
[frequently used strings]: #frequently-used-strings
