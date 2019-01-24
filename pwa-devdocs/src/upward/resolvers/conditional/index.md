---
title: ConditionalResolver
---

Use a **ConditionalResolver** to test a context value for a particular pattern and yield another Resolver depending on the match results.

This Resolver is the only branch logic operation available in the UPWARD specification.
It performs pattern matching on a context value using [Perl compatible regular expressions][].

It is limited to only being able to test a single context value for each potential match and has no Boolean operators such as `AND`, `OR`, or `NOT`.
These operations are available through pattern matching.

It can only test a single context value for each potential match, and it has no Boolean operators such as AND, OR, or NOT
All of these logical operations can be achieved through pattern matching, however
It takes two configuration values: when must be a list of Matcher<Resolver<T>>>, and default must be a resolver to use if none of the when conditions are true.

| Property  | Type                     | Default | Description                                                     |
| --------- | ------------------------ | ------- | --------------------------------------------------------------- |
| `when`    | `Matcher<Resolver<T>>[]` | -       | A list of `Matcher` objects                                     |
| `default` | `Resolved<any>`          | -       | _Required._ The default resolver to use if no matcher succeeds. |
{: style="table-layout:auto" }

## Matcher

A `Matcher` is an object used in the list for the `when` configuration.

| Property  | Type            | Default | Description                                                                                    |
| --------- | --------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `matches` | `string`        | -       | _Required._ The context value to match. Must be a bare string context lookup.                  |
| `pattern` | `string`        | -       | _Required._ Perl compatible regular expressions to use to test against the value in `matches`. |
| `use`     | `Resolved<any>` | -       | _Required._ Resolver to use if the match succeeds.                                             |
{: style="table-layout:auto" }

## Match context

When a matcher's `use` value is resolved, a `match` object is temporarily added to the context.
This object contains matching text or capture groups after applying the regular expression.

The value of `$match.0$` is the full text of the last matched value.
Additional numbered properties on the object, such as `$match.1$` or `$match.2$`, represent the string captured in the backreference declared in the regex.

## ConditionalResolver example

```yml
monkey:
    resolver: conditional
    when:
        # All values are coerced to strings for regex matching.
        - matches: request.url.query.grab
          pattern: '^(true|1)$'
          use:
              resolver: inline
              inline: 'do anyway'
        - matches: status
          pattern: '^403$'
          use:
              resolver: inline
              inline: 'see'
    default:
        resolver: inline
        inline: 'do'
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
        inline: '<p>monkey <b>{{ monkey }}</b>.</p>'
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

## Additional ConditionalResolver notes

-   Matchers run in top to bottom sequence,
    and the first successful matcher exits the conditional instead of "falling through".
-   Matchers can only test against context properties.
    They cannot use a resolver as the `matches` value.
-   Each matcher tests a single context property against a single pattern.
    The pattern provided can use regex alternation to achieve `OR`-type logic.
-   A list of Matchers can each test different properties.
-   The `default` resolver is required.
-   To achieve `AND`-like logic, nest ConditionalResolvers to arbitrary depth.
-   To achieve `OR`-like logic, repeat the same resolver configuration in several subsequent matchers.
-   Using template engines with logical operators to perform branch logic is not recommended because it prevents static analysis of context value dependencies.

[perl compatible regular expressions]: https://en.wikipedia.org/wiki/Perl_Compatible_Regular_Expressions
