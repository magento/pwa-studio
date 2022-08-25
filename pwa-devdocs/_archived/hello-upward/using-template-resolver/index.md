---
title: Using the TemplateResolver
---

In this tutorial, you will learn how to use the [TemplateResolver][] in your UPWARD specification file to serve an HTML page rendered server-side.

This tutorial builds on the project described in the previous [Creating a simple server][] tutorial.

## Create web page templates

In your project directory, create a `templates` directory. This directory will house [Mustache][] template files for the different pieces of the HTML page.

**`open-document.mst`**

```mustache
<!DOCTYPE html>
<html language="en">

  <head>
    <meta charset="utf-8">
```

This template partial creates the beginning of the HTML response.
The `head` tag is left open to allow custom metadata, such as title, scripts, and styles.

**`open-body.mst`**

```mustache
  </head>
  <body>
```

This template partial closes the `head` tag and begins the `body` tag of the HTML response.

**`close-document.mst`**

```mustache
  </body>
</html>
```

This template partial closes the `body` and `html` tag for the HTML response.

**`hello-world.mst`**

{% raw %}

```mustache
{{> templates/open-document}}

  <title>{{ title }}</title>

  {{> templates/open-body}}

    <b>Hello Template World!</b>

  {{> templates/close-document}}
```

{% endraw %}

This template uses the previously defined template partials to create a complete HTML response.
The body contains the "Hello Template World!" message in bold and sets the page title to a `title` variable, which is available through the template context.

## Add TemplateResolver

Modify the `helloWorld` object in the `spec.yml` file and replace the simple text response to an actual HTML page.

```diff
helloWorld:
    inline:
        status:
            resolver: inline
            inline: 200
        headers:
            resolver: inline
            inline:
                content-type:
                    resolver: inline
-                   inline: 'text/string'
+                   inline: 'text/html'
        body:
-           resolver: inline
-           inline: 'Hello World!'
+           resolver: template
+           engine: mustache
+           template: './templates/hello-world.mst'
+           provide:
+               title:
+                   resolver: inline
+                   inline: 'This is the page title!'
```

This new code replaces the InlineResolver with a TemplateResolver in the response body.
This TemplateResolver configuration sets the rendering engine to `mustache`, since the templates created previously are in Mustache format.
It also provides the `title` variable to the context during template render.

Now, when you start the server and navigate to the root or `/hello-world` path, you get an actual HTML webpage instead of text.
View the page source for the page to see the HTML rendered from the templates.

**Next:** [Adding React to the server][]

[Creating a simple server]: {%link tutorials/hello-upward/simple-server/index.md %}
[Adding React to the server]: {%link tutorials/hello-upward/adding-react/index.md %}

[Mustache]: https://mustache.github.io/mustache.5.html
[TemplateResolver]: https://github.com/magento/pwa-studio/tree/develop/packages/upward-spec#templateresolver
