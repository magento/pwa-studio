# FileResolver

Use a **FileResolver** to load content from a file.
This is useful for loading queries and templates, which are reused by other systems.

{: .bs-callout .bs-callout-info}
File contents are not expected to change during server runtime, so an UPWARD-compliant server should cache file contents on startup.

| Property   | Type               | Default | Description                                                                                   |
| ---------- | ------------------ | ------- | --------------------------------------------------------------------------------------------- |
| `file`     | `Resolved<string>` | -       | _Required._ Path of the file to read relative to the definition file                          |
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

## Parsing

When the `parse` option is set to `auto`, it tells the server to determine the file type based on its extension.
Setting the value of `parse` to `text` disables parsing.

An UPWARD server must support pre-parsing of graphql, json, and mustache files according to their respective specifications.
It should also support as many filetypes as necessary and any custom filetypes.

## FileResolver error handling

If the file cannot be found or are other failures while reading the file, the resolver must resolve an object with a single errors property instead of a string or a parsed value.
Errors must be formatted like [GraphQL errors][].

## FileResolver shorthand

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

[GraphQL errors]: https://facebook.github.io/graphql/June2018/#sec-Errors
[regular file]: http://www.livefirelabs.com/unix_tip_trick_shell_script/unix_operating_system_fundamentals/file-types-in-unix.htm
