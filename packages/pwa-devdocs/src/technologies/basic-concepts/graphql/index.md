---
Title: GraphQL
contributors: Jstein19
---

## Overview
- [What is GraphQL](what-is-graphql)
- [Benefits provided by GraphQL](benefits-provided-by-graphql)
- [Why use GraphQL over REST](why-use-graphql-over-rest)
- [Sample queries](sample-queries)
- [Learn more](learn-more)

---

## What is GraphQL

**GraphQL** is a language for querying and manipulating data. It is widely viewed as more powerful, flexible, and efficient than REST.

## Benefits provided by GraphQL

- **Predictable results from your queries**

 A **GraphQL** query returns only data the user asks for in their query. No more, no less.

- **Single request for many results**

 A single request made through **GraphQL** can return any number of resources and their fields by following references between them defined in the **typed schema**.

- **Organized data with a typed schema**

 A single **schema** defines how users access data with **GraphQL**. These **schemas**, formatted as JSON objects, let users know exactly how to get the data they need.

 Here's an example **schema**. It defines a `Species` as having the **fields** `name` and `origin`.

 `origin` is a **type** `Planet`, which has a **field** of `name`.

 - **Schema**

    ```
    type Species {
      name: String
      origin: Planet
    }

    type Planet {
      name: String
    }
    ```

  Later we will explore how to utilize **typed schemas**.

## Why use GraphQL over REST

While **GraphQL** and **REST** are both specifications for constructing and querying APIs, **GraphQL** has some significant advantages over REST.

 - **No versioning**

  **REST** APIs will typically have multiple versions - v1, v2, etc. This is because updating endpoints in **REST** will often impact existing queries.

  With **GraphQL**, there is no need for versioning, since new **types** and **fields** can be added to the **schema** without impacting existing queries.

  In addition, "removing" fields can be done through **deprecation** instead of just deleting them from the **schema**. If an old query still tries to read a **deprecated** field, GraphQL can display a customized warning.

  ```
    type ExampleType {
      firstName: String
      lastName: String
      name: String @deprecated(reason: "Split this field into two. Use `firstName` and `lastName`")
  }
  ```

  This prevents old queries from throwing confusing errors when trying to read outdated fields, lending to code maintainability.

- **Faster and more efficient**

  **REST** APIs typically require loading from multiple URLs. Imagine a **REST API** designed to get users and their forum posts. `users/<id>` would return information like `name` and `user/<id>/posts` would have to be queried separately to return the user's `comments`.

  With **GraphQL**, these `types` and their `fields` could be returned with one query, saving calls to the API. In this case, a `type` of `User` has a `field` `posts` which is `typed` as an array of `Post`s.

  - **Schema**

    ```
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
  - **Query**

    ```
    {
     user(id: 12345) {
       name
       posts {
         title
       }
     }
    }
    ```

  - **Response**

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

  Now one query could return a `User` with an array of `Post`s, all with their own `fields`. Only one query necessary!

  _Hint: the bang (!) next to a field indicates it is `non-nullable`, which means the **GraphQL** service promises to always return a value for this field on a query._


## Sample queries

 - **Most basic query**

  Imagine a database that simply contains an object `user`, with the fields `name`, `email`, and `phone`.

  A simple query to get this data would look like:

  - **Schema**

    ```
    type Query {
      user: User
    }

    type User {
      name: String
      email: String
      phone: String
    }
    ```

  - **Query**

     ```
     {
      user {
        name
        email
        phone
      }
     }
     ```

  - **Response**

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

- **Pick and choose data**

  What if you don't need the `phone` number for your `user`? You could rewrite the above query to only return the fields you need.

  - **Schema**

    ```
    type Query {
      user: User
    }

    type User {
      name: String
      email: String
      phone: String
    }
    ```

  - **Query**

    ```
    {
     user {
       name
       email
     }
    }
    ```

  - **Response**

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


- **Passing in arguments**

  Now, what if you had multiple users and needed to grab a specific one by `id`? Well, with **GraphQL** you can pass in `args`, like so:

  - **Schema**

    ```
    type Query {
      user(id: Int): User
    }

    type User {
      id: Int
      name: String
      email: String
      phone: String
    }
    ```

  - **Query**

    ```
    {
     user(id: 12345) {
       id
       name
       email
     }
    }
    ```

  - **Response**

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

  Notice we are requesting `id` as a `field` in our response. This is completely optional: it is just to demonstrate the correct user being returned.

- **Getting additional resources**

  In this example, imagine that in our database a `user` can have `hobbies`. We could get an `array` of a user's `hobbies` like so:

  - **Schema**

    ```
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

  - **Query**

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

  - **Response**

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

  Notice how the user's `hobbies` are returned in an `array`.

## Learn more

This topic just covers the basics of **GraphQL**. To learn more, visit https://graphql.org/.
