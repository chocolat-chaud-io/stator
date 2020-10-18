[![Github action status](https://github.com/yann510/stator/workflows/stator%20CI/badge.svg)](https://github.com/yann510/stator/actions)
[![Coverage Status](https://coveralls.io/repos/github/yann510/stator/badge.svg?branch=master)](https://coveralls.io/github/yann510/stator?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Stator

Stator, your go-to template for the perfect stack.

# Why?

Have you ever started a new project by yourself?
If so, you probably know that it is tedious to set up all the necessary tools.
Just like you, the part I enjoy the most is coding, not boilerplate.
stator solves all of this for you by using the latest technologies' most up-to-date standards.
Indeed, this template is opinionated as to what's the best, but it does enforce excellent practices such as **code re-usability**, **enforces coding guidelines**, **usage of a monorepo**, etc.

If you want more details about how this idea was implemented, I recommend reading the [series of blog articles](https://yann510.hashnode.dev/creating-the-modern-developer-stack-template-part-1-ckfl56axy02e85ds18pa26a6z) I wrote on the topic.

# Demo Application

![demo application](readme-assets/todo-demo.gif)

## Introduction

This template includes a demo todo application that serves as an example of sound patterns.
Of course, you won't be creating a todo application for your project, but you can use this as an example of useful patterns and learn how to use the technologies presented in this project.

## Prerequisites

- [Docker Compose](https://docs.docker.com/compose/install/)
- [node.js](https://nodejs.org/en/download/) your version must >= 14

## Overview

Stator is a full-stack pre-configured template for your projects.
The technologies used are mentioned below:

### Database

- [Postgres](https://github.com/postgres/postgres)
- [Mongo](https://github.com/mongodb/mongo)

### Backend
- [TypeORM](https://github.com/typeorm/typeorm)
- [Nest](https://github.com/nestjs/nest)
- [Fastify](https://github.com/fastify/fastify)
- [NestJs CRUD](https://github.com/nestjsx/crud)

### Frontend

- [React](https://github.com/facebook/react)
- [Redux Toolkit](https://github.com/reduxjs/redux-toolkit)
- [React Router](https://github.com/ReactTraining/react-router)
- [axios](https://github.com/axios/axios)

# Getting started

### Copy the template

This repository is a repository template, which means you can use the `Use this template` button at the top to create your project based on this.

![use template button](readme-assets/use-template.png)

\*Note: If you have an existing repository, this will require more work. I would recommend using the `use template button` and migrating your current code to the newly created projects.

### Make it yours

You will now want to make this project yours by replacing all `stator` occurrences with your own project name.
Thankfully, we have a script just for that:

`npm run rename-project {YOUR_PROJECT_NAME}`

\*Note: I highly recommend that the project name is the same as your git repository.

The file will delete itself once it has been completed.
On completion, you will see the following message:

![project appropriation success](readme-assets/project-appropriation-success.png)

### Install the dependencies

You can now install the dependencies:

`npm i`

### Run the whole stack

Running the database:

`npm run postgres`

Running the api:

`npm start api`

Running the webapp:

`npm start webapp`

Running all the tests:

`npm run affected:test && npm run affected:e2e`

For a full list of available commands, consult the `package.json`.

### Github Actions

This templates integrates Github Actions as Continuous Integration. The existing workflows are under `.github/workflows`. 
To have the CI working, you must:
- Link your repository with [Coveralls](https://coveralls.io/repos/new).
- (Optional) Insert your [Nx Cloud](https://nx.app/) access token in github secrets under `NX_CLOUD_TOKEN`. This enables for caching and faster build times.


# Technologies used

## Database

### Postgres

There are 2 databases available, postgres and mongo.
To ensure your developers don't get into any trouble while installing those, they are already pre-configured with `docker-compose.yml` files.

**By default, the project uses postgres.**
If this is what you want, you're good to go; everything will work out of the box.

### Mongo [NOT RECOMMENDED]

If you would like to use mongodb, even though it is absolutely not recommended because it currently doesn't work well with [typeorm](https://github.com/typeorm/typeorm), you can still do that by updating the connection info under `./apps/api/src/config/configuration.ts`.
You simply need to replace `type: "postgres"` with `type: "mongo"`.

### Seeding data

If you want your database to be pre-populated with that, it is very easy to do so.
For postgres add your `sql` statements to `apps/database/postgres/init.sql` file.
For mongo add your mongo statements to `apps/database/mongo/mongo-entrypoint/seed-data.js` file.

## Backend

We are using cutting edge technologies to ensure that you get the best development experience one could hope for.
To communicate with the database, we make use of the great [typeorm](https://github.com/typeorm/typeorm).
We use the code-first approach, which means defining your models will also represent your tables in your database.
Here is an example:

```typescript
import { Column, Entity } from "typeorm"
import { RootEntity } from "./root.entity"
import { MinLength } from "class-validator"

@Entity()
export class Todo extends RootEntity {
  @Column()
  @MinLength(5, { always: true })
  text: string
}
```

To serve your API requests, we make use of [nest](https://github.com/nestjs/nest) alongside with [fastify](https://github.com/fastify/fastify) to ensure blazing fast [performance](https://github.com/fastify/fastify#benchmarks).

To reduce the boilerplate commonly found around creating a new entity, we are using the [nestjsx/crud](https://github.com/nestjsx/crud) plugin that will generate all necessary routes for CRUD operations.

Here is an example from our todo app:

```typescript
import { Controller } from "@nestjs/common"
import { Crud, CrudController } from "@nestjsx/crud"
import { Todo } from "@stator/models"

import { TodosService } from "./todos.service"

@Crud({ model: { type: Todo } })
@Controller("todos")
export class TodosController implements CrudController<Todo> {
  constructor(public service: TodosService) {}
}
```

Of course, you're probably wondering if this actually works.
To convince you, we have implemented integration tests that perform real requests using [supertest](https://github.com/visionmedia/supertest).

**Can I view the generated endpoints?** Well, of course, you can!

We now have generated [swagger documentation](https://github.com/fastify/fastify-swagger) that is viewable with the beautiful [redoc](https://github.com/Redocly/redoc).

Once you navigate to [localhost:3333](http://localhost:3333), you will see this:

![redoc](readme-assets/redoc.png)

## Frontend

For our webapp, we're using the very popular [react](https://github.com/facebook/react) alongside [redux-toolkit](https://github.com/reduxjs/redux-toolkit) and [react-router](https://github.com/ReactTraining/react-router).
We highly recommend that you use [function components](https://reactjs.org/docs/components-and-props.html) as demonstrated in the example.

To further reduce the boilerplate necessary for redux-toolkit we provide you with a `thunkFactory` which allows you to generate all actions needed for a CRUD endpoint.

Here is how you use it:

```typescript
import { Todo } from "@stator/models"

import { thunkFactory } from "../utils/thunkFactory"

export const todoThunks = {
  ...thunkFactory<Todo>("/todos"),
}
```

We also provide a `sliceReducerFactory` that will generate the required reducers for the thunks you just created.

Here is how you use it:

```typescript
import { Slice, createSlice } from "@reduxjs/toolkit"
import { Todo } from "@stator/models"

import { sliceReducerFactory } from "../utils/sliceReducerFactory"
import { SliceState, getInitialSliceState } from "../utils/SliceState"
import { todoThunks } from "./todos.thunk"

export interface TodoState extends SliceState<Todo> {}

export const todoSlice: Slice = createSlice({
  name: "todos",
  initialState: getInitialSliceState<TodoState, Todo>(),
  reducers: {},
  extraReducers: {
    ...sliceReducerFactory<Todo, TodoState>(todoThunks),
  },
})
```

As you can see, everything is typed adequately. Thus you will get auto-completion when developing.

Now let's say we want to fetch all our todos from our API, we can simply do this:

```typescript
dispatch(todoThunks.getAll())
```

While the API is processing, we would like to add a loading.
That is very easy because our `thunkFactory` handles all of this for us. You can access the loading status like this:

```typescript
todoState.status.getAll.loading
```

For a complete example of CRUD operations, consult the `app.tsx` file.

In our example, we are using [material-ui](https://github.com/mui-org/material-ui), but you could replace that with any other framework.

We also use [axios](https://github.com/axios/axios) to simplify our requests handling as it works very well with TypeScript.

## Global

We strongly believe that typing helps create a more robust program; thus, we use [TypeScript](https://github.com/microsoft/TypeScript).

To facilitate and optimize the usage of the monorepo, we make use of [NX](https://github.com/nrwl/nx).

[eslint](https://github.com/eslint/eslint) enforces excellent standards, and [prettier](https://github.com/prettier/prettier) helps you apply them.

Commit messages must abide to those [guidelines](https://www.conventionalcommits.org/en/v1.0.0/). If you need help following them, simply run `npm run commit` and you will be prompted with an interactive menu.

File and directory names are enforced by the custom made `enforce-file-folder-naming-convention.js`.

Branch names are enforced before you even commit to ensure everyone adopts the same standard: `{issue-number}-{branch-work-title-kebab-case}`.

For end to end testing, we use the notorious [cypress](https://github.com/cypress-io/cypress).

We also have a pre-built CI toolkit for you that will build and run the tests.
