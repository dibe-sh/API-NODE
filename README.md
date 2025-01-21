# API-NODE 🔗

![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white) ![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![VSCode](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white) ![NodeJs](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![MarkDown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)

## Table of contents

- [API-NODE 🔗](#api-node-)
  - [Table of contents](#table-of-contents)
  - [Requirements ☑️](#requirements-️)
  - [Setup 🛠️](#setup-️)
  - [Running Project 🏃‍♂️](#running-project-️)
  - [Building Project 🛠️](#building-project-️)
  - [Test Cases 🧪](#test-cases-)
  - [Other Relevant documentation 📖](#other-relevant-documentation-)
  - [Todo's 📝](#todos-)
  - [License 🗒️](#license-️)

## Requirements ☑️

Some of the major requirements for this project are:

1. [Docker](https://www.docker.com/)
2. [NodeJs](https://nodejs.org/)

## Setup 🛠️

> 📔 Make sure you have **yarn installed** or simply run **`npm install --global yarn`**. This will setup yarn globally
> 📔 Make sure your docker engine is also running.

If you have `yarn` and `docker` setup then just run following commands.

Navigate to project directory on terminal and.

1. Run `yarn setup` -> This will install all dependencies and make sure your `environment` setup is done.

2. Replace your `GET_YOUR_TOKEN` token on [`.env`](.env) file with your `WEBZIO_TOKEN`

```text
WEBZIO_TOKEN = GET_YOUR_TOKEN
```

3. Run `docker-compose up` or `docker compose up` -> This will Setup your database configured on your environment file and run app on dev mode.

## Running Project 🏃‍♂️

If you have completed setup you must have a running project. You can run the project using following command.

> 📔 Make sure your docker is running.

```bash
docker compose up
```

## Building Project 🛠️

You can build project using following command.

1. `yarn build` -> generates build on `dist` directory
2. `yarn start` -> will execute the build and spin up server. _"Make sure you have configured your env's properly while running on build mode"_

## Test Cases 🧪

To run tests just run following commands.

1. Unit tests -> `yarn test`
2. Test Coverage -> `yarn test:cov`

## Other Relevant documentation 📖

All the other relevant documents are kept under [`documents` directory](./documents/Readme.md)

1. [Database Schema](./documents/DatabaseSchema.md)
2. [API Documentation](./documents/APIDocumentation.md)

## Todo's 📝

1. Update [`WebzOptions`](src/webz/interfaces/webz-options.interface.ts) to support more parameters

```Typescript
export interface WebzOptions {
  queryString?: string;
}
```

1. Validate query string and avoid passing all parameters one query string

## License 🗒️

This project is licensed under the [MIT License](./LICENSE).
