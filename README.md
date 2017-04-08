# Hapi and PostgreSQL example

## Getting Start
0. Clone this project
1. Install PostgreSQL and start it.
2. Install node package with
```
npm install
```
3. Copy `.env.example` rename to `.env` for config project environment
```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=password
DB_NAME=postgres
JWT_SECRET={YOUR JWT SECRET KEY}
JWT_ALGORITHM=HS256
```
4. Create `users` table by `knex migrate` with
```
knex migrate:latest            
```
*Optional If you need starter data, can run `knex seed` with
```
knex seed:run           
```
5. Start project
```
npm start
```

## Dependencies
- [Hapi.js]() A rich framework for building applications and services.
- [Knex.js]() A query builder for PostgreSQL and a plethora of other RDBMS.
- [JWT]() JSON Web Token.


This project base on [tutorial](https://scotch.io/tutorials/making-a-restful-api-with-hapi-js) from scotch.io.
