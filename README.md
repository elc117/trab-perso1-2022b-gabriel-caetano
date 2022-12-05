# adonis5-base-project

This is a base repository for new Adonis5 projects. It includes:

- All routes DOCUMENTED inside Insomnia.yaml (Docs tab)
- Authentication (using API tokens)
- Definition of roles (middleware RoleDetector)
- AWS S3 / SES integration
- Basic migration/models/controllers for users, roles, tokens, profile pictures, user password
- Validators 
- Basic Admin routes (controllers methods, migration and model)


## Requirements

- Node.js (& npm) 
- Yarn
- SGBD (e.g MySQL)


## Install

```sh
  $ yarn install
```


## Prepare environment
```sh
  cp .env.example .env
```


## Run migrations and seed database

```sh
  $ node ace migration:run
  $ node ace db:seed
```


## Serve

```sh
  $ yarn dev
```


## Linter

```sh
  $ yarn lint --fix
```
