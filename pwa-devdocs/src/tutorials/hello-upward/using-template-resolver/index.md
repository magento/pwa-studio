---
title: Using the TemplateResolver
---

In this tutorial, you will learn how to use the TemplateResolver in your UPWARD specification file to serve an HTML page rendered by the server.

This tutorial builds on the project described in the previous [Creating a simple server][] topic.

## Create web page templates

In your project directory, create a `templates` directory with the following template files:

**`open-document.mst`**

``` mustache
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

{%raw %}
```mustache
{{> templates/open-document}}

  <title>{{ title }}</title>

  {{> templates/open-body}}

    Hello World!
  
  {{> templates/close-body}}
```
{% endraw %}

This template uses the previously defined template partials to create a complete HTML response.

A `title` variable is used in to set a custom value for the title metadata for the page.
The value for this variable is defined in 

[Creating a simple server]: {{site.baseurl}}{%link tutorials/hello-upward/simple-server/index.md %}
