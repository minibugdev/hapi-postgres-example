exports.up = function (knex, Promise) {
    return knex
        .schema
        .createTable('users', function (usersTable) {
            // Primary Key
            usersTable.increments();

            // Data
            usersTable.string('uuid', 50).notNullable().index().unique();
            usersTable.string('name', 50).notNullable();
            usersTable.string('username', 50).notNullable().unique();
            usersTable.string('email', 250).notNullable().unique();
            usersTable.string('password', 128).notNullable();

            usersTable.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            usersTable.timestamp('updated_at');
        });
};

exports.down = function (knex, Promise) {
    // We use `...ifExists` because we're not sure if the table's there.
    // Honestly, this is just a safety measure.
    return knex
        .schema
        .dropTableIfExists('users');
};
