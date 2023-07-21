# Preloading with UPWARD
The Shimmer components help illustrate to the user that the application is still fetching data about the page they're visiting.
This works well when navigating from page to page, but without Server Side Rendering, the initial load had no choice but to show a loading
state since we didn't know what _type_ of page we were on.

To fix this, we added capabilities to the UPWARD PHP package to prefetch information about the page, and through UPWARD's
configuration yaml we inline this information into the initial page response.

Let's walk through the UPWARD yaml

### Page Type Information
Information about the current page we're on. This information should be identical to the data in the GraphQL response
the useMagentoRoutes talon fetches during normal page-to-page navigation
```yaml
# 
veniaPageType:
  resolver: inline
  inline:
    data:
      resolver: conditional
      when:
      # When application is served by UPWARD PHP, we fetch the page type information which
      # is then used by the mustache engine and html template to inline the information into the response
        - matches: env.SCRIPT_NAME 
          pattern: '.*\.php$'
          use:
            resolver: computed
            type:
              resolver: inline
              inline: pageType
            additional: 
            # This allows us to fetch additional information based on the page type.
            # This was necessary since the route resolver can fetch additional information, such as the identifier
            # in the case of a CMS page, or the product type (__typename) in the case of a product
              - type: product
                fetch: '__typename,id'
              - type: cms_page
                fetch: 'identifier'
              - type: category
                fetch: 'id'
      # Otherwise, we have an empty string which the application handles          
      default:
        inline: ''
```

### Webpack Root Component Chunks
To maintain performance, we need to load root components asynchronously, so we don't have one massive JS file, but rather
only the JS related to the current page type. This means that having the page information on page load isn't enough. To cut
down on the first render time, we need to load the root components associated with the current page immediately when the page
loads, rather than asynchronously _after_ the page loads.
```yaml
veniaWebpackChunks:
  resolver: inline
  inline:
    scripts:
      resolver: conditional
      when:
      # When the application is served by UPWARD PHP, fetch the root component JS sources for the current page type 
        - matches: env.SCRIPT_NAME
          pattern: '.*\.php$'
          use:
            resolver: computed
            type:
              resolver: inline
              inline: webpackChunks
      # Otherwise, output nothing
      default:
        inline: ''
```

### Application Template Resolver
We need to change the resolver of the body from a simple file, to pass through [Mustache](https://github.com/janl/mustache.js/). This allows us to pass in variables
from this UPWARD configuration file, to the template. We see here that we're passing in the `pageType` and `webpackChunks`
values into the template
```yaml
veniaAppShell:
    resolver: inline
    inline:
        status:
            resolver: inline
            inline: 200
        headers:
            resolver: inline
            inline:
                content-type:
                    inline: text/html
                cache-control:
                    inline: s-maxage=60
        body:
          resolver: template
          engine: mustache
          provide:
            pageType: veniaPageType.data
            webpackChunks: veniaWebpackChunks.scripts
          template:
            resolver: file
            file:
              resolver: inline
              inline: './index.html'
```

### Application Template Source
Although there's not a lot of code here, there's a lot going on.

First we have the comment `<!-- Inlined Data -->` (and it's closing comment). This allows us to remove this chunk of html
when we're serving this file through a `yarn watch`. This is because a simple `watch` command doesn't pass through UPWARD,
so we would wind up having **exactly** what's written here in our output.

Secondly, we have our mustache variable `pageType`. This will be replaced with an JSON value when the page type has
successfully been determined by our backend. Mustache escapes this value, hence the replacement of `&quot;`. And of course
we trap any errors produced by this since it's entirely possible a non-JSON-parsable value is rendered.

Finally, we see our webpackChunks. If the value is a valid array, we'll loop over the value, outputting the current index
which will be our JS script URI.
```html
<!-- Inlined Data -->
<script>
    try {
        var INLINED_PAGE_TYPE = JSON.parse('{{pageType}}'.replace(/&quot;/g, '"'));
    } catch(error) {}
</script>
{{#webpackChunks}}
    <script type="text/javascript" src="/{{.}}"></script>
{{/webpackChunks}}
<!-- /Inlined Data -->
```
