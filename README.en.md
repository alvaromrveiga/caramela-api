<h1 align="center">Caramela API</h1>
<p align="center">API to manage your pets' vaccinations, consultations, weight and age</p>
<p align="center"><b>Leia em <a href="https://github.com/alvaromrveiga/caramela-api/blob/main/README.md">PortuguΓͺs</a></b></p>

<p align="center"><a href="https://caramela-api.herokuapp.com/docs/" target="_blank"><b>π Docs and Demo using Swagger</b></a></p>

<p align="center"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white"/></p>

## π Table of contents
<!--ts-->
   * [π Features](#-features)
   * [π Demo](#-demo)
   * [π§ Installation](#-installation)
   * [ποΈ Insomnia Requests](#%EF%B8%8F-insomnia-requests)
   * [π» Technologies](#-technologies)
   * [π License](#-license)
<!--te-->

## π Features
- [x] User CRUD
- [x] User photo upload
- [x] User authentication
  - [x] JWT, Refresh Token and Refresh Token Rotation
- [x] E-mail sending βοΈ
  - [x] Password reset
- [x] Pets CRUD
- [x] Pets photo upload πΈ πΆ π­ π°
- [x] Consultations creation and visualization

## π Demo
[π Docs and Demo using Swagger](https://caramela-api.herokuapp.com/docs/)

## π§ Installation

1. You will need [Node.js](https://nodejs.org/en/) and [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) are recommended.
    - If you don't want to use Docker, you will need your own instance of [PostgreSQL](https://www.postgresql.org/)

1. Start server
```bash
# Clones the project to your machine
git clone https://github.com/alvaromrveiga/caramela-api

# Enters the project's folder
cd caramela-api

# Install dependencies
yarn

# Starts the Docker container with the application and the database
# Depending on your Docker installation, you may need to use sudo right before the command below
docker-compose up -d

# Run migrations
yarn typeorm migration:run

# Server will start on port 3333. You can check documentation at http://localhost:3333/docs/
```

3. Create the .env file on the project root filling the information described in [.env.example](https://github.com/alvaromrveiga/caramela-api/blob/main/.env.example)

4. To check Docker logs use:
```bash
# Depending on your Docker installation, you may need to use sudo right before the command below
docker logs -f caramela-api
```

5. To run tests:
```bash
# It may take a few minutes
# 44 suites and 147 tests
yarn test:all
```

  - #### Test coverage:
    ![Test-Coverage](https://github.com/alvaromrveiga/caramela-api/blob/main/assets/test-coverage.png)

## ποΈ Insomnia requests
The 22 requests collection to test your project on [Insomnia](https://insomnia.rest/download) can be found [here](https://github.com/alvaromrveiga/caramela-api/blob/main/assets/Insomnia_caramela-api.json).
  - To import in Insomnia:
    - Click the gear symbol on the upper right of the screen
    - Data tab
    - Import data
    - From file
    - Select the file Insomnia_caramela-api.json inside the assets folder in the root of this project's folder

![Insomnia requests](https://github.com/alvaromrveiga/caramela-api/blob/main/assets/Screenshot_Insomnia_caramela-api.png)

## π» Technologies
- [Typescript](https://www.typescriptlang.org/) and [ts-node-dev](https://github.com/wclr/ts-node-dev) - descrease errors and real time compiling
- [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/) - build the server
- [Express async errors](https://github.com/davidbanham/express-async-errors) - handle asynchronous errors
- [Docker](https://www.docker.com/) - make installing easier
- [Heroku](https://www.heroku.com/) - deploy
- [TypeORM](https://typeorm.io/#/) with [PostgreSQL](https://www.postgresql.org/) - data storage
- [Multer](https://www.npmjs.com/package/multer) - file upload
- [Json Web Token](https://jwt.io/) - login token and refresh token
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - password hashing
- [Nodemailer](https://nodemailer.com/about/) - send emails
- [Ethereal Mail](https://ethereal.email/) - email testing
- [Sendgrid Email API](https://sendgrid.com/solutions/email-api/) - free email service
- [Handlebars](https://handlebarsjs.com/) - email template as HTML
- [Day.js](https://day.js.org/) - dates math
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) - documentation
- [Tsyringe](https://github.com/microsoft/tsyringe) - dependency injection
- [Uuid](https://github.com/uuidjs/uuid) - generate UUIDs
- [Validator](https://github.com/validatorjs/validator.js) - email validation
- [Dotenv](https://github.com/motdotla/dotenv) - load environment variables from .env file
- [Pg-connection-string](https://www.npmjs.com/package/pg-connection-string) - manage database_url environment variable
- [Jest](https://jestjs.io/), [ts-jest](https://github.com/kulshekhar/ts-jest), [jest-mock-extended](https://github.com/marchaos/jest-mock-extended) and [SuperTest](https://github.com/visionmedia/supertest) - tests
- [ESLint](https://eslint.org/) - linting
- [Prettier](https://prettier.io/) - code formatting

## π License
[MIT](https://github.com/alvaromrveiga/caramela-api/blob/main/LICENSE)
