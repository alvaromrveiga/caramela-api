<h1 align="center">Caramela API</h1>
<p align="center">API to manage your pets' vaccinations, consultations, weight and age</p>
<p align="center"><b>Leia em <a href="https://github.com/alvaromrveiga/caramela-api/blob/main/README.md">Português</a></b></p>

<p align="center"><a href="https://caramela-api.herokuapp.com/docs/" target="_blank"><b>🔗 Docs and Demo using Swagger</b></a></p>

<p align="center"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white"/></p>

## 📑 Table of contents
<!--ts-->
   * [📌 Features](#-features)
   * [📚 Demo](#-demo)
   * [🔧 Installation](#-installation)
   * [🖇️ Insomnia Requests](#%EF%B8%8F-requisições-no-insomnia)
   * [💻 Technologies](#-tecnologias)
   * [📄 License](#-licença)
<!--te-->

## 📌 Features
- [x] User CRUD
- [x] User photo upload
- [x] User authentication
  - [x] JWT, Refresh Token and Refresh Token Rotation
- [x] E-mail sending ✉️
  - [x] Password reset
- [x] Pets CRUD
- [x] Pets photo upload 😸 🐶 🐭 🐰
- [x] Consultations creation and visualization

## 📚 Demo
[🔗 Docs and Demo using Swagger](https://caramela-api.herokuapp.com/docs/)

## 🔧 Installation

1. You will need [Node.js](https://nodejs.org/en/) and [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) are recommended.
    - If you don't want to use Docker, you will need your own instance of [PosgreSQL](https://www.postgresql.org/)

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

## 🖇️ Requisições no Insomnia
A coleção de 22 requisições para testar o projeto no [Insomnia](https://insomnia.rest/download) pode ser encontrada [aqui](https://github.com/alvaromrveiga/caramela-api/blob/main/assets/Insomnia_caramela-api.json). 
  - Para importar no Insomnia:
    - Clique na engrenagem no canto superior direito
    - Aba de Data 
    - Import Data
    - From File
    - Selecione o arquivo Insomnia_caramela-api.json dentro da pasta assets na raiz do projeto

![Insomnia requests](https://github.com/alvaromrveiga/caramela-api/blob/main/assets/Screenshot_Insomnia_caramela-api.png)

## 💻 Tecnologias
- [Typescript](https://www.typescriptlang.org/) e [ts-node-dev](https://github.com/wclr/ts-node-dev) - minimizar erros e compilar em tempo real)
- [Node.js](https://nodejs.org/en/) e [Express](https://expressjs.com/) - construir o servidor
- [Express async errors](https://github.com/davidbanham/express-async-errors) - lidar com erros assíncronos
- [Docker](https://www.docker.com/) - facilitar instalação
- [Heroku](https://www.heroku.com/) - deploy
- [TypeORM](https://typeorm.io/#/) com [PostgreSQL](https://www.postgresql.org/) - armazenar dados
- [Multer](https://www.npmjs.com/package/multer) - upload de arquivos
- [Json Web Token](https://jwt.io/) - token de login e refresh token
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - hashs de senhas
- [Nodemailer](https://nodemailer.com/about/) - envio de emails
- [Ethereal Mail](https://ethereal.email/) - teste de emails
- [Sendgrid Email API](https://sendgrid.com/solutions/email-api/) - envio de emails gratuito
- [Handlebars](https://handlebarsjs.com/) - template de email em HTML
- [Day.js](https://day.js.org/) - cálculos envolvendo datas
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) - documentação
- [Tsyringe](https://github.com/microsoft/tsyringe) - injeção de dependência
- [Uuid](https://github.com/uuidjs/uuid) - gerar uuids
- [Validator](https://github.com/validatorjs/validator.js) - validar emails
- [Dotenv](https://github.com/motdotla/dotenv) - carregar variáveis de ambiente do arquivo .env
- [Pg-connection-string](https://www.npmjs.com/package/pg-connection-string) - organizar a variável de ambiente database_url
- [Jest](https://jestjs.io/), [ts-jest](https://github.com/kulshekhar/ts-jest), [jest-mock-extended](https://github.com/marchaos/jest-mock-extended) e [SuperTest](https://github.com/visionmedia/supertest) - testes
- [ESLint](https://eslint.org/) - linting
- [Prettier](https://prettier.io/) - formatação de código

## 📄 Licença
[MIT](https://github.com/alvaromrveiga/caramela-api/blob/main/LICENSE)
