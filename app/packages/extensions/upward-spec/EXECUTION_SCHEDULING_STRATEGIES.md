# Execution Scheduling Strategies

As mentioned in the ["Execution scheduling and ordering"](README.md#execution-scheduling-and-ordering) section of the specification, UPWARD servers must run their resolvers:

- **_only_ when their results are used**
- **as _concurrently_ as possible**

One approach to this is a state machine. A state machine can provide lazy execution by traversing a graph while keeping track of outstanding dependencies, and it can manage concurrency by spawning and keeping references to other instances of the same state machine.

Consider the following `upward.yml` configuration:

```yaml
status: page.status
headers: page.headers
body: page.body

articleResult:
  url: env.LIBRARY_SVC
  query: './getArticle.graphql'
  variables:
    articleId: request.url.query.artID

authorBioResult:
  url: env.LIBRARY_SVC
  query: './getAuthor.graphql'
  variables:
    searchTerm: request.url.query.authorID

textHtml:
  inline:
    'content-type': 'text/html'

notFound:
  inline:
    status: 404
    headers: textHtml
    body:
      engine: mustache
      template: './notFound.mst'

page:
  when:
    - matches: request.url.pathname
      pattern: '/article'
      use:
        when:
          - matches: articleResult.data.article.id
            pattern: '.'
            use:
              inline:
                status: 200
                headers: textHtml
                body:
                  engine: mustache
                  template: './article.mst'
        default: notFound
    - matches: request.url.pathname
      pattern: '/author'
      use:
        when:
          - matches: authorBioResult.data.author.id
            pattern: '.'
            use:
              inline:
                status: 200
                headers: textHtml
                body:
                  engine: mustache
                  template: './authorBio.mst'
        default: notFound
  default: notFound
```

## Possible tasks

I/O dependent tasks defined by resolvers in this configuration include:

**A.** Reading and parsing `./getArticle.graphql` from the file system  
**B.** Querying a remote service for articles  
**C.** Reading and parsing `./getAuthor.graphql` from the file system  
**D.** Querying a remote service for authors  
**E.** Reading and parsing `./authorBio.mst` from the file system  
**F.** Reading and parsing `./article.mst` from the file system  
**G.** Reading and parsing `./notFound.mst` from the file system  

In the above example, a request to `/author?id=1` should never cause the `articleResult` resolver to execute its query to the remote service. If the result is not found, it should never cause the `authorBio.mst` resolver to read from the file system. Even though the file format is declarative, each request should traverse through the resolvers using a minimal path. The request `/author?id=1`, if no data exists for it in the backing resource, should only run tasks **C, D,** and **G** from the above list.

## Example state machine resolution

:information_source: _(The below is an example and not normative. UPWARD-compliant servers must lazily execute resolvers, and a state machine is one way to implement this. What follows is a description of one path through such a state machine, not a formal definition of a state machine.)_

In a state-machine-based lazy-execution implementation, the request `/author?id=1` would cause the following.

Starting state: **Response readiness analysis**

   1. `status`, `headers`, and `body` have not been assigned.
   1. No resolvers are currently in operation or have resolved.
   1. `status`, `headers`, and `body` resolution are all defined in configuration.

       State: **Context dependency analysis**
   1. The context names pending resolution all depend on `page`.
   1. `page` has not been assigned.
   1. `page` resolution is defined in configuration.

       State: **Context resolution**
   1. `page` depends on a ConditionalResolver.

       State: **Conditional execution**
   1. The first matcher depends on `request.url.pathname`.
   1. That value is already present in context, so the matcher can run.

       State: **Conditional matching**
   1. The first matcher tests `request.url.pathname`, which is the value `/author`, against the pattern `/article`. The test fails.

      State: **Conditional execution**
   1. The second matcher depends on `request.url.pathname`.
   1. That value is already present in context, so the matcher can run.

      State: **Conditional matching**
   1. The second matcher tests `request.url.pathname`, which is the value `/author`, against the pattern `/author`. The test passes.
   1. The conditional yields to the resolver in the `use` parameter of the second matcher. That resolver is a ConditionalResolver.

      State: **Conditional execution**
   1. The first matcher depends on `authorBioResult`.
   1. `authorBioResult` has not been assigned.

      State: **Resolver dependency detection**
   1. `authorBioResult` resolution is defined in configuration.

      State: **Context resolution**
   1. `authorBioResult` depends on a ServiceResolver.

      State: **Resolver dependency detection**
   1. The ServiceResolver depends on context values `env.LIBRARY_SVC`, `request.url.query.authorId`, and a FileResolver (shorthand form) for the `query`.
   1. Both context values are present.
   1. The shorthand FileResolver creates and resolves an implicit InlineResolver, determining that it depends on the filesystem path `./getAuthor.graphql`.

      State: **File resolution**
   1. The server reads, parses, and caches the contents of `./getAuthor.graphql`.

      State: **Service resolution**
   1. The server places an HTTP request to the GraphQL service. The GraphQL service responds with a result payload:
      ```json
      {
        "data": {
          "author:" null
        }
      }
      ```

      State: **Context assignment**
   1. The context value `authorBioResult` is set to the result payload.

      State: **Response readiness analysis**
   1. `status`, `headers`, and `body` have not been assigned.
   1. One or more context values have been assigned.
   1. A ConditionalResolver is still resolving.

      State: **Context dependency analysis**
   1. The context names pending resolution depend on `page` and `authorBioResult`.
   1. `page` has not been assigned.
   1. `authorBioResult` has been assigned.

      State: **Context resolution**
   1. The conditional resolver depending on `authorBioResult` resumes.

      State: **Conditional execution**
   1. The first matcher runs again and fails again.
   1. The second matcher runs again and succeeds again, yielding another ConditionalResolver.
   1. The first matcher depends on `authorBioResult`.
   1. That value is now present in context, so the matcher can run.

       State: **Conditional matching**
   1. The first matcher tests `authorBioResult.data.author.id` against the pattern `.`. Because `authorBioResult.data.author` is null, the match fails.

      State: **Conditional execution**
   1. All matchers in the `when` configuration have failed, so the conditional yields to the value of `default`.
   1. The value of `default` is the context lookup `notFound`.
   1. `notFound` has not been assigned.

      State: **Resolver dependency detection**
   1. `notFound` resolution is defined in configuration.

      State: **Context resolution**
   1. `notFound` depends on an InlineResolver.
   1. The InlineResolver specifies an object whose properties depend on context value `textHtml` for `headers` and a TemplateResolver for `body`.
   1. `textHtml` has not been assigned.
   1. `textHtml` is defined in configuration.
   1. `textHtml` depends on an InlineResolver.
   1. The InlineResolver specifies an object whose properties depend on context value `text/html`.
   1. That value is present in context (it is built in).
   1. The InlineResolver depending on `textHtml` resolves, assigning a value to the `header` property of the `notFound` resolver.

      State: **Resolver dependency detection**
   1. The TemplateResolver depends on a context value `mustache` for `engine`, and a shorthand FileResolver for `template`.
   1. The value `mustache` is present in context (it is built in).
   1. The shorthand FileResolver creates and resolves an implicit InlineResolver, determining that it depends on the filesystem path `./notFound.mst`.

      State: **File resolution**
   1. The server reads, parses, and caches the contents of `./notFound.mst`.

      State: **Template resolution**
   1. The TemplateResolver executes its template against the entire context object, creating an interpolated string:

      ```html
        <html><body>That doesn't look like anything to me.</body></html>
      ```

       The TemplateResolver depending on `./notFound.mst` resolves, assigning the string to the `body` property of the `notFound` resolver.

      State: **Context resolution**
   1. The InlineResolver for `notFound` resolves.
   1. The conditional resolver depending on `notFound` resumes.

      State: **Conditional execution**
   1. The first matcher runs again and fails again.
   1. All matchers in the `when` configuration have failed, so the conditional yields to the value of `default`.
   1. The value of `default` is a resolved InlineResolver producing an object.

      State: **Conditional resolution**
   1. The ConditionalResolver resolves.
   1. The `use` property of the match in the parent ConditionalResolver is fully resolved.
   1. The parent ConditionalResolver resolves.

      State: **Context assignment**
   1. The context value `page` is set to the result payload.

      State: **Response readiness analysis**
   1. `status`, `headers`, and `body` have not been assigned.
   1. One or more top-level context values have resolved.
   1. No resolvers are currently resolving.

      State: **Context dependency analysis**
   1. The context names pending resolution depend on `page`.
   1. `page` has been assigned.

      State: **Context resolution**
   1. `status`, `headers`, and `body` depend on `page`.
   1. `page` exists in context and can be used.

      State: **Context assignment**
   1. The context value `status` is set to `page.status`.
   1. `headers` is set to `page.headers`.
   1. `body` is set to `page.body`.

      State: **Response readiness analysis**
   1. `status`, `headers`, and `body` have all been assigned.

      State: **Response flush**
   1. The context is cast to an HTTP response and sent to the requesting client.

## Conclusion

While resolving the request, the state machine did not execute all [possible tasks](#possible-tasks); it did not run tasks **A, B, E,** or **F**, even though there is no indication of task ordering or conditional execution in those task definitions themselves.

This _topologically-ordered_, _maximally concurrent_, and _lazily evaluated_ process enables UPWARD configuration authors to describe the available tasks without writing any imperative logic.
