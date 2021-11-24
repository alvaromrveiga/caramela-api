<h1 align="center">Caramela API</h1>
<p align="center">API para acompanhar as vacinações, consultas, peso, idade do seu pet</p>
<p align="center"><a href="https://caramela-api.herokuapp.com/docs/" target="_blank"><b>🔗 Docs e Demo usando Swagger</b></a></p>

<p align="center"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white"/></p>

## 📑 Tabela de conteúdos
<!--ts-->
   * [📌 Features](#-features)
   * [🔧 Instalação](#-instalação)
   * [🖇️ Requisições no Insomnia](#%EF%B8%8F-requisições-no-insomnia)
   * [💻 Tecnologias](#-tecnologias)
   * [📄 Licença](#-licença)
<!--te-->

## 📌 Features
- [x] CRUD de usuário
- [x] Upload de foto de usuário
- [x] Autenticação de usuário
- [x] Envio de e-mail ✉️
- [x] CRUD de pets 😸 🐶 🐹 🐭 🐰 🐴 🐮 🐷
- [x] Upload de foto de pet 
- [x] Criação e leitura de Consultas

## 🔧 Instalação

1. Você precisará do [Node.js](https://nodejs.org/en/) e recomendo que use o [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)
    - Se não quiser usar o Docker, precisará subir sua própria instância do [PosgreSQL](https://www.postgresql.org/)

1. Iniciar servidor
```bash
# Clona o projeto para sua máquina
git clone https://github.com/alvaromrveiga/caramela-api

# Entra na pasta do projeto
cd caramela-api

# Instala as dependências
yarn

# Sobe o container com a aplicação e o banco de dados
# Dependendo da sua instalação pode ser necessário usar sudo logo antes do comando abaixo
docker-compose up -d

# Roda as migrations
yarn typeorm migration:run

# O servidor abrirá na porta 3333. Você pode acessar os docs em http://localhost:3333/docs/
```

3. Crie um arquivo .env na raiz do projeto preenchendo as informações descritas no [.env.example](https://github.com/alvaromrveiga/caramela-api/blob/main/.env.example)

4. Para olhar os logs use:
```bash
# Dependendo da sua instalação pode ser necessário usar sudo logo antes do comando abaixo
docker logs -f caramela-api
```

5. Para rodar os testes:
```bash
yarn test:all
```

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
