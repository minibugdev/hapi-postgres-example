require('dotenv').config();

const ENV = process.env;

module.exports = {
    development: {
        migrations: {
            tableName: 'knex_migrations'
        },
        seeds: {
            tableName: './seeds'
        },
        client: 'pg',
        connection: {
            host: ENV.DB_HOST,
            user: ENV.DB_USER,
            password: ENV.DB_PASSWORD,
            database: ENV.DB_NAME,
            charset: 'utf8',
        }
    }
};