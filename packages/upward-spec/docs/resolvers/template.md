# TemplateResolver

Use a **TemplateResolver** to render a template into a string.
This can be used to assemble the response body using data from a context value.

UPWARD servers must provide a Mustache template renderer that implements the [Mustache specification][].
UPWARD servers can also provide other template renderers that evaluate context objects into strings.

| Property   | Type                                   | Default | Description                                                                    |
| ---------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------ |
| `engine`   | `Resolved<string>`                     | -       | _Required._ The label of the template engine to use.                           |
| `provide`  | `Resolved<string[] or object<string>>` | -       | _Required._ A list, or an object mapping, of values available to the template. |
| `template` | `Resolved<Template or string>`         | -       | The template to render                                                         |
{: style="table-layout:auto" }

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
For illustrative purposes, this example uses an [InlineResolver][].
In a production configuration use a [FileResolver][] to obtain the template.

This configuration resolves into an HTML document that displays content from the `documentResult.data.document` context value.

It uses Mustache partials, which implies the existence of `headtag.mst`, `header.mst`, and `footer.mst` files in the directory containing the definition file.
Including a missing partial should raise an error as soon as the template is resolved, ideally during startup.

## Template context

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

## Template engines

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

## TemplateResolver Error Handling

If an engine is unknown or not supported, the UPWARD server should detect this as soon as possible and send a 500 error.

If there were any errors parsing the template, evaluating, or serializing the data, the resolver must resolve an object with an errors array instead of a rendered string.  
These errors must be formatted like [GraphQL errors][].

[mustache specification]: https://github.com/mustache/spec
[reactjs server-side rendering]: https://reactjs.org/docs/react-dom-server.html
[graphql errors]: http://facebook.github.io/graphql/June2018/#sec-Errors
[InlineResolver]: inline.md
[FileResolver]: file.md
