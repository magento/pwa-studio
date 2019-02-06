# InlineResolver

Use an **InlineResolver** wherever you need a literal string value in the context.

| Property | Type  | Default | Description                                     |
| -------- | ----- | ------- | ----------------------------------------------- |
| `inline` | `any` | -       | _Required._ The value to assign to the context. |

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
