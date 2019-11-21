---
title: Content Rendering
---

Browsers require HTML to display page content.
Server-side rendering and client-side rendering are two ways a browser can get rendered HTML content for a page.
This topic goes over these two ways of rendering content supported by PWA Studio and UPWARD.

## Server-side rendering (SSR)

Server-side rendering (SSR) is a method of providing pre-generated HTML as a response to an HTTP request.

For example, the contents of this website is pre-built from source files.
These files are converted into HTML pages and uploaded into an HTTP hosting server.
When a user visits the site, the server returns the pre-built HTML file for the browser to render.

Example:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="/favicon.ico">
    <title>My Website</title>
  </head>
  <body>
    <header>Header content</header>
    <menu>Menu content</menu>
    <main>Main body content</main>
    <footer>Footer content</footer>
  </body>
</html>
```

Server-side languages, such as PHP and Java, can also render custom HTML per request to make the experience more dynamic.
This is how Magento currently works.

## Client-side rendering (CSR)

Client-side rendering is another method of delivering HTML content to the browser.
Instead of providing the entire HTML page content on a request, the server returns a page with minimal content.
The page depends on a JavaScript file that finishes rendering the HTML on the page.

The following is an example of what a bare page response looks like:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="/favicon.ico">
    <title>My Web App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/app.js"></script>
  </body>
</html>
```

In this example, the `app.js` script runs after the page loads.
A common behavior for this type of file is to generate an HTML DOM tree and insert it into a root element on the page.

## Search Engine Optimization (SEO)

When and how page content renders is an important part of Search Engine Optimization (SEO).

When a search engine crawler processes a page, it indexes the initial HTML response from the server.
Some crawlers, such as the [Googlebot][], have the ability to execute JavaScript to simulate client-side rendering.

Since search engine crawlers have varying levels of effectiveness 

Search engines typically use page content and meta-data to determine rankings, so
they have varying levels of effectiveness when it comes to indexing applications that render client-side.

Since SSR sites provide the full contents of the page on every request, the page is indexed better.

## Content rendering strategies in PWA Studio

For storefronts built using PWA Studio tools and libraries, an UPWARD server handles a site's 

### Venia

### UPWARD

[googlebot]: https://en.wikipedia.org/wiki/Googlebot