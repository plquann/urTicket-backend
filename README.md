<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

![All-contributors](https://img.shields.io/badge/contributors-1-blue.svg)
![Docker-image](https://img.shields.io/docker/image-size/quankhs/urticket-backend-dev?color=important&label=docker%20image)
![CI](https://img.shields.io/github/workflow/status/quankhs/urTicket-backend/Build%20and%20Deploy/master)
![Code Climate](https://img.shields.io/github/commit-activity/w/quankhs/urticket-backend?color=orange)
[![CodeFactor](https://www.codefactor.io/repository/github/quankhs/urticket-backend/badge/master)](https://www.codefactor.io/repository/github/quankhs/urticket-backend/overview/master)
[![License](https://img.shields.io/github/license/quankhs/urticket-backend?color=blue)](https://img.shields.io/github/license/quankhs/urticket-backend?color=blue)
[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FQuanKhs%2FurTicket-backend&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

# 🍿 Backend for movie platform `urTicket`

## 🚀 Overview

- Backend RESTful API for movie platform urTicket using Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications
- TypeScript - TypeScript is a superset of JavaScript that compiles to plain JavaScript
- PostgreSQL - Relational Database is used for database management
- Docker - Containerization is used for deployment
- TypeORM - TypeORM is a library for Node.js that helps you to work with your database using TypeScript
- Swagger - Swagger is a tool for documenting RESTful APIs

## ⚡ What I've learned:

- Modular architecture, Design pattern, takes advantage of latest JavaScript features with NestJS
- A REST API is an application programming interface that conforms to specific architectural constraints, like stateless communication and cacheable data. It is not a protocol or standard, but a set of rules for how to communicate with a server.
- Using SQL techniques and common commands (INSERT INTO, WHERE, ORDER BY, ON DELETE CASCADE, etc) will enable you to create tables, column types and define the schema of your data in PostgreSQL
- Data modeling and how to represent one-to-one, one-to-many and many-to-many relationships in PostgreSQL.
- Full-text search in PostgreSQL using PostgreSQL's full-text search functions.
- Make the managing of a database more convenient, we use an Object-relational mapping (ORM) tool called TypeORM.
- Build a Payment method using Stripe API
- Implementing in-memory cache to increase the performance with Redis
- The OpenAPI specification with Swagger which supports by Swagger plugin in NestJS
- How to build and deploy a Docker image with Dockerfile, optimization of Dockerfile, and how to use Docker Compose to deploy multiple Docker images
- Deployment to Digital Ocean droplets using Nginx - reverse proxy and SSL
- Implement a modern CI/CD pipeline with GitHub Actions and Docker

## 🚒 Check out my Frontend side:

```
https://github.com/QuanKhs/urTicket-frontend
```

## 🌋 Folder structure

<details>
  <summary>Click to expand</summary>
    <br>
  
- 📂 **\urTicket\-backend**
  - 📂 **initialize\-postgres**
  - 📂 **src**
    - 📂 **auth**
    - 📂 **base**
    - 📂 **cards**
    - 📂 **common**
    - 📂 **constants**
    - 📂 **database**
    - 📂 **files**
    - 📂 **filters**
    - 📂 **genres**
    - 📂 **group\-theater**
    - 📂 **interceptors**
    - 📂 **mail**
    - 📂 **mailConfirmation**
    - 📂 **movies**
    - 📂 **news**
    - 📂 **people**
    - 📂 **pipes**
    - 📂 **products**
    - 📂 **reservations**
    - 📂 **reviews**
    - 📂 **seats**
    - 📂 **showtimes**
    - 📂 **stripe**
    - 📂 **swagger**
    - 📂 **theaters**
    - 📂 **tickets**
    - 📂 **users**
    - 📄 [app.controller.ts](src/app.controller.ts)
    - 📄 [app.module.ts](src/app.module.ts)
    - 📄 [app.service.ts](src/app.service.ts)
    - 📄 [main.ts](src/main.ts)
  - 📂 **test**
  - 📄 [Dockerfile](Dockerfile)
  - 📄 [README.md](README.md)
  - 📄 [docker\-compose.prod.yml](docker-compose.prod.yml)
  - 📄 [docker\-compose.yml](docker-compose.yml)
  - 📄 [package\-lock.json](package-lock.json)
  - 📄 [package.json](package.json)
  - 📄 [tsconfig.build.json](tsconfig.build.json)
  - 📄 [tsconfig.json](tsconfig.json)

</details>
## ✨ Installations

- ### With Docker

1. Install Docker and Docker compose ([from the Docker website](https://www.docker.com/get-started))

2. Fork and clone the urticket-backend repo ([see Contributing page](CONTRIBUTING.md))
   ```bash
   git clone https://github.com/QuanKhs/urTicket-backend.git
   ```
3. From the src folder run:

   ```bash
   docker-compose up
   ```

4. Open a browser to see the application running

   ```bash
   http://localhost:5000/api/v1/doc/#
   ```

5. To shutdown the application run:
   ```bash
   docker-compose down
   ```

- ### Without Docker (for development/debugging)

1. Fork and clone the urticket-backend repo ([see Contributing page](CONTRIBUTING.md))

   ```bash
   git clone https://github.com/QuanKhs/urTicket-backend.git
   ```

2. Install dependencies & add them to your path:

- [Node.js and npm](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [PgAdmin](https://www.pgadmin.org/download/)

3. Create a new PostgreSQL database: you can find `urticket.sql` in the `initialize-postgres` folder

- [Create a new database](https://www.postgresql.org/docs/current/tutorial-create-db.html)
- [Import the database](https://www.postgresql.org/docs/current/tutorial-sql-dump.html)

3. Start the urticket-backend server:

   ```bash
   npm install
   npm run start
   ```

4. (Optional) Start Node services by running `npm run start:dev` to start the Node services in development mode:

   ```bash
   npm run start:dev
   ```

## 🏳‍🌈 Release

1. ### Docker hub: [Docker image](https://hub.docker.com/r/quankhs/urticket-backend-dev)
2. ### Server: [Server](https://quankhs-urticket.online/api/v1/docs/#/)

## 🥇Contributors

<table>
  <tr>
    <td align="center"><a href="https://github.com/quankhs"><img src="https://avatars.githubusercontent.com/u/60533507?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Quankhs</b></sub></a><br />
      <a href="#" title="Ideas">💡</a>
      <a href="#" title="Coding">👨‍💻</a>
      <a href="#" title="Planning">💭</a>
      <a href="#" title="Fix bugs">🐛</a>
      <a href="#" title="Scares">😩</a>
      <a href="#" title="Angry">👿</a>
    </td>
  </tr>
</table>

## 🤝 Contacts and social networks

[![Facebook](https://img.shields.io/badge/-quankhs-blue?style=flat-square&logo=Facebook&logoColor=white&link=https://www.facebook.com/quanphamluong)](https://facebook.com/quanphamluong)
[![GitHub](https://img.shields.io/badge/-quankhs-success?style=flat-square&logo=Github&logoColor=white&link=https://www.linkedin.com/in/quankhs/)](https://github.com/quankhs)
[![Gmail](https://img.shields.io/badge/-quanphamluong-red?style=flat-square&logo=Gmail&logoColor=white&link=https://www.linkedin.com/in/quankhs/)](mailto:quanphamluong@gmail.com)
[![Linkedin: quankhs](https://img.shields.io/badge/-quankhs-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/quankhs/)](https://www.linkedin.com/in/quankhs/)
