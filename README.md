# GraphQL-Bootcamp
Code from the GraphQL Bootcamp by Andrew Mead on [Udemy](https://www.udemy.com/course/graphql-bootcamp)

## Progress

33 - Completed Section 3

## Query examples for reference

These are query and mutation examples to remember the syntax when it's more than
just a simple query or mutation.

### Name your queries in the GraphQL playground

If you name your queries and mutations, then you can have multiple ones
there and pressing the go button will then show a list of queries and
mutations to run. e.g.

```
query Users {
  users {
    id
    name
    email
    age
    posts { title }
    comments { text }
  }
}

mutation NewPost {
  createPost(
    data: {
      title: "A new hope"
      body: "Battle among the stars"
      published: true
      author: "10"
    }
  ) {
    id
    title
    body
    author { name }
  }
}

mutation DeleteUser {
  deleteUser(id: "10") {
    id
    name
  }
}

mutation updateUser {
  deleteUser(id: "10", data: { email: 'newjulian@example.com }) {
    id
    name
    email
  }
}
```

### Fragments and Named Results
```
{
  first: company(id: "1") {   /* named result */
    ...companyDetails
  }

  company(id: "2") {
    ...companyDetails
  }
}

mutation {
  addCompany(name: "Woolworth") {
    ...companyDetails
  }
}

fragment companyDetails on Company {
  id, name, description
}
```

### Parameterised Queries and Mutations
```
query Song($id: ID!) {
  song(id: $id) {
    id, title
  }
}

mutation AddSong($title: String!) {
  addSong(title: $title) {
    id
  }
}
```

## Differences from Andrew

* I have installed ESLint in each project. My preferences are semicolons and
  single-quotes YMMV :-)

* I have kept the basics files.

* I destructure much more and don't declare redundant arguments, so this:

```
Post: {
  author: (parent, args, context, info) => USERS.find((user) => parent.author === user.id),
},
```

becomes this

```
Post: {
  author: ({ author }) => USERS.find(({ id }) => author === id),
},
```

at least in the early stages.

## Git client

I have used Git at the command-line for more than 10 years. Over that time, I have tried
many different graphical shells for Git, without finding one that was easier
and nicer to use than the command-line (in my view).

I have now found that [GitKraken](https://www.gitkraken.com) is an excellent
Git shell and would advise using it to everyone.

## Questions

If you have any questions about this repository, or any others of mine, please
don't hesitate to contact me.
