---
Title: GraphQL
contributors: Jstein19
---

## What is GraphQL

[GraphQL][] is a language for querying and manipulating data.
It is widely viewed as more powerful, flexible, and efficient than REST.

## Benefits provided by GraphQL

### Predictable results from your queries

A GraphQL query returns only data the user asks for in their query.

### Single request for many results

A single request made through GraphQL can return any number of resources and their fields by following references between them as defined in the typed schema.

### Organized data with a typed schema

A single schema defines how users access data using GraphQL.
These schemas, formatted as JSON objects, let users know exactly how to get the data they need.

The following is an example of a schema that defines a `Species` type with `name` and `origin` fields:

``` graphql
type Species {
  name: String
  origin: Planet
}
type Planet {
  name: String
}
```

{: .bs-callout .bs-callout-info}
_**Note:** The `origin` field is a `Planet` type, which also has a `name` field._

## Why use GraphQL over REST

While GraphQL and REST are both specifications for constructing and querying APIs, GraphQL has some significant advantages over REST.

### No versioning

REST APIs typically have multiple versions, such as v1, v2, etc.
This is because updating endpoints in REST will often impact existing queries.

With GraphQL, there is no need for versioning, since new types and fields can be added to the schema without impacting existing queries.

Removing fields is done through deprecation instead of deleting them from the schema.
If an old query tries to read a deprecated field, GraphQL displays a customized warning.

```
type ExampleType {
  firstName: String
  lastName: String
  name: String @deprecated(reason: "Split this field into two. Use `firstName` and `lastName`")
}
```

This prevents old queries from throwing confusing errors when trying to read outdated fields, lending to code maintainability.

### Faster and more efficient

REST APIs typically require loading from multiple URLs.
Imagine a REST API designed to get users and their forum posts.
`users/<id>` would return information like `name` and `user/<id>/posts` would have to be queried separately to return the user's `comments`.

With GraphQL, these `types` and their `fields` are returned using one query, which saves calls to the API.

In the following schema example, a `User` type contains a `posts` field, which is an array of `Post` types:

``` graphql
type Query {
  user(id: Int): User
  # This is our resolver; our entry into the query
  # It lets us query `user` with an argument `id`
  # And Expects to return a type `User`
  # Yes, you can leave comments in schemas!
}

type User {
  id: Int!
  name: String
  posts: [Post]
}

type Post {
  id: Int!
  title: String
  author: User
}
```

{: .bs-callout .bs-callout-info}
_**Note:** The exclamation mark (!) next to a field in the schema indicates it is `non-nullable`, which means the GraphQL service promises to always return a value for this field on a query._

A query for this schema that requests the name and all the post titles for a specific user would look like the following:

``` graphql
{
 user(id: 12345) {
   name
   posts {
     title
   }
 }
}
```

The data response for the query would look like the following:

```
{
  "data": {
    "user": {
      "name":  "Jane Doe"
      "posts": [
         {
           title: "Hello World"
         },
         {
           title: "I Love GraphQL"
         }
      ]
    }
  }
}
```

## Sample queries

### Simple query

Imagine a database that simply contains an object `User`, with the fields `name`, `email`, and `phone`.

``` graphql
type Query {
  user: User
}

type User {
  name: String
  email: String
  phone: String
}
```

A simple query requesting this data would look like the following:

 ``` graphql
 {
  user {
    name
    email
    phone
  }
 }
 ```

The response to this query would look like the following:

```
{
  "data": {
    "user": {
      "name":  "Jane Doe"
      "email": "JaneDoe@example.com"
      "phone": "012-345-6789"
    }
  }
}
```

### Custom data query

What if you don't need the `phone` number from `User`?
The previous query can be rewritten to return specific fields:

``` graphql
{
  user {
    name
    email
  }
}
```

The response only provides the data requested:

```
{
  "data": {
    "user": {
      "name":  "Jane Doe"
      "email": "JaneDoe@example.com"
    }
  }
}
```


### Arguments in a query

Now, what if you had multiple users and needed to grab a specific one using its `id`?
Well, with GraphQL you can pass arguments into the query:

```
{
 user(id: 12345) {
   id
   name
   email
 }
}
```

The response would look like the following:

```
{
  "data": {
    "user": {
      "id": "12345"
      "name": "Jane Doe"
      "email": "JaneDoe@example.com"
    }
  }
} 
```

{: .bs-callout .bs-callout-info}
_**Note:** The `id` field is requested in the response in this example, but this is optional. It is used here to demonstrate that the correct user is returned._

### Query connected resources

In this example, imagine that in our database a `User` is associated with multiple hobbies.
The schema would look like the following:

``` graphql
type Query {
  user: User
}

type User {
  name: String
  email: String
  phone: String
  hobbies: [Hobby]
}

type Hobby {
  name: String
  frequency: String
}
```

The following query requests the hobbies associated with a specific user:

```
{
 user(id: 12345) {
   name
   email
   phone
   hobbies {
     name
     frequency
   }
 }
}
```

The response would look like the following:

```
{
  "data": {
    "user": {
      "name":  "Jane Doe"
      "email": "JaneDoe@example.com"
      "phone": "012-345-6789"
      "hobbies": [
        {
          "name": "painting",
          "frequency": "weekly"
        },
        {
          "name": "video games",
          "frequency": "daily"
        }
      ]
    }
  }
}
```

Notice how the user's `hobbies` are returned in an `array` as defined in the schema.

## Learn more

This topic just covers the basics of GraphQL.
To learn more, visit the [GraphQL][] website.

[GraphQL]: https://graphql.org/